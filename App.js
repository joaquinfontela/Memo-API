const ReportHandler = require('./ReportHandler')
const ReportSearcher = require('./ReportSearcher')
const express = require("express")
const EmployeesSearcher = require('./EmployeesSearcher')
const app = express()

let reportSearcher = new ReportSearcher()
let reportHandler = new ReportHandler()
let empSearcher = new EmployeesSearcher()


// Get all available employees names

app.get('/employees/available', (req, res) => {
    const data = empSearcher.getAllAvailableEmployees()
    res.status(201).json({
        status: 'OK',
        data: data
    })
})

// Get all employees with ids received.
app.get('/employees', async (req, res) => {
    const data = await empSearcher.getEmployees(req.body.ids)
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all proyects names.

app.get('/projects', (req, res) => {
    const data = reportSearcher.getAllProjectsNames()
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all works in project with id 'projectId'.

app.get('/works/:projectId', (req, res) => {
    const data = reportSearcher.getAllWorksNamesFromProject(req.params.projectId)
    res.status(201).json({
        status: 'OK',
        data: data
    })
})


// Get all reports accessible by empId filtered by (work id or project id or date).

app.get('/reports/:empId', async (req, res) => {
    let data
    if (req.body.workId) {
        data = await reportSearcher.getReportsByWorkId(req.body.workId, req.params.empId)

    } else if (req.body.projectId) {
        data = await reportSearcher.getReportsByProjectId(req.body.projectId, req.params.empId)

    } else {
        data = await reportSearcher.getReportsByDate(req.body.init_date, req.body.end_date, req.params.empId)
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