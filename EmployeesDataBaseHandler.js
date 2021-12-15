const { Client } = require('pg')



class EmployeesDataBaseHandler {

    constructor(connection_data) {
        this.client = new Client(connection_data)
        this.client.connect()
    }

    async getEmployees() {
        // Returns all employees registered in the system.
        const res = await this.client.query('SELECT * FROM public.resources')
        return res.rows
    }

    async getEmployeesWithIds(ids) {
        // Returns all employees with ids in 'ids' array in the system.
        const res = await this.client.query(`SELECT * FROM public.resources 
                                             WHERE id in (${ids})
                                            `)
        return res.rows
    }
}

module.exports = EmployeesDataBaseHandler