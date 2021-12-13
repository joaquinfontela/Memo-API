const { Client } = require('pg')



class EmployeesDataBaseHandler {

    constructor(connection_data) {
        this.client = new Client(connection_data)
        this.client.connect()
    }

    async getEmployees() {
        const res = await this.client.query('SELECT * FROM public.resources')
        return res.rows
    }
}

module.exports = EmployeesDataBaseHandler