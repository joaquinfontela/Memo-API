const EmployeesSearcher = require('./EmployeesSearcher')
const ProjectsApiHandler = require('./ProjectsApiHandler')
const ReportHandler = require('./ReportHandler')
const ReportSearcher = require('./ReportSearcher')
const express = require("express")
var bodyParser = require('body-parser');
const app = express()


app.set('port', process.env.PORT || 4000)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let reportSearcher = new ReportSearcher()
let reportHandler = new ReportHandler()
let empSearcher = new EmployeesSearcher()
let projectsApiHandler = new ProjectsApiHandler()


// Get all employees.
app.get('/employees', async (req, res) => {
    const data = await empSearcher.getEmployees()
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all projects.
app.get('/projects', async (req, res) => {
    const data = await projectsApiHandler.getAllProjects()
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all tasks in project with id 'projectId'.
app.get('/tasks/:projectId', async (req, res) => {
    const data = await projectsApiHandler.getAllTasksFromProject(req.params.projectId)
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all tasks done by employee with id 'empId' for tasks with id 'tasksId'.
app.get('/tasks/:taskId/:empId', async (req, res) => {
    const data = await reportSearcher.getReportsByTaskAndEmployeeIds(req.params.taskId, req.params.empId)
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all reports filtered by (task id or project id or date).
app.get('/reports', async (req, res) => {
    let data
    if (req.body.taskId) {
        data = await reportSearcher.getReportsByTaskId(req.body.taskId)

    } else if (req.body.projectId) {
        data = await reportSearcher.getReportsByProjectId(req.body.projectId)

    } else {
        data = await reportSearcher.getReportsByDate(req.body.init_date, req.body.end_date)
    }
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Create new report with params specified in req.body
app.post('/reports', async (req, res) => {
    let status = await reportHandler.saveReport(req.body.employeeId,
        req.body.taskId,
        req.body.date,
        req.body.hours,
        req.body.minutes,
        req.body.description)
    res.status(201).json({
        status: status
    })
})


// Delete reports with id 'id'.
app.delete('/reports/:id', async (req, res) => {
    let status = await reportHandler.deleteReport(req.params.id)
    res.status(201).json({
        status: status
    })
})

app.listen(3000)