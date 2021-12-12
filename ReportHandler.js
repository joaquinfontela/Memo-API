const ReportsDataBaseHandler = require('./ReportsDataBaseHandler')

class ReportHandler {

    constructor() {
        this.reportsDbHandler = new ReportsDataBaseHandler({
            user: 'joaquinfontela',
            host: 'localhost',
            database: 'recursos',
            password: 'admin',
            port: 5432,
        })
    }

    async saveReport(employeeId, workId,
        date, hours, minutes, description) {
        // Saves a new report into the database with:
        // 'date' parameter as a string in the following format: 'yyyy/mm/dd'.
        // 'hours' parameter being an integer indicating the entire hours dedicated to the work.
        // 'minutes' parameter being an integer indicating the extra minutes dedicated to the work 
        //           out of entire hours.
        return await this.reportsDbHandler.saveReport(employeeId, workId,
            date, hours * 60 + minutes, description)
    }

    async deleteReport(reportId) {
        // Deletes the report with id 'reportId' from the database.
        return await this.reportsDbHandler.deleteReport(reportId)
    }
}

module.exports = ReportHandler