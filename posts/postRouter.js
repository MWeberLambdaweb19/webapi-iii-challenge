// imported modules go here!
const express = require('express');

// imported files go here! 
const Posts = require('../posts/postDb');

const router = express.Router();

router.get('/', (req, res) => {
    Posts.get()
    .then(user => {
        console.log("Posts were retrieved!")
        res.status(200).json(user);
    })
    .catch(err => {
        console.log("Posts were not retrieved!")
        res.status(500).json(err);
    })
});

router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.post)
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    Posts.remove(id)
    .then(removed => {
        if(removed) {
            res.status(204).json()
        } else {
            res.status(404).json({
                success: false,
                message: "The post with the specified ID does not exist."
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

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    const {text} = req.body;
    const {user_id} = req.body;
    if (!text) {
        res.status(422).json({message: "Missing updated fields: text."})
    }
    if (!user_id) {
        res.status(422).json({message: "Missing updated fields: user_id"})
    }
    Posts.update(id, changes)
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

// custom middleware

function validatePostId(req, res, next) {
    console.log("I'm using validatePostId middleware!")
    const {id} = req.params;
    Posts.getById(id)
    .then(post => {
        if (post) {
            req.post = post
            next();    
        } else {
            res.status(404).json({message: "No post exists by that ID"})
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
};

module.exports = router;