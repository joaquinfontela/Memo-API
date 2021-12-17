const EmployeesSearcher = require('./EmployeesSearcher')
const ProjectsApiHandler = require('./ProjectsApiHandler')
const ReportHandler = require('./ReportHandler')
const ReportSearcher = require('./ReportSearcher')
const express = require("express")
const cors = require("cors")
var bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.options('*', cors())

let reportSearcher = new ReportSearcher()
let reportHandler = new ReportHandler()
let empSearcher = new EmployeesSearcher()
let projectsApiHandler = new ProjectsApiHandler()


// Get all employees.
app.get('/employees/all', async (req, res) => {
    const data = await empSearcher.getEmployees()
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all employees with ids in 'req.body.ids'
app.get('/employees', async (req, res) => {
    const data = await empSearcher.getEmployeesWithIds(req.body.ids)
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


// Get all time destined to project with id 'projectId'.
app.get('/reports/time/:projectId', async (req, res) => {
    const data = await reportSearcher.getTimeDestinedToProject(req.params.projectId)
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

    } else if (req.body.init_date && req.body.end_date) {
        data = await reportSearcher.getReportsByDate(req.body.init_date, req.body.end_date)
    } else {
        data = await reportSearcher.getReports()
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


// Update report with id 'repId' with new time.
app.put('/reports/:repId', async (req, res) => {
    const status = await reportHandler.updateReport(req.params.repId, req.body.hours, req.body.minutes)
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


app.listen(process.env.PORT || 3000)