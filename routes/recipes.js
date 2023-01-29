const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Views should follow a consistent naming structure: '/views/recipes/[action].ejs'
// For example: the index view would be '/views/recipes/index.ejs'


// 'index' route
// This page displays a list of all recipes in the database
router.get('/recipes', (req, res, next) => {
    db.query('SELECT * FROM recipes ORDER BY id DESC', (err, data) => {
        if (err) {
            throw err
        } else {
            res.render('recipes/index', { recipes: data });
        }
    })
    // db.query('SELECT * FROM recipes ORDER BY id DESC').then((data) => {
    //     res.render('recipes/index', { recipes: data });
    // }).error((err) => {
    //     throw err
    // });
});


// 'new' route
// This page displays a page with a form to create a new recipe
// this view should probably be renamed to something like '/views/recipes/new.ejs'
router.get('/recipes/new', (req, res, next) => {
    res.render('recipes/new');
});


// 'show' route
// This page displays the information for a single recipe with id matching the URL parameter
// For example, `/recipes/10` will display the recipe with id=10
router.get('/recipes/:id', (req, res, next) => {
    db.query(`SELECT id, r_title, num_serv, ingredients, directions FROM recipes WHERE id = ${req.params.id}`, (err, data) => {
        if (err) {
            throw err
        } else {
            res.render('recipes/show', { recipe: data });
        }
    })
});


// 'edit' route
// This page displays a form to edit a specific recipe with id matching the URL parameter
router.get('/recipes/:id/edit', (req, res, next) => {
    db.query(`SELECT id, r_title, num_serv, ingredients, directions FROM recipes WHERE id = ${req.params.id}`, (err, data) => {
        if (err) {
            throw err
        } else {
            res.render('recipes/edit', { id: req.params.id, recipe: data });
        }
    })
});


// 'create' route
// This route accepts data from the form at '/recipes/new' and inserts it into the database
router.post('/recipes/new', (req, res, next) => {
    db.query('INSERT INTO recipes SET ?', { r_title: req.body.r_title, num_serv: req.body.num_serv, ingredients: req.body.ingredients, directions: req.body.directions }, (err, result) => {
        if (err) {
            throw err
        } else {
            console.log('data inserted into database');
            res.redirect('/recipes');
        }
    })
});


// 'update' route
// This route accepts data from the form at '/recipes/:id/edit' and updates the record in the database
router.post('/recipes/:id/edit', (req, res, next) => {
    db.query(`UPDATE recipes SET ? WHERE id = ${req.params.id}`, { r_title: req.body.r_title, num_serv: req.body.num_serv, ingredients: req.body.ingredients, directions: req.body.directions }, (err, data) => {
        if (err) {
            throw err
        } else {
            res.redirect(`/recipes/${req.params.id}`)
        }
    })
});

router.get('/recipes/:id/delete', (req, res, next) => {
    db.query(`DELETE FROM recipes WHERE id = ${req.params.id}`, (err, data) => {
        if (err) {
            throw err
        } else {
            res.redirect(`/recipes`)
        }
    })
});

module.exports = router;
