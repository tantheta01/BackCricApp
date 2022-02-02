'use strict';
const controls = require('../cricViews/cricViews');
module.exports = function(app) {
    // var todoList = require('../controllers/todoListControllers');

    app.route('/matches').get(controls.list_matches);
    app.route('/matches/:id/comparison').get(controls.score_comparison);
    app.route('/matches/:id/summary').get(controls.summary);
    app.route('/matches/:id').get(controls.score_card);
    
}