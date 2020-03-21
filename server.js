const express = require('express');
const Projects = require('./data/helpers/projectModel');
const Actions = require('./data/helpers/actionModel');
const Map = require('./data/helpers/mappers');

const server = express();

server.use(express.json());
server.use(logger);


server.get('/', (req, res) => {
    res.send('<h2>Test</h2>')
});

server.get('/api/projects', (req, res) => {
    Projects.get()
        .then(project => {
            console.log(project)
            res.status(200).json(project)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'error getting projects'})
        })
});

server.get('/api/projects/:id', validateUserId, (req, res) => {
    res.status(200).json(req.project)
});

server.post('/api/projects', (req, res) => {
    Projects.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'error posting project'})
        })
});

server.put('/api/projects/:id', (req, res) => {
    Projects.update(req.params.id, req.body)
        .then(updated => {
            res.status(200).json({updated})
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({message: 'project could not be found'})
        })
});

server.delete('/api/projects/:id', (req, res) => {
    Projects.remove(req.params.id)
        .then(project => {
            if (project > 0) {
                res.status(200).json({message: 'project deleted'})
            } else {
                res.status(404).json({message: 'project could not be found'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Error deleting project'})
        })
});

server.get('/api/actions', (req, res) => {
    Actions.get()
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'error getting projects'})
        })
});

server.get('/api/actions/:id', (req, res) => {
    const {id} = req.params;
    Actions.get(id)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'error getting projects'})
        })
});

server.get('/api/projects/actions/:id', (req, res) => {
    const actions = {project_id: req.params.id}
    Projects.getProjectActions(actions) 
        .then(action => {
            // console.log(project_id)
            console.log(action);
            res.status(200).json(action)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'error getting projects'})
        })
})

server.post('/api/actions/:id', (req, res) => {
    const newAction = {...req.body, project_id: req.params.id}
    
    Projects.insert(newAction)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'error posting project'})
        })
});

function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`)
    next();
};

function validateProject(req, res, next) {
    if (!req.body) {
        res.status(400).json({message: 'missing user data'})
    } else {
        console.log('check')
        next();
    }
};

function validateUserId(req, res, next) {
    const { id } = req.params;

    Projects.get(id)
        .then(project => {
            if (project) {
                req.project = project;
                next();
            } else {
                res.status(400).json({ message: 'invalid id'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'error getting projects'})
        })
}


module.exports = server;