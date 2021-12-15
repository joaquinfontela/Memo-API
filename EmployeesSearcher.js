const EmployeesDataBaseHandler = require('./EmployeesDataBaseHandler')
const db_password = require('./db_password')

class EmployeesSearcher {

    constructor() {
        this.empDbHandler = new EmployeesDataBaseHandler({
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

    async getEmployees() {
        // Returns all employees registered in the system.
        return await this.empDbHandler.getEmployees()
    }

    async getEmployeesWithIds(ids) {
        // Returns all employees with ids in 'ids' array in the system.
        return await this.empDbHandler.getEmployeesWithIds(ids)
    }
}

module.exports = EmployeesSearcher