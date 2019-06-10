// imported modules go here!
const express = require('express');

// imported files go here!
const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    res.status(201).json(req.newuser);
});

router.post('/:id/posts', validatePost, (req, res) => {
   res.status(201).json(req.newpost)
});

router.get('/', (req, res) => {
    Users.get()
    .then(user => {
        console.log("Users were retrieved!")
        res.status(200).json(user);
    })
    .catch(err => {
        console.log("Users were not retrieved!")
        res.status(500).json(err);
    })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/:id/posts', (req, res) => {
    const {id} = req.params;
    Users.getUserPosts(id)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json(err);
    })
});

router.delete('/:id', validateUserId, (req, res) => {
    const {id} = req.params;
    Users.remove(id)
    .then(removed => {
        if(removed) {
            res.status(204).json()
        } else {
            res.status(404).json({
                success: false,
                message: "The user with the specified ID does not exist."
            })
        }    
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            err
        })
    })
});

router.put('/:id', [validateUser, validateUserId], (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    const {name} = req.body;
    if (!name) {
        res.status(422).json({message: "Missing updated fields: name."})
    }
    Users.update(id, changes)
    .then(updated => {
        if (updated) {
            res.status(200).json({success: true, updated})
        } else {
            res.status(404).json({message: "The user could not be updated for it does not exist."})
        }
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            err
        })
    })
});

//custom middleware

function validateUserId(req, res, next) {
    console.log("I'm using validateUserId middleware!")
    const {id} = req.params;
    Users.getById(id)
    .then(user => {
        if (user) {
            req.user = user
            next();    
        } else {
            res.status(404).json({message: "No user exists by that ID"})
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
};

function validateUser(req, res, next) {
    console.log("I'm using validateUser middleware!")
    const body = req.body;
    const {name} = req.body;
    if (!body) {
        res.status(400).json({message: "Missing user data"})
    }
    if(!name) {
        res.status(400).json({message: "Missing fields: name."})
    }
    Users.insert(body)
    .then(newUser => {
        if(newUser) {
            req.newuser = newUser
            next();
        }  
    })
    .catch(err => {
        console.log("User validation broke")
        res.status(500).json({
            success: false,
            message: "The server has failed to add the new user to the database.",
            err
        })
    })
};

function validatePost(req, res, next) {
    console.log("I'm using validatePost middleware!")
    const {id} = req.params;
    const body = req.body;
    const {text} = req.body;
    const {user_id} = req.body;
    if (!body) {
        res.status(400).json({message: "Missing user data"})
    }
    if(!text) {
        res.status(400).json({message: "Missing fields: text."})
    }
    if (!user_id) {
        res.status(400).json({message: "Missing fields: user_id (must be an integer)"})
    }
    Posts.insert(body)
    .then(newPost => {
        if(newPost) {
            req.newpost = newPost
            next();
        }  
    })
    .catch(err => {
        console.log("Post validation broke")
        res.status(500).json({
            success: false,
            message: "The server has failed to add the new post to the database.",
            err
        })
    })
};

module.exports = router;
