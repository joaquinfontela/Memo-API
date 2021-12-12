const EmployeesDataBaseHandler = require('./EmployeesDataBaseHandler')

class EmployeesSearcher {

    constructor() {
        this.empDbHandler = new EmployeesDataBaseHandler({
            user: 'joaquinfontela',
            host: 'localhost',
            database: 'recursos',
            password: 'admin',
            port: 5432,
        })
    }

    async getEmployees(ids) {
        let employees = []
        for (const id of ids) {
            const employee = await this.empDbHandler.getEmployee(id)
            employees.push(employee)
        }
        return employees
    }

    getAllAvailableEmployees() {
        return this.empDbHandler.getAllAvailableEmployees()
    }
}

module.exports = EmployeesSearcher