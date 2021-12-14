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
            password: db_password,
            port: 5432,
            ssl: {
                rejectUnauthorized: false
            }
        })
        this.employeesDbHanbler = new EmployeesDataBaseHandler({
            user: 'fqhdvfjibpslvq',
            host: 'ec2-52-86-177-34.compute-1.amazonaws.com',
            database: 'd591fltfo2mqg4',
            password: db_password,
            port: 5432,
            ssl: {
                rejectUnauthorized: false
            }
        })
        this.projectsApiHandler = new ProjectsApiHandler()
    }


    async getReportsByDate(init_date, end_date) {
        // The function returns all the reports which were accomplished between 'init_date' and 'end_date'
        // string parameters.
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, project name, task name, date, minutes dedicated}
        const reports = await this.reportsDbHandler.getReportsByDate(init_date, end_date)

        let updatedReports = []
        for (let report of reports) {
            const updatedReport = await this.updateReportTaskAndProyectName(report)
            updatedReports.push(updatedReport)
        }

        return updatedReports
    }


    async getReportsByProjectId(projectId) {
        // The function returns all the reports where the project id is 'projectId'.
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, project name, task name, date, minutes dedicated}
        const tasks = await this.projectsApiHandler.getAllTasksFromProject(projectId)

        let reports = []
        for (let task of tasks) {
            const newReports = await this.reportsDbHandler.getReportsByTaskId(task.id)
            for (let report of newReports) {
                const updatedReport = await this.updateReportTaskAndProyectName(report, tasks)
                reports.push(updatedReport)
            }
        }

        return reports
    }


    async getReportsByTaskAndEmployeeIds(taskId, employeeId) {
        // The function returns all the reports where the task id is 'taskId' and
        // the employee id is 'employeeId'.
        // The return value is an array of objects in the format:
        // {date, minutes dedicated}
        return await this.reportsDbHandler.getReportsByTaskAndEmployeeIds(taskId, employeeId)
    }


    async getReportsByTaskId(taskId) {
        // The function returns all the reports where the task id is 'taskId'.
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, project name, task name, date, minutes dedicated}
        const reports = await this.reportsDbHandler.getReportsByTaskId(taskId)

        let updatedReports = []
        for (let report of reports) {
            const updatedReport = await this.updateReportTaskAndProyectName(report)
            updatedReports.push(updatedReport)
        }

        return updatedReports
    }

    async updateReportTaskAndProyectName(report, tasks = undefined) {
        // Receives 'report', an object representing a report as a parameter
        // and an optional parameter 'tasks' which represents the tasks associated with the project
        // in which the report took place.
        // Returns the report updated with additional attributes: 'project' (name) and 'task' (name)
        // and deletes its task_id attribute.
        const projectId = await this.projectsApiHandler.getProjectIdAssociatedToTask(report.task_id)

        const projects = await this.projectsApiHandler.getAllProjects()
        const projectName = projects.filter(p => (p.id === projectId))[0].name

        if (!tasks) {
            tasks = await this.projectsApiHandler.getAllTasksFromProject(projectId)
        }
        console.log(tasks, report.task_id)
        const taskName = tasks.filter(w => (w.id === report.task_id))[0].name

        report.project = projectName
        report.task = taskName
        delete report.task_id

        return report
    }
}
module.exports = ReportSearcher