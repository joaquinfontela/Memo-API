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
        const res = await this.client.query(`SELECT resources.id, name, last_name, task_id, date, minutes 
                                           FROM public.assigned_time 
                                           INNER JOIN public.resources ON resources.id = assigned_time.resource_id
                                           WHERE date BETWEEN '${init_date}':: date AND '${end_date}':: date
                                        `)
        return res.rows
    }


    getReportsByProjectId(projectId) {
        // Returns all the reports where the project id is 'projectId'.
        // The return value is an array of objects in the format:
        // {id, employee name, employee last name, task id, date, minutes dedicated}
        if (projectId == 1) {
            return [{
                id: 1,
                name: 'Joaquín',
                last_name: 'Pepito App',
                task_id: 1,
                date: '2/4/2022',
                minutes: 180
            },
            {
                id: 2,
                name: 'Joaquín',
                last_name: 'Betz',
                task_id: 4,
                date: '2/4/2022',
                minutes: 120
            },
            {
                id: 3,
                name: 'Joaquín',
                last_name: 'Betz',
                task_id: 2,
                date: '2/4/2022',
                minutes: 240
            }]
        }

        else {
            return [{
                id: 7,
                name: 'Lionel',
                last_name: 'Messi',
                task_id: 4,
                date: '21/11/2021',
                minutes: 90
            },
            {
                id: 8,
                name: 'Daniil',
                last_name: 'Medvedev',
                task_id: 11,
                date: '20/11/2021',
                minutes: 120
            },
            {
                id: 9,
                name: 'Joaquín',
                last_name: 'Fontela',
                task_id: 3,
                date: '24/11/2021',
                minutes: 180
            }]
        }
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
        const res = await this.client.query(`SELECT resources.id, name, last_name, task_id, date, minutes
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
}

module.exports = ReportsDataBaseHandler