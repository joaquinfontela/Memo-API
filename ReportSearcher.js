const ReportsDataBaseHandler = require('./ReportsDataBaseHandler')
const EmployeesDataBaseHandler = require('./EmployeesDataBaseHandler')
const ProjectsApiHandler = require('./ProjectsApiHandler')
const db_password = require('./db_password')

class ReportSearcher {

    constructor() {
        this.reportsDbHandler = new ReportsDataBaseHandler({
            user: 'fqhdvfjibpslvq',
            host: 'ec2-52-86-177-34.compute-1.amazonaws.com',
            database: 'd591fltfo2mqg4',
            password: process.env.DATABASE_PASSWORD || db_password,
            port: 5432,
            ssl: {
                rejectUnauthorized: false
            }
        })
        this.employeesDbHanbler = new EmployeesDataBaseHandler({
            user: 'fqhdvfjibpslvq',
            host: 'ec2-52-86-177-34.compute-1.amazonaws.com',
            database: 'd591fltfo2mqg4',
            password: process.env.DATABASE_PASSWORD || db_password,
            port: 5432,
            ssl: {
                rejectUnauthorized: false
            }
        })
        this.projectsApiHandler = new ProjectsApiHandler()
    }


    async getReports() {
        const projects = await this.projectsApiHandler.getAllProjects()
        const projectDict = this.getProjectDict(projects)

        const tasks = await this.projectsApiHandler.getAllTasks()
        const taskDict = this.getTaskDict(tasks)

        const reports = await this.reportsDbHandler.getReports()

        let updatedReports = []
        for (let report of reports) {
            if (!taskDict[report.task_id]) {
                report.project = 'Deleted project'
                report.task = 'Deleted task'
            } else {
                const projectId = taskDict[report.task_id].project_id
                const projectName = projectDict[projectId]
                const taskName = taskDict[report.task_id].name

                report.project = projectName
                report.task = taskName
            }
            delete report.task_id
            updatedReports.push(report)
        }

        return updatedReports
    }


    async getReportsByDate(init_date, end_date) {
        // The function returns all the reports which were accomplished between 'init_date' and 'end_date'
        // string parameters.
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, project name, task name, date, minutes dedicated}
        const projects = await this.projectsApiHandler.getAllProjects()
        const projectDict = this.getProjectDict(projects)

        const tasks = await this.projectsApiHandler.getAllTasks()
        const taskDict = this.getTaskDict(tasks)

        const reports = await this.reportsDbHandler.getReportsByDate(init_date, end_date)

        let updatedReports = []
        for (let report of reports) {
            if (!taskDict[report.task_id]) {
                report.project = 'Deleted project'
                report.task = 'Deleted task'
            } else {
                const projectId = taskDict[report.task_id].project_id
                const projectName = projectDict[projectId]
                const taskName = taskDict[report.task_id].name

                report.project = projectName
                report.task = taskName
            }
            delete report.task_id
            updatedReports.push(report)

        }

        return updatedReports
    }


    async getReportsByProjectId(projectId) {
        // The function returns all the reports where the project id is 'projectId'.
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, project name, task name, date, minutes dedicated}
        const projects = await this.projectsApiHandler.getAllProjects()
        const project = projects.filter(p => (p.id === projectId))[0]
        if (project == undefined) return []

        const tasks = await this.projectsApiHandler.getAllTasksFromProject(projectId)

        let reports = []
        for (let task of tasks) {
            const newReports = await this.reportsDbHandler.getReportsByTaskId(task.id)
            for (let report of newReports) {

                const task = tasks.filter(w => (w.id === report.task_id))[0]
                let taskName
                if (task == undefined) {
                    taskName = 'Deleted task'
                } else {
                    taskName = task.name
                }

                report.project = project.name
                report.task = taskName
                delete report.task_id
                reports.push(report)
            }
        }

        return reports
    }


    async getReportsByTaskId(taskId) {
        // The function returns all the reports where the task id is 'taskId'.
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, project name, task name, date, minutes dedicated}
        const projectId = await this.projectsApiHandler.getProjectIdAssociatedToTask(taskId)
        if (projectId == undefined) return []

        const projects = await this.projectsApiHandler.getAllProjects()
        const projectName = projects.filter(p => (p.id === projectId))[0].name

        const tasks = await this.projectsApiHandler.getAllTasksFromProject(projectId)
        const task = tasks.filter(w => (w.id === taskId))[0]
        if (task == undefined) return []

        const taskName = task.name

        const reports = await this.reportsDbHandler.getReportsByTaskId(taskId)

        let updatedReports = []
        for (let report of reports) {
            report.project = projectName
            report.task = taskName
            delete report.task_id
            updatedReports.push(report)
        }

        return updatedReports
    }


    async getTimeDestinedToProject(projectId) {
        // The function returns the time in minutes destined to all the reports where 
        // the project id is 'projectId'.
        const tasks = await this.projectsApiHandler.getAllTasksFromProject(projectId)
        if (!tasks[0]) return 0
        const tasksIds = tasks.map(t => t.id)
        return await this.reportsDbHandler.getTimeDestinedToTasks(tasksIds)
    }


    getProjectDict(projects) {
        let dict = {}
        for (let p of projects) {
            dict[p.id] = p.name
        }
        return dict
    }


    getTaskDict(tasks) {
        let dict = {}
        for (let t of tasks) {
            dict[t.id] = {
                name: t.name,
                project_id: t.id_project
            }
        }
        return dict
    }
}
module.exports = ReportSearcher