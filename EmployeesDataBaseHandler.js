const { Client } = require('pg')



class EmployeesDataBaseHandler {

    constructor(connection_data) {
        this.client = new Client(connection_data)
        this.client.connect()
    }

    getAllAvailableEmployees() {
        return [{
            id: 1,
            name: 'Joaquín',
            lastName: 'Betz'
        },
        {
            id: 2,
            name: 'Joaquín',
            lastName: 'Fontela'
        },
        {
            id: 3,
            name: 'Christian',
            lastName: 'Reyes'
        },
        {
            id: 4,
            name: 'Guido',
            lastName: 'Movia'
        }]
    }

    employeeHasFullAccess(employeeId) {
        return (employeeId == 1)
    }

    async getEmployee(id) {
        const res = await this.client.query(`SELECT * FROM hours.resources WHERE id = ${id}`)
        return res.rows[0]
    }
}

module.exports = EmployeesDataBaseHandler