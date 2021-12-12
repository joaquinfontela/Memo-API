const ReportsDataBaseHandler = require('./ReportsDataBaseHandler')
const EmployeesDataBaseHandler = require('./EmployeesDataBaseHandler')

class ReportSearcher {

    constructor() {
        this.reportsDbHandler = new ReportsDataBaseHandler({
            user: 'joaquinfontela',
            host: 'localhost',
            database: 'recursos',
            password: 'admin',
            port: 5432,
        })
        this.employeesDbHanbler = new EmployeesDataBaseHandler({
            user: 'joaquinfontela',
            host: 'localhost',
            database: 'recursos',
            password: 'admin',
            port: 5432,
        })
    }

    getAllProjectsNames() {
        // Returns an array with all existent projects in the following format:
        // {id, project name}.
        return [{
            id: 1,
            projectName: 'Pepito App'
        },
        {
            id: 2,
            projectName: 'PSG'
        },
        {
            id: 3,
            projectName: 'ATP'
        },
        {
            id: 4,
            projectName: 'PSA'
        }]
    }

    getReportsByProjectId(projectId, employeeId) {
        // If employee with id 'employeeId' has full access to reports, the function
        // returns all the reports where the project id is 'projectId'.
        // If it has not privileged access, it returns only the reports associated with the employee.
        // The return value is an array of objects in the format:
        // {id, employee name, project name, work name, date, hours dedicated}
        if (this.employeesDbHanbler.employeeHasFullAccess(employeeId)) {
            return this.reportsDbHandler.getReportsByProjectId(projectId)
        } else {
            return this.reportsDbHandler.getReportsByProjectId(projectId, employeeId)
        }
    }

    getAllWorksNamesFromProject(projectId) {
        // Returns an array with all existent works which correspond to project
        // with id 'projectId' in the following format:
        // {id, work name}.
        if (projectId == 1) {
            return [{
                id: 1,
                workName: 'modelado home'
            },
            {
                id: 2,
                workName: 'modelado signup'
            },
            {
                id: 3,
                workName: 'modelado login'
            }]
        } else if (projectId == 2) {
            return [{
                id: 8,
                workName: 'code backend'
            },
            {
                id: 2,
                workName: 'code database'
            }]
        } else {
            return [{
                id: 11,
                workName: 'score a goal'
            }]
        }
    }

    async getReportsByWorkId(workId, employeeId) {
        // If employee with id 'employeeId' has full access to reports, the function
        // returns all the reports where the work id is 'workId'.
        // If it has not privileged access, it returns only the reports associated with the employee.
        // The return value is an array of objects in the format:
        // {id, employee name, project name, work name, date, hours dedicated}
        if (this.employeesDbHanbler.employeeHasFullAccess(employeeId)) {
            return await this.reportsDbHandler.getReportsByWorkId(workId)
        } else {
            return await this.reportsDbHandler.getReportsByWorkId(workId, employeeId)
        }
    }

    async getReportsByDate(init_date, end_date, employeeId) {
        // If employee with id 'employeeId' has full access to reports, the function
        // returns all the reports which were accomplished between 'init_date' and 'end_date'
        // string parameters.
        // If it has not privileged access, it returns only the reports associated with the employee.
        // The return value is an array of objects in the format:
        // {id, employee name, project name, work name, date, hours dedicated} 
        if (this.employeesDbHanbler.employeeHasFullAccess(employeeId)) {
            return await this.reportsDbHandler.getReportsByDate(init_date, end_date)
        } else {
            return await this.reportsDbHandler.getReportsByDate(init_date, end_date, employeeId)
        }
    }
}

module.exports = ReportSearcher