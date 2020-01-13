// implement your API here

// import express from 'express' 
const express = require ('express');

const Users = require('./data/db.js'); //our users database

const server = express();

//middleware: teaches express new things
server.use(express.json()); //needed to parse JSON

//Routes or Endpoints

//GET to "/"
server.get('/', function(request, response){
    response.send({ Hello: 'Vanessa!'});
});

//GET list of users
server.get('/api/users', (req, res) => {
    //read data from the database
    Users.find() // return a promise
    .then( users => {
        res.status(200).json(users);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "The users information could not be retrieved."})
    });
});

//GET specific User
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    Users.findById(id)
    .then( users => {
        if(!users.id){
            res.status(404).json({ message: "The user with the specified ID does not exist." });}
        else {
        res.status(200).json(users)}
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    });
});

// Create a User
server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;
    //for this to work, need server to use(express.json()); above

    Users.insert(req.body)
    .then(user => {
        if(!name || !bio){
           res.status(400).json({ errorMessage: "Please provide name and bio for the user." }); 
        } else {
        res.status(201).json(user)}
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database"
        });
    });
});

//Delete User
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    Users.remove(id)
    .then(deleted => {
        if (deleted){
        res.status(200).json(deleted);
        } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "The user could not be removed" 
        });
    });
});

//Update User
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const userData = req.body;
    const { name, bio } = userData;

    if (!name || !bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
    Users.update(id, userData)
    .then(user => {
        if(!user.id){
             res.status(404).json({ message: "The user with the specified ID does not exist." });
        } else {
        res.status(200).json(user);
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "The user information could not be modified." })
    })
})

const port = 8000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));