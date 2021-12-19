const ReportsDataBaseHandler = require('./ReportsDataBaseHandler')
const db_password = require('./db_password')

class ReportHandler {

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
    }


    async deleteReport(reportId) {
        // Deletes the report with id 'reportId' from the database.
        return await this.reportsDbHandler.deleteReport(reportId)
    }


    async saveReport(employeeId, taskId,
        date, hours, minutes, description) {
        // Saves a new report into the database with:
        // 'date' parameter as a string in the following format: 'yyyy/mm/dd'.
        // 'hours' parameter being an integer indicating the entire hours dedicated to the task.
        // 'minutes' parameter being an integer indicating the extra minutes dedicated to the task 
        //           out of entire hours.
        if (hours * 60 + minutes > 480) {
            return { status: 400, statusMsg: "Report time exceeded (max. is 8 hours)." }
        } else if (new Date() < new Date(date)) {
            return { status: 400, statusMsg: "Future date provided." }
        }
        return await this.reportsDbHandler.saveReport(employeeId, taskId,
            date, hours * 60 + minutes, description)
    }


    async updateReport(reportId, hours, minutes) {
        // Updates the time destined to report with id 'reportId' in the database.
        return await this.reportsDbHandler.updateReport(reportId, hours * 60 + minutes)
    }

}

module.exports = ReportHandler