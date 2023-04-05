const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth'); 


require('../models/Idea');
require('../models/User');
const Idea = mongoose.model('ideas');

router.get('/', (req, res) => {
    Idea.find({user: req.user.id}).lean()
    .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas:ideas
        });
    });
})  


// router.get('/', (req, res) => {
//     Idea.find({status:'public'}).lean()
//     .then(ideas => {
//         res.render('/', {
//             ideas:ideas
//         });
//     });
// })  

// router.get('/', async (req, res) => {
//     try {
//       const ideas = await Idea.find({ status: 'public' })
//         .populate('user')
//         .sort({ createdAt: 'desc' })
//         .lean()
  
//       res.render('ideas/index', {
//         ideas,
//       })
//     } catch (err) {
//       console.error(err)
//       res.render('error/500')
//     }
//   })

//Add idea form

router.get('/add', ensureAuthenticated, (req, res) =>{
    res.render('ideas/add');    
});


router.get('/edit/:id', ensureAuthenticated, (req, res) =>{
    Idea.findOne({
        _id: req.params.id
    }).lean()
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        } else {
            
            res.render('ideas/edit', {
                idea:idea
            }); 
        }
        
    });
});

router.post('/', (req, res) => {
    let errors = [];

    if(!req.body.title) {
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add some details'});
    }

    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash("success_msg", "Video idea added");
            res.redirect('/ideas');
        })
    }
});

// Edit Form process

router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash("success_msg", "Video idea update");
            res.redirect('/ideas');
        })
    });
});


router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.deleteOne({_id: req.params.id})
    .then(() => {
        req.flash("success_msg", "Video idea remove");
        res.redirect('/ideas');
    })
});





module.exports = router;
