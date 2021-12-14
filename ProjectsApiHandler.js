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

    async getAllWorksFromProject(projectId) {
        // Returns an array with all existent works which correspond to project
        // with id 'projectId' in the following format:
        // {id, work name}.
        if (projectId == 1) {
            return [
                {
                    id: 2,
                    name: 'modelado signup'
                },
                {
                    id: 3,
                    name: 'modelado login'
                },
                {
                    id: 8,
                    name: 'code backend'
                },
                {
                    id: 9,
                    name: 'code frontend'
                }]
        } else if (projectId == 2) {
            return [
                {
                    id: 10,
                    name: 'make an assist'
                },
                {
                    id: 11,
                    name: 'score a goal'
                },
                {
                    id: 12,
                    name: 'save a penalty'
                },
                {
                    id: 13,
                    name: 'win at home'
                },
                {
                    id: 19,
                    name: 'win away'
                }]
        } else {
            return [
                {
                    id: 22,
                    name: 'win US Open'
                }]
        }
    }

    async getProjectIdAssociatedToWork(workId) {
        // Recieves a work id 'workId' and returns the id of the project in which
        // the work was registered.
        if (workId < 10) return 1;
        else if (workId < 20) return 2;
        else return 3;
    }

}

module.exports = ProjectsApiHandler