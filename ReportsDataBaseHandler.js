const { Client } = require('pg')


class ReportsDataBaseHandler {

    constructor(connection_data) {
        this.client = new Client(connection_data)
        this.client.connect()
    }

    async saveReport(employeeId, workId, date,
        duration, description) {
        // Saves the report in the database.
        // 'date' parameter as a string in the following format: 'yyyy/mm/dd'.
        // 'duration' parameter indicates the duration of the task in minutes.
        await this.client.query(`   INSERT INTO hours.assigned_time
                                    (minutes, date, resource_id, work_id, description)
                                    VALUES
                                    (${duration}, '${date}'::date, ${employeeId}, ${workId}, '${description}')
                                    `)
        return { status: "OK" }
    }

    async deleteReport(reportId) {
        // Deletes the report with id 'reportId' from the database.
        await this.client.query(`   DELETE FROM hours.assigned_time
                                    WHERE id = ${reportId}
                                    `)
        return { status: "OK" }
    }

    getReportsByProjectId(projectId, employeeId = undefined) {
        // Returns all the reports where the project id is 'projectId'
        // if 'employeeId' is undefined, else it only returns those
        // reports which correspond to the employee with id 'employeeId'.
        // The return value is an array of objects in the format:
        // {id, employee name, project name, work name, date, hours dedicated}
        if (projectId == 1) {
            return [{
                id: 1,
                emp_name: 'Joaquín Betz',
                project_name: 'Pepito App',
                work: 'modelado home',
                date: '2/4/2022',
                hours: 3
            },
            {
                id: 2,
                emp_name: 'Joaquín Betz',
                project_name: 'Pepito App',
                work: 'modelado login',
                date: '2/4/2022',
                hours: 2
            },
            {
                id: 3,
                emp_name: 'Joaquín Betz',
                project_name: 'Pepito App',
                work: 'modelado signup',
                date: '2/4/2022',
                hours: 4
            }]
        }

        else {
            return [{
                id: 7,
                emp_name: 'Lionel Messi',
                project_name: 'PSG',
                work: 'score a goal',
                date: '21/11/2021',
                hours: 1.5
            },
            {
                id: 8,
                emp_name: 'Daniil Medvedev',
                project_name: 'ATP World Tour',
                work: 'Get into the final of ATP Finals',
                date: '20/11/2021',
                hours: 2
            },
            {
                id: 9,
                emp_name: 'Joaquín Fontela',
                project_name: 'PSA',
                work: 'code backend',
                date: '24/11/2021',
                hours: 3
            }]
        }
    }

    async getReportsByWorkId(workId, employeeId = undefined) {
        // Returns all the reports where the work id is 'workId'
        // if 'employeeId' is undefined, else it only returns those
        // reports which correspond to the employee with id 'employeeId'.
        // The return value is an array of objects in the format:
        // {id, employee name, project name, work name, date, hours dedicated}
        let res
        if (employeeId) {
            res = await this.client.query(`SELECT resources.id, name, last_name, work_id, date, minutes 
                                           FROM hours.assigned_time 
                                           INNER JOIN hours.resources ON resources.id = assigned_time.resource_id
                                           WHERE resource_id = ${employeeId} AND work_id = ${workId}
            `)
        } else {
            res = await this.client.query(`SELECT resources.id, name, last_name, work_id, date, minutes
                                           FROM hours.assigned_time 
                                           INNER JOIN hours.resources ON resources.id = assigned_time.resource_id
                                           WHERE work_id = ${workId}
            `)
        }
        return res.rows
        // return [{
        //     id: 1,
        //     emp_name: 'Joaquín Betz',
        //     project_name: 'Pepito App',
        //     work: 'modelado home',
        //     date: '2/4/2022',
        //     hours: 3
        // }
    }

    async getReportsByDate(init_date, end_date, employeeId = undefined) {
        // Returns all the reports which were accomplished between 'init_date' and 'end_date'
        // string parameters.
        // if 'employeeId' is undefined, else it only returns those
        // reports which correspond to the employee with id 'employeeId'.
        // The return value is an array of objects in the format:
        // {id, employee name, project name, work name, date, hours dedicated}
        let res
        if (employeeId) {
            res = await this.client.query(`SELECT resources.id, name, last_name, work_id, date, minutes 
                                           FROM hours.assigned_time 
                                           INNER JOIN hours.resources ON resources.id = assigned_time.resource_id
                                           WHERE date BETWEEN '${init_date}':: date AND '${end_date}':: date
                                           AND resource_id = ${employeeId}
            `)
        } else {
            res = await this.client.query(`SELECT resources.id, name, last_name, work_id, date, minutes 
                                           FROM hours.assigned_time 
                                           INNER JOIN hours.resources ON resources.id = assigned_time.resource_id
                                           WHERE date BETWEEN '${init_date}':: date AND '${end_date}':: date
            `)
        }
        return res.rows
        // return [{
        //     id: 1,
        //     emp_name: 'Joaquín Betz',
        //     project_name: 'Pepito App',
        //     work: 'modelado home',
        //     date: '2/4/2022',
        //     hours: 3
        // }
    }

}

module.exports = ReportsDataBaseHandler