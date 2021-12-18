const EmployeesSearcher = require('./EmployeesSearcher')
const ProjectsApiHandler = require('./ProjectsApiHandler')
const ReportHandler = require('./ReportHandler')
const ReportSearcher = require('./ReportSearcher')
const express = require("express")
const cors = require("cors")
var bodyParser = require('body-parser')
const app = express()

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "Customer API",
            description: "Customer API Information",
            contact: {
                name: "Amazing Developer"
            },
            servers: ["http://localhost:3000", "https://arcane-journey-13639.herokuapp.com/"]
        }
    },
    // ['.routes/*.js']
    apis: ["App.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.options('*', cors())

let reportSearcher = new ReportSearcher()
let reportHandler = new ReportHandler()
let empSearcher = new EmployeesSearcher()
let projectsApiHandler = new ProjectsApiHandler()


/**
 * @swagger
 * /employees/all:
 *  get:
 *    description: Use to request all employees
 *    responses:
 *      '201':
 *        description: A successful response
 */
app.get('/employees/all', async (req, res) => {
    const data = await empSearcher.getEmployees()
    res.status(201).json({
        status: 'OK',
        data: data
    })
});


// // Get all employees with ids in 'req.body.ids'
// app.get('/employees', async (req, res) => {
//     const data = await empSearcher.getEmployeesWithIds(req.body.ids)
//     res.status(201).json({
//         status: 'OK',
//         data: data
//     })
// });


/**
 * @swagger
 * /projects:
 *  get:
 *    description: Use to request all projects
 *    responses:
 *      '201':
 *        description: A successful response
 */
app.get('/projects', async (req, res) => {
    const data = await projectsApiHandler.getAllProjects()
    res.status(201).json({
        status: 'OK',
        data: data
    })
});


/**
 * @swagger
 * /tasks/{projectId}:
 *    get:
 *      description: Use to request all tasks associated to project with id 'projectId'
 *    parameters:
 *      - name: projectId
 *        in: path
 *        description: ID of the project which tasks are associated to.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *    responses:
 *      '201':
 *        description: A successful response
 */
app.get('/tasks/:projectId', async (req, res) => {
    const data = await projectsApiHandler.getAllTasksFromProject(req.params.projectId)
    res.status(201).json({
        status: 'OK',
        data: data
    })
});


/**
 * @swagger
 * /reports/time/{projectId}:
 *    get:
 *      description: Use to request the total time destined by employees to the project with id 'projectId'. 
 *    parameters:
 *      - name: projectId
 *        in: path
 *        description: ID of the project which we want to calculate the time destined to.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *    responses:
 *      '201':
 *        description: A successful response
 */
app.get('/reports/time/:projectId', async (req, res) => {
    const data = await reportSearcher.getTimeDestinedToProject(req.params.projectId)
    res.status(201).json({
        status: 'OK',
        data: data
    })
});


/**
 * @swagger
 * /reports:
 *  get:
 *    description: Use to request all reports
 *    responses:
 *      '201':
 *        description: A successful response
 */
app.get('/reports', async (req, res) => {
    const data = await reportSearcher.getReports()
    res.status(201).json({
        status: 'OK',
        data: data
    })
});


/**
 * @swagger
 * /reports/filter/task/{taskId}:
 *    get:
 *      description: Use to request the reports filtered by task with id 'taskId'. 
 *    parameters:
 *      - name: taskId
 *        in: path
 *        description: ID of the task with which we want to filter the reports.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *    responses:
 *      '201':
 *        description: A successful response
 */
app.get('/reports/filter/task/:taskId', async (req, res) => {
    const data = await reportSearcher.getReportsByTaskId(parseInt(req.params.taskId))
    res.status(201).json({
        status: 'OK',
        data: data
    })
});


/**
 * @swagger
 * /reports/filter/project/{projectId}:
 *    get:
 *      description: Use to request the reports filtered by project with id 'projectId'. 
 *    parameters:
 *      - name: projectId
 *        in: path
 *        description: ID of the project with which we want to filter the reports.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *    responses:
 *      '201':
 *        description: A successful response
 */
app.get('/reports/filter/project/:projectId', async (req, res) => {
    const data = await reportSearcher.getReportsByProjectId(parseInt(req.params.projectId))
    res.status(201).json({
        status: 'OK',
        data: data
    })
});


/**
 * @swagger
 * /reports/filter/task/{init_date}/{end_date}:
 *    get:
 *      description: Use to request the reports filtered by a range of dates between 'init_date' and 'end_date'. 
 *    parameters:
 *      - name: init_date
 *        in: path
 *        description: initial date of the reports filter date range.
 *        required: true
 *        schema:
 *          type: string
 *          format: yyyy-mm-dd
 *      - name: end_date
 *        in: path
 *        description: end date of the reports filter date range.
 *        required: true
 *        schema:
 *          type: string
 *          format: yyyy-mm-dd
 *    responses:
 *      '201':
 *        description: A successful response
 */
app.get('/reports/filter/date/:init_date/:end_date', async (req, res) => {
    const data = await reportSearcher.getReportsByDate(req.params.init_date, req.params.end_date)
    res.status(201).json({
        status: 'OK',
        data: data
    })
});


/**
 * @swagger
 * /reports:
 *    post:
 *      description: Use to post a new report.
 *    parameters:
 *      - name: employeeId
 *        in: body
 *        description: ID of the employee whose report is being posted.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *      - name: taskId
 *        in: body
 *        description: ID of the task for which the report is being posted.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *      - name: date
 *        in: body
 *        description: date in which the report is being posted.
 *        required: true
 *        schema:
 *          type: string
 *          format: yyyy-mm-dd
 *      - name: hours
 *        in: body
 *        description: number of complete hours destined to the report being posted.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *      - name: minutes
 *        in: body
 *        description: minutes over the complete hours destined to the report being posted.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *      - name: employeeId
 *        in: body
 *        description: description of the report being posted.
 *        required: false
 *        schema:
 *          type: string
 *          format: text
 *    responses:
 *      '201':
 *        description: A successful report post.
 */
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
});


/**
 * @swagger
 * /reports/{reportId}:
 *    put:
 *      description: Use to update the time destined to report with id 'reportId'. 
 *    parameters:
 *      - name: reportId
 *        in: path
 *        description: ID of the report which we want to edit.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *      - name: hours
 *        in: body
 *        description: number of complete hours destined to the report being updated.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *      - name: minutes
 *        in: body
 *        description: minutes over the complete hours destined to the report being updated.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *    responses:
 *      '201':
 *        description: A successful update
 */
app.put('/reports/:repId', async (req, res) => {
    const status = await reportHandler.updateReport(req.params.repId, req.body.hours, req.body.minutes)
    res.status(201).json({
        status: status
    })
});


/**
 * @swagger
 * /reports/{reportId}:
 *    delete:
 *      description: Use to delete the report with id 'reportId'. 
 *    parameters:
 *      - name: reportId
 *        in: path
 *        description: ID of the report which we want to delete.
 *        required: true
 *        schema:
 *          type: number
 *          format: number
 *    responses:
 *      '201':
 *        description: A successful response
 */
app.delete('/reports/:id', async (req, res) => {
    let status = await reportHandler.deleteReport(req.params.id)
    res.status(201).json({
        status: status
    })
});


app.listen(process.env.PORT || 3000);