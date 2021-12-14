const axios = require('axios');
const { response } = require('express');


class ProjectsApiHandler {

    constructor() { }

    async getAllProjects() {
        // Returns an array with all existent projects in the following format:
        // {id, project name}.
        const data = await axios.get('https://desolate-journey-04573.herokuapp.com/api/project')
        let res = []
        for (let proj of data.data.results) {
            res.push({
                id: proj.id,
                name: proj.name
            })
        }
        return res
    }

    async getAllTasks() {
        // Returns an array with all existent tasks in the following format:
        // {id, task name}.
        const data = await axios.get('https://desolate-journey-04573.herokuapp.com/api/tasks')
        let res = []
        for (let task of data.data.results) {
            res.push({
                id: task.id,
                name: task.name,
                id_project: task.id_project
            })
        }
        return res
    }

    async getAllTasksFromProject(projectId) {
        // Returns an array with all existent tasks which correspond to project
        // with id 'projectId' in the following format:
        // {id, task name}.
        const data = await axios.get(`https://desolate-journey-04573.herokuapp.com/api/task/set/${projectId}`)
        let res = []
        for (let task of data.data.results) {
            res.push({
                id: task.id,
                name: task.name
            })
        }
        return res
    }

    async getProjectIdAssociatedToTask(taskId) {
        // Recieves a task id 'taskId' and returns the id of the project in which
        // the task was registered.
        const data = await axios.get(`https://desolate-journey-04573.herokuapp.com/api/task/${taskId}`)
        return data.data.results[0].id_project
    }

}

module.exports = ProjectsApiHandler