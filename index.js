const express = require('express');

const server = express();

server.use(express.json());

let projects = [{ id: "1", title: 'Novo projeto', tasks: [] }];

// MIDDLEWARES
server.use((req, res, next) => {

  console.time('Request');
  console.log(`${req.method} ${req.url}`);
  
  next();

  console.count(`Essa foi a requisição nº`);
  console.timeEnd('Request');
  console.log('---------------------------------------');
});

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.filter(projeto => projeto.id === id);

  if(!project.length > 0) {
    return res.status(404).json({ error: "Project does not exists" })
  }

  req.project = project;

  return next();
};
// /MIDDLEWARES

// ROTAS
server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkIfProjectExists, (req, res) => {
  return res.json(req.project);
});

server.post('/projects', (req, res) => {
  const project = req.body;

  projects = [...projects, project]

  return res.json(projects);
});

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  projects = projects.filter(projeto => projeto.id !== id);

  return res.send();
});

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(projeto => {
    if (projeto.id === id) {
      projeto.tasks = [...projeto.tasks, title]
    }
  });

  return res.json(projects);

});
// /ROTAS

server.listen(3000)