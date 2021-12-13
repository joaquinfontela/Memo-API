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
        // {id, employee name, employee last name, project name, work name, date, hours dedicated}
        const reports = await this.reportsDbHandler.getReportsByDate(init_date, end_date)

        let updatedReports = []
        for (let report of reports) {
            const updatedReport = await this.updateReportWorkAndProyectName(report)
            updatedReports.push(updatedReport)
        }

        return updatedReports
    }


    async getReportsByProjectId(projectId) {
        // The function returns all the reports where the project id is 'projectId'.
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, project name, work name, date, hours dedicated}
        const works = await this.projectsApiHandler.getAllWorksFromProject(projectId)

        let reports = []
        for (let work of works) {
            const newReports = await this.reportsDbHandler.getReportsByWorkId(work.id)
            for (let report of newReports) {
                const updatedReport = await this.updateReportWorkAndProyectName(report, works)
                reports.push(updatedReport)
            }
        }

        return reports
    }


    async getReportsByWorkAndEmployeeIds(workId, employeeId) {
        return await this.reportsDbHandler.getReportsByWorkAndEmployeeIds(workId, employeeId)
    }


    async getReportsByWorkId(workId) {
        // The function returns all the reports where the work id is 'workId'.
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, project name, work name, date, hours dedicated}
        const reports = await this.reportsDbHandler.getReportsByWorkId(workId)

        let updatedReports = []
        for (let report of reports) {
            const updatedReport = await this.updateReportWorkAndProyectName(report)
            updatedReports.push(updatedReport)
        }

        return updatedReports
    }

    async updateReportWorkAndProyectName(report, works = undefined) {
        const projectId = await this.projectsApiHandler.getProjectIdAssociatedToWork(report.work_id)

        const projects = await this.projectsApiHandler.getAllProjects()
        const projectName = projects.filter(p => (p.id === projectId))[0].name

        if (!works) {
            works = await this.projectsApiHandler.getAllWorksFromProject(projectId)
        }
        console.log(works, report.work_id)
        const workName = works.filter(w => (w.id === report.work_id))[0].name

        report.project = projectName
        report.work = workName
        delete report.work_id

        return report
    }
}
module.exports = ReportSearcher