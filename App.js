const EmployeesSearcher = require('./EmployeesSearcher')
const ProjectsApiHandler = require('./ProjectsApiHandler')
const ReportHandler = require('./ReportHandler')
const ReportSearcher = require('./ReportSearcher')
const express = require("express")
const app = express()

var bodyParser = require('body-parser');
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


// Get all proyects.
app.get('/projects', async (req, res) => {
    const data = await projectsApiHandler.getAllProjects()
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all works in project with id 'projectId'.
app.get('/works/:projectId', async (req, res) => {
    const data = await projectsApiHandler.getAllWorksFromProject(req.params.projectId)
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all works done by employee with id 'empId' for work with id 'workId'.
app.get('/works/:workId/:empId', async (req, res) => {
    const data = await reportSearcher.getReportsByWorkAndEmployeeIds(req.params.workId, req.params.empId)
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all reports filtered by (work id or project id or date).

app.get('/reports', async (req, res) => {
    let data
    if (req.body.workId) {
        data = await reportSearcher.getReportsByWorkId(req.body.workId)

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
        req.body.workId,
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


// Necesito: pasar id de una tarea y obtener el id y el nombre del proyecto asociado.
// Necesito: pasar el id de un proyecto y obtener todas sus tareas asociadas (id, nombre).
// Necesito: todos los proyectos (id, nombre).