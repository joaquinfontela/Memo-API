const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const ReportsHandler = require('../../ReportHandler')
const ReportsSearcher = require('../../ReportSearcher')
const ProjectsApiHandler = require('../../ProjectsApiHandler')
const EmployeesSearcher = require('../../EmployeesSearcher');
const { start } = require('repl');
const ReportHandler = require('../../ReportHandler');

reportsHandler = new ReportHandler()
projectsApiHandler = new ProjectsApiHandler()
reportsSearcher = new ReportsSearcher()
employeesSearcher = new EmployeesSearcher()


Given('User selected an existent project', async function () {
    projects = await projectsApiHandler.getAllProjects()
    this.project = projects[0]
})

Given('User selected an existent work', async function () {
    tasks = await projectsApiHandler.getAllTasksFromProject(this.project.id)
    this.task = tasks[0]
})

When('User enters eight or less hours of work', async function () {
    hours = 4
    minutes = 22
    assert(hours * 60 + minutes <= 480)
    this.res = await reportsHandler.saveReport(1, this.task.id,
        '2021-12-18', hours, minutes, 'random description')
})

Then('System informs the report was successful', function () {
    assert(this.res.status === 201)
})


When('User enters more than eight hours of work', async function () {
    hours = 9
    minutes = 33
    assert(hours * 60 + minutes > 480)
    this.res = await reportsHandler.saveReport(1, this.task.id,
        '2021-12-18', hours, minutes, 'random description')
})

Then('System informs there was en error in work hours entered', function () {
    assert(this.res.status === 400)
    assert(this.res.statusMsg === "Report time exceeded (max. is 8 hours).")
})


Given('User with id {int} reported {int} hours and {int} minutes of work', async function (userId, hoursAmnt, minutesAmnt) {
    this.empId = userId
    tasks = await projectsApiHandler.getAllTasks()
    taskId = tasks[0].id
    await reportsHandler.saveReport(userId, taskId,
        '2021-12-18', hoursAmnt, minutesAmnt, 'rndm description')
})

When('User with id {int} queries his reported hours', async function (userId) {
    this.reports = await reportsSearcher.getReports()
})

Then('System will inform one report with its date, project, work, user name and {int} hours and {int} minutes of work', async function (hoursAmnt, minutesAmnt) {
    employees = await employeesSearcher.getEmployees()
    employee = employees.filter(e => e.id === this.empId)[0]
    result = this.reports.filter(r => ((r.name === employee.name) &&
        (r.last_name === employee.last_name) &&
        (r.minutes === hoursAmnt * 60 + minutesAmnt)))[0]
    assert(result != undefined)
    await reportsHandler.deleteReport(result.id)
})


Given('User did not report its hours', function () {
    this.empId = 4365365
    // very large number as to not exist => he didn't report his hours.
    this.empName = 'George'
    this.empLastName = 'Unexistent'
})

When('User queries reported hours', async function () {
    this.reports = await reportsSearcher.getReports()
})

Then('System will inform there is not hour report information to be shown', function () {
    result = this.reports.filter(r => ((r.name === this.empName) &&
        (r.last_name === this.empLastName)))[0]
    assert(!result)
})


Given('I am an user', function () { })

When('User consults projects', async function () {
    this.projects = await projectsApiHandler.getAllProjects()
})

Then('System informs about each of the existent projects', function () {
    assert(this.projects[0])
    this.projects.forEach(p => assert(p.id && p.name))
})


Given('There is a list of existent projects', async function () {
    this.projects = await projectsApiHandler.getAllProjects()
})

When('User selects a project from the list of existent projects', async function () {
    projectSelected = this.projects[0]
    this.tasks = await projectsApiHandler.getAllTasksFromProject(projectSelected.id)
})

Then('System will inform all works corresponding to the selected project', function () {
    this.projects.forEach(p => assert(p.id && p.name))
})


Given('User selects an {int} hour and {int} minutes report', async function (hoursAmnt, minutesAmnt) {
    employees = await employeesSearcher.getEmployees()
    employee = employees[0]

    tasks = await projectsApiHandler.getAllTasks()
    taskId = tasks[0].id

    await reportsHandler.saveReport(employee.id, taskId,
        '2021-12-18', hoursAmnt, minutesAmnt, 'rndm description')
    // saving report so we can then get it

    reports = await reportsSearcher.getReports()
    this.report = reports.filter(r => ((r.name === employee.name) && (r.last_name === employee.last_name) &&
        (r.minutes === hoursAmnt * 60 + minutesAmnt)))[0]
})

When('User edits the amount of reported hours to {int} and {int} minutes on report', async function (hoursAmnt, minutesAmnt) {
    await reportsHandler.updateReport(this.report.id, hoursAmnt, minutesAmnt)
})

Then('System will update the amount of reported hours to {int} and {int} minutes on report', async function (hoursAmnt, minutesAmnt) {
    reports = await reportsSearcher.getReports()
    this.report = reports.filter(r => r.id === this.report.id)[0]
    assert(this.report.minutes === hoursAmnt * 60 + minutesAmnt)
})


Given('User with id {int} made an {int} hour and {int} minutes report', async function (userId, hoursAmnt, minutesAmnt) {
    employees = await employeesSearcher.getEmployees()
    employee = employees.filter(e => e.id === userId)[0]

    tasks = await projectsApiHandler.getAllTasks()
    taskId = tasks[0].id

    await reportsHandler.saveReport(employee.id, taskId,
        '2021-12-18', hoursAmnt, minutesAmnt, 'rndm description')
    // saving report so we can then get it

    reports = await reportsSearcher.getReports()
    this.report = reports.filter(r => ((r.name === employee.name) && (r.last_name === employee.last_name) &&
        (r.minutes === hoursAmnt * 60 + minutesAmnt)))[0]
})

When('User deletes the report', async function () {
    await reportsHandler.deleteReport(this.report.id)
})

Then('System will not find the report', async function () {
    reports = await reportsSearcher.getReports()
    this.report = reports.filter(r => r.id === this.report.id)[0]
    assert(this.report === undefined)
})


Given('I want to make a query', async function () { })

When('I enter a starting date {string}', async function (startingDate) {
    this.startingDate = startingDate
})

When('I enter an ending date {string}', async function (endingDate) {
    this.endingDate = endingDate
})

Then('System will show date, project, work, employee name and hours of each report in the date range selected', async function () {
    reports = await reportsSearcher.getReportsByDate(this.startingDate, this.endingDate)
    reports.forEach(r => assert(new Date(r.date) >= new Date(this.startingDate) && (new Date(r.date) <= new Date(this.endingDate))))
})


When('User consults reports filtered by project', async function () {
    projects = await projectsApiHandler.getAllProjects()
    this.project = projects[0]
    this.reports = await reportsSearcher.getReportsByProjectId(this.project.id)

})

Then('System informs about each of the existent reports corresponding to the project', function () {
    this.reports.forEach(r => r.name === this.project.name)
})


When('User consults reports filtered by task', async function () {
    tasks = await projectsApiHandler.getAllTasks()
    this.task = tasks[0]
    this.reports = await reportsSearcher.getReportsByTaskId(this.task.id)

})

Then('System informs about each of the existent reports corresponding to the task', function () {
    this.reports.forEach(r => r.name === this.task.name)
})