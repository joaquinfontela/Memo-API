const { Client } = require('pg')


class ReportsDataBaseHandler {

    constructor(connection_data) {
        this.client = new Client(connection_data)
        this.client.connect()
    }


    async deleteReport(reportId) {
        // Deletes the report with id 'reportId' from the database.
        await this.client.query(`   DELETE FROM public.assigned_time
                                    WHERE id = ${reportId}
                                    `)
        return { status: "OK" }
    }


    async getReportsByDate(init_date, end_date) {
        // Returns all the reports which were accomplished between 'init_date' and 'end_date'
        // string parameters.
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, task id, date, minutes dedicated}
        const res = await this.client.query(`SELECT assigned_time.id, name, last_name, task_id, date, minutes 
                                           FROM public.assigned_time 
                                           INNER JOIN public.resources ON resources.id = assigned_time.resource_id
                                           WHERE date BETWEEN '${init_date}':: date AND '${end_date}':: date
                                        `)
        return res.rows
    }


    async getReportsByTaskAndEmployeeIds(taskId, employeeId) {
        // The function returns all the reports where the task id is 'taskId' and
        // the employee id is 'employeeId'.
        // The return value is an array of objects in the format:
        // {date, minutes dedicated}
        const res = await this.client.query(`SELECT date, minutes
                                           FROM public.assigned_time 
                                           WHERE task_id = ${taskId} AND resource_id = ${employeeId}
                                            `)

        return res.rows
    }


    async getReportsByTaskId(taskId) {
        // Returns all the reports where the task id is 'taskId'
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, task id, date, minutes dedicated}
        const res = await this.client.query(`SELECT assigned_time.id, name, last_name, task_id, date, minutes
                                           FROM public.assigned_time 
                                           INNER JOIN public.resources ON resources.id = assigned_time.resource_id
                                           WHERE task_id = ${taskId}
                                            `)

        return res.rows
    }


    async saveReport(employeeId, taskId, date,
        duration, description) {
        // Saves the report in the database.
        // 'date' parameter as a string in the following format: 'yyyy/mm/dd'.
        // 'duration' parameter indicates the duration of the task in minutes.
        await this.client.query(`   INSERT INTO public.assigned_time
                                    (minutes, date, resource_id, task_id, description)
                                    VALUES
                                    (${duration}, '${date}'::date, ${employeeId}, ${taskId}, '${description}')
                                    `)
        return { status: "OK" }
    }


    async updateReport(reportId, minutes) {
        await this.client.query(`UPDATE public.assigned_time
                                 SET minutes = ${minutes}
                                 WHERE id = ${reportId})
                                `)
        return { status: "OK" }
    }
}

module.exports = ReportsDataBaseHandler