'use strict';
const controls = require('../cricViews/cricViews');
module.exports = function(app) {
    // var todoList = require('../controllers/todoListControllers');

    app.route('/matches').get(controls.list_matches);
    app.route('/matches/:id').get(controls.match_desc); //summary and score tracking should also be here
    //app.route('/matches/:id/comparison').get(controls.score_comparison);
    app.route('/players').get(controls.list_players);
    app.route('/players/:id').get(controls.player_info)
    app.route('/pointstable').get(controls.list_years)
    app.route('/pointstable/:year').get(controls.points_table)
    app.route('/venues').get(controls.list_venues)
    app.route('/venues/:id').get(controls.venue_stats)
    app.route('/addvenue').get(controls.add_venue)
}