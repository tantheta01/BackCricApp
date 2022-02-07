'use strict';
// const qrs = require('./queries');
const { Pool, Client } = require('pg');
// var client = require('pg/lib/native/client');

const client = new Client({
    user : 'postgres',
    host : 'localhost',
    database : 'lab2db',
    password : 'newpassword',
    port: 5432
})

client.connect()

exports.list_matches = function(req, res) {
    console.log("inside matches");
    if(req.query.skip){
        var st = `select db5.t1name as t1_name, db5.t2name as t2name, db5.winner_name as winner_name, venue.venue_name as vname, db5.match_id as match_id from (select db4.team1 as team1, db4.team2 as team2, db4.winner as winner, db4.vid as vid, db4.t1name as t1name, db4.t2name as t2name, team.team_name as winner_name, db4.match_id as match_id from (select db3.team1 as team1, db3.team2 as team2, db3.winner as winner, db3.vid as vid, db3.t1name as t1name, team.team_name as t2name, db3.match_id as match_id from (select db2.team1 as team1, db2.team2 as team2, db2.winner as winner, db2.vid as vid, team.team_name as t1name, db2.match_id as match_id from (select db1.team1 as team1, db1.team2 as team2, db1.match_winner as winner, db1.venue_id as vid, db1.match_id as match_id from (select row_number() over () as rn, team1, team2, match_winner, venue_id, match_id from match ORDER BY season_year) as db1 where db1.rn <= ${req.query.limit} and db1.rn >= ${req.query.skip}) as db2 inner join team on db2.team1 = team.team_id) as db3 inner join team on team.team_id = db3.team2) as db4 inner join team on team.team_id = db4.winner) as db5 inner join venue on db5.vid = venue.venue_id`
        client.query(st,(err, task) => {
            if(err){

                console.log("an error took place in fetching all matches");
                console.log(JSON.stringify(err));
            }
            else{
                console.log(req.query.skip);
                console.log(req.query.limit);
                console.log("executing stiff currectly");
                console.log(JSON.stringify(task));
                res.json(task);
            }
        });
    }
    
};



exports.match_desc = function(req, res) {

    //scorecard, comparison and summary
    console.log("inside score card");
    var match_id = req.params.id;

    //for scorecard
    var q1 = `select db909.player_id as player_id, player.player_name as player_name, db909.nfours as nfours, db909.nsixes as nsixes, db909.runs as runs, db909.balls as balls, db909.sr as sr from (select db99.player as player_id, COALESCE(db99.nfours, 0) as nfours, COALESCE(db99.nsixes, 0) as nsixes, db99.runs as runs, db99.balls as balls, db99.sr as sr from (select * from (select count(*) as nfours, striker as pid from ball_by_ball where match_id = ${match_id} and runs_scored=4 and innings_no=1 group by striker) as db11 full outer join (select db1.pid as player, db1.runs as runs, db1.balls as balls, round(db1.runs*100.0/db1.balls, 3) as sr from (select sum(runs_scored) as runs, count(*) as balls, striker as pid, innings_no from ball_by_ball where match_id = ${match_id} and innings_no=1 group by striker, innings_no) as db1) as db22 on db11.pid = db22.player full outer join (select count(*) as nsixes, striker as pid from ball_by_ball where match_id = ${match_id} and runs_scored=6 and innings_no=2 group by striker) as db33 on db22.player = db33.pid) as db99) as db909 inner join player on player.player_id = db909.player_id`;
    var q2 = `select db909.player_id as player_id, player.player_name as player_name, db909.nfours as nfours, db909.nsixes as nsixes, db909.runs as runs, db909.balls as balls, db909.sr as sr from (select db99.player as player_id, COALESCE(db99.nfours, 0) as nfours, COALESCE(db99.nsixes, 0) as nsixes, db99.runs as runs, db99.balls as balls, db99.sr as sr from (select * from (select count(*) as nfours, striker as pid from ball_by_ball where match_id = ${match_id} and runs_scored=4 and innings_no=2 group by striker) as db11 full outer join (select db1.pid as player, db1.runs as runs, db1.balls as balls, round(db1.runs*100.0/db1.balls, 3) as sr from (select sum(runs_scored) as runs, count(*) as balls, striker as pid, innings_no from ball_by_ball where match_id = ${match_id} and innings_no=2 group by striker, innings_no) as db1) as db22 on db11.pid = db22.player full outer join (select count(*) as nsixes, striker as pid from ball_by_ball where match_id = ${match_id} and runs_scored=6 and innings_no=2 group by striker) as db33 on db22.player = db33.pid) as db99) as db909 inner join player on player.player_id = db909.player_id`;
    var q3 = `select ddb.bowler as bowler, player.player_name, ddb.nballs, ddb.total_runs, ddb.nwickets from (select db1.bowler as bowler, nballs, total_runs, COALESCE(nwickets, 0) as nwickets from (select bowler, count(*) as nballs, sum(runs_scored) + sum(extra_runs) as total_runs from ball_by_ball where match_id = ${match_id} and innings_no = 1 group by bowler) as db1 full outer join (select bowler, count(*) as nwickets from ball_by_ball where match_id = ${match_id} and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') and innings_no=1 group by bowler) as db2 on db2.bowler = db1.bowler) as ddb inner join player on player.player_id = ddb.bowler`;
    var q4 = `select ddb.bowler as bowler, player.player_name, ddb.nballs, ddb.total_runs, ddb.nwickets from (select db1.bowler as bowler, nballs, total_runs, COALESCE(nwickets, 0) as nwickets from (select bowler, count(*) as nballs, sum(runs_scored) + sum(extra_runs) as total_runs from ball_by_ball where match_id = ${match_id} and innings_no = 2 group by bowler) as db1 full outer join (select bowler, count(*) as nwickets from ball_by_ball where match_id = ${match_id} and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') and innings_no=2 group by bowler) as db2 on db2.bowler = db1.bowler) as ddb inner join player on player.player_id = ddb.bowler`;

    // for score comparison
    var q5 = `select db1.runs + db1.ex_runs from (select sum(runs_scored) over (order by over_id, ball_id) as runs, sum(extra_runs) over (order by over_id, ball_id) as ex_runs from ball_by_ball where match_id = ${match_id} and innings_no=1) as db1`;
    var q6 = `select db1.runs + db1.ex_runs from (select sum(runs_scored) over (order by over_id, ball_id) as runs, sum(extra_runs) over (order by over_id, ball_id) as ex_runs from ball_by_ball where match_id = ${match_id} and innings_no=2) as db1`;
    var q5_ = `select rn from (select row_number() over() as rn, * from ball_by_ball where innings_no=1 and match_id=${match_id}) as db1 where out_type is not null`;
    var q6_ = `select rn from (select row_number() over() as rn, * from ball_by_ball where innings_no=2 and match_id=${match_id}) as db1 where out_type is not null`;

    //match summary
    //have to add number of overs also in match summary
    //var q7 = `select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=1 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3`;
    //var q8 = `select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=2 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3`;
    //var q9 = `select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3`;
    //var q10 = `select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=2 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=2 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3`;

    var q7 = `select player.player_id, player.player_name, ddb1.runs, ddb1.num_balls from (select player_id, runs, num_balls from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=1 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3) as ddb1 inner join player on player.player_id = ddb1.player_id`;
    var q8 = `select player.player_id, player.player_name, ddb1.runs, ddb1.num_balls from (select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=2 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3) as ddb1 inner join player on player.player_id = ddb1.player_id`;
    var q9 = `select player.player_id, player.player_name, db11.nwickets, db11.tot_runs from (select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3) as db11 inner join player on player.player_id = db11.bowler`;
    var q10 = `select player.player_id, player.player_name, db11.nwickets, db11.tot_runs from (select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=2 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3) as db11 inner join player on player.player_id = db11.bowler`;

    client.query(q1, (err1, first_bat) => {
        if(err1){
            console.log(JSON.stringify(err1));
        }
        else{
            client.query(q2, (err2, second_bat) => {
                if(err2){
                    console.log(JSON.stringify(err2));
                }
                else{
                    client.query(q3, (err3, first_bowl) => {
                        if(err3){
                            console.log(JSON.stringify(err3));
                        }
                        else{
                            client.query(q4, (err4, second_bowl) => {
                                if(err4){
                                    console.log(JSON.stringify(err4));

                                }
                                else{
                                    console.log("heyyy")
                                    client.query(q5,(err5,runs1) => {
                                        if(err5){
                                            console.log(JSON.stringify(err5));
                                        }
                                        else{
                                            client.query(q6,(err6,runs2) => {
                                                if(err6){
                                                    console.log(JSON.stringify(err6));
                                                }
                                                else{
                                                    client.query(q7,(err7,batsmen1) => {
                                                        if(err7){
                                                            console.log(JSON.stringify(err7));
                                                        }
                                                        else{
                                                            client.query(q8,(err8,batsmen2) => {
                                                                if(err8){
                                                                    console.log(JSON.stringify(err8));
                                                                }
                                                                else{
                                                                    client.query(q9,(err9,bowler1) => {
                                                                        if(err9){
                                                                            console.log(JSON.stringify(err9));
                                                                        }
                                                                        else{
                                                                            client.query(q10,(err10,bowler2) => {
                                                                                if(err10){
                                                                                    console.log(JSON.stringify(err10));
                                                                                }
                                                                                else{
                                                                                    client.query(q5_, (err5_, wickets1) => {
                                                                                        if(err5_){
                                                                                            console.log(JSON.stringify(err5_));
                                                                                        }
                                                                                        else{
                                                                                            client.query(q6_, (err6_, wickets2) => {
                                                                                                if(err6_){
                                                                                                    console.log(JSON.stringify(err6_));
                                                                                                }
                                                                                                else{
                                                                                                    res.json({'first_bat' : first_bat, 'second_bat' : second_bat, 'first_bowl' : first_bowl, 'second_bowl' : second_bowl, 'runs1' : runs1, 'runs2' : runs2, 'batsmen1' : batsmen1, 'batsmen2' : batsmen2, 'bowler1' : bowler1, 'bowler2' : bowler2, 'wickets1' : wickets1, 'wickets2' : wickets2});
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                    
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

}

// exports.score_comparison = function(req, res) {
//     var match_id = req.params.id;
//     var q1 = `select db1.runs + db1.ex_runs from (select sum(runs_scored) over (order by over_id, ball_id) as runs, sum(extra_runs) over (order by over_id, ball_id) as ex_runs from ball_by_ball where match_id = ${match_id} and innings_no=1) as db1`;
//     var q2 = `select db1.runs + db1.ex_runs from (select sum(runs_scored) over (order by over_id, ball_id) as runs, sum(extra_runs) over (order by over_id, ball_id) as ex_runs from ball_by_ball where match_id = ${match_id} and innings_no=2) as db1`;
//     client.query(q1, (err1, res1) => {
//         if(err1){
//             console.log(JSON.stringify(err1));
//         }
//         else{
//             // console.log(JSON.stringify(res1));
//             client.query(q2, (err2, res2) => {
//                 if(err2){
//                     console.log(JSON.stringify(err2));
//                     console.log(JSON.stringify(res2));
//                 }
//             });
//             //console.log(JSON.stringify(res1));
//         }
//     });
// }

// exports.summary = function(req, res){
//     var match_id = req.match_id;
//     q1 = `select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=1 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3`;

//     q2 = `select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=2 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3`;

//     q3 = `select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3`;

//     q4 = `select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=2 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=2 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3`;

//     client.query(q1, (err1, runs1) => {
//         if(err1){
//             console.log(err1);
//         }
//         else{
//             client.query(q2, (err2, runs2) => {
//                 if(err2){
//                     console.log(err2);
//                 }
//                 else{
//                     client.query(q3, (err3, wick1) => {
//                         if(err3){
//                             console.log(JSON.stringify(err3));
//                         }
//                         else{
//                             client.query(q4, (err4, wick2) => {
//                                 if(err4){
//                                     console.log(err4);
//                                 }
//                                 else{
//                                     console.log("Completed All queries");
//                                     console.log(JSON.stringify(runs1));
//                                     console.log(JSON.stringify(runs2));
//                                     console.log(JSON.stringify(wick1));
//                                     console.log(JSON.stringify(wick2));
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     });
// }


// exports.points_table = function(req, res) {
//     var year = req.params.year;
    
// }

exports.list_players = function(req,res) {
    var limit = req.query.limit;
    var skip = req.query.skip;
    var q = `select * from (select row_number() over() as rn, player_id, player_name, country_name from player) as db1 where rn>=${skip} and rn<=${limit}`;
    client.query(q, (err,players) => {
        if(err){
            console.log(JSON.stringify(err));
        }
        else{
            res.json(players);
        }
    });
}

exports.player_info = function(req,res) { 

    var player_id = req.params.id;
    var q1 = `select player_name,country_name,batting_hand,bowling_skill from player where player_id = ${player_id}`;
    var q2 = `select count(*) from player_match where player_id = ${player_id}`;
    var q3 = `select COALESCE(sum(runs_scored), 0) from ball_by_ball where striker = ${player_id}`;
    var q4 = `select 4*count(*) as runs_fours from ball_by_ball where runs_scored = 4 and striker = ${player_id}`;
    var q5 = `select 6*count(*) as runs_fours from ball_by_ball where runs_scored = 6 and striker = ${player_id}`;
    var q6 = `select count(*) from (select sum(runs_scored),match_id from ball_by_ball where striker = ${player_id} group by match_id) as foo where sum >= 50`;
    var q7 = `select COALESCE(max(sum),0) from (select sum(runs_scored),match_id from ball_by_ball where striker = ${player_id} group by match_id) as foo`;
    var q8 = `select COALESCE(1.0*sum(runs_scored)*100.0/count(*), 0) as strike_rate from ball_by_ball where striker = ${player_id}`;
    var q9 = `select 1.0*sum(runs_scored)/GREATEST(sum(case when out_type != 'NULL' then 1 else 0 end), 1) as average from ball_by_ball where striker = ${player_id}`;
    var q10 = `select sum(runs_scored),match.match_id, season_year from ball_by_ball inner join match on match.match_id = ball_by_ball.match_id where striker = ${player_id} group by match.match_id order by season_year, match.match_id`;
    var q11 = `select count(*) from (select count(*) from ball_by_ball where bowler = ${player_id} group by match_id) as foo`;
    var q12 = `select COALESCE(sum(runs_scored)+sum(extra_runs), 0) as runs_conceded from ball_by_ball where bowler = ${player_id}`;
    var q13 = `select count(*) as num_balls from ball_by_ball where bowler = ${player_id}`;
    var q14 = `select count(*) from (select count(*) from ball_by_ball where bowler = ${player_id} group by over_id,match_id) as foo`;
    var q15 = `select COALESCE(sum(case when (out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'bowled' or out_type = 'stumped' or out_type = 'keeper catch' or out_type = 'lbw' or out_type = 'hit wicket') then 1 else 0 end), 0) as numwkts from ball_by_ball where bowler = ${player_id}`;
    var q16 = `select COALESCE(1.0*foo2.runs_conceded/count(foo1)) as economy from (select count(*) from ball_by_ball where bowler = ${player_id} group by over_id,match_id) as foo1,(select sum(runs_scored)+sum(extra_runs) as runs_conceded from ball_by_ball where bowler = ${player_id}) as foo2 group by foo2.runs_conceded`;
    var q17 = `select count(*) from (select sum(case when (out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'bowled' or out_type = 'stumped' or out_type = 'keeper catch' or out_type = 'lbw' or out_type = 'hit wicket') then 1 else 0 end) as numwkts from ball_by_ball where bowler = ${player_id} group by match_id) as foo where numwkts >= 5`;
    var q18 = `select sum(runs_scored)+sum(extra_runs) as runs_conceded,match.match_id as match_id, season_year from ball_by_ball inner join match on match.match_id = ball_by_ball.match_id where bowler = ${player_id} group by match.match_id, match.season_year order by season_year, match.match_id`;
    var q19 = `select sum(case when (out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'bowled' or out_type = 'stumped' or out_type = 'keeper catch' or out_type = 'lbw' or out_type = 'hit wicket') then 1 else 0 end) as numwkts,match_id from ball_by_ball where bowler = ${player_id} group by match_id`;
    var ntimes_out = `select match_id from ball_by_ball where out_type is not null and striker = ${player_id} group by match_id`;

    client.query(q1, (err1,res1) => {
        if(err1){
            console.log(JSON.stringify(err1));
        }
        else{
            client.query(q2, (err2,res2) => {
                if(err2){
                    console.log(JSON.stringify(err2));
                }
                else{
                    client.query(q3, (err3,res3) => {
                        if(err3){
                            console.log("at err3");
                            // console.log(JSON.stringify(err3));
                        }
                        else{
                            client.query(q4, (err4,res4) => {
                                if(err4){
                                    console.log(JSON.stringify(err4));
                                }
                                else{
                                    // console.log("iske baad");
                                    client.query(q5, (err5, res5) => {
                                        if(err5){
                                            console.log(JSON.stringify(err5));
                                        }
                                        else{
                                            client.query(q6, (err6,res6) => {
                                                if(err6){
                                                    console.log(JSON.stringify(err6));
                                                }
                                                else{
                                                    console.log("iske baad");

                                                    client.query(q7, (err7,res7) => {
                                                        if(err7){
                                                            console.log(JSON.stringify(err7));
                                                        }
                                                        else{
                                                            

                                                            client.query(q8, (err8,res8) => {
                                                                if(err8){
                                                                    console.log(JSON.stringify(err8));
                                                                }
                                                                else{
                                                                    console.log("iske baad999");
                                                                    client.query(q9, (err9,res9) => {
                                                                        if(err9){
                                                                            console.log(JSON.stringify(err9));
                                                                        }
                                                                        else{
                                                                            console.log("iske baad455");
                                                                            client.query(q10, (err10,res10) => {
                                                                                if(err10){
                                                                                    console.log(JSON.stringify(err10));
                                                                                }
                                                                                else{
                                                                                    client.query(q11, (err11,res11) => {
                                                                                        if(err11){
                                                                                            console.log(JSON.stringify(err11));
                                                                                        }
                                                                                        else{
                                                                                            console.log("iske baad q11");
                                                                                            client.query(q12, (err12,res12) => {
                                                                                                if(err12){
                                                                                                    console.log(JSON.stringify(err12));
                                                                                                }
                                                                                                else{
                                                                                                    client.query(q13, (err13,res13) => {
                                                                                                        if(err13){
                                                                                                            console.log(JSON.stringify(err13));
                                                                                                        }
                                                                                                        else{
                                                                                                            client.query(q14, (err14, res14) => {
                                                                                                                if(err14){
                                                                                                                    console.log(JSON.stringify(err14));
                                                                                                                }
                                                                                                                else{
                                                                                                                    client.query(q15, (err15,res15) => {
                                                                                                                        if(err15){
                                                                                                                            console.log(JSON.stringify(err15));
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            client.query(q16, (err16,res16) => {
                                                                                                                                if(err16){
                                                                                                                                    console.log(JSON.stringify(err16));
                                                                                                                                }
                                                                                                                                else{
                                                                                                                                    client.query(q17, (err17,res17) => {
                                                                                                                                        if(err17){
                                                                                                                                            console.log(JSON.stringify(err17));
                                                                                                                                        }
                                                                                                                                        else{
                                                                                                                                            console.log("iske baad q17");
                                                                                                                                            client.query(q18, (err18,res18) => {
                                                                                                                                                if(err18){
                                                                                                                                                    console.log(JSON.stringify(err18));
                                                                                                                                                }
                                                                                                                                                else{
                                                                                                                                                    client.query(q19, (err19,res19) =>{
                                                                                                                                                        if(err19){
                                                                                                                                                            console.log(JSON.stringify(err19));
                                                                                                                                                        }
                                                                                                                                                        else{
                                                                                                                                                            client.query(ntimes_out, (err20, ntimes_res) => {
                                                                                                                                                                if(err20){
                                                                                                                                                                    console.log(JSON.stringify(err20));
                                                                                                                                                                }
                                                                                                                                                                else{
                                                                                                                                                                    console.log(JSON.stringify(ntimes_res));
                                                                                                                                                                    res.json({'details' : res1['rows'], 'total_matches' : res2['rows'], 'runs_scored' : res3['rows'], 'four_runs' : res4['rows'], 'six_runs' : res5['rows'], 'fifties' : res6['rows'], 'highest_score' : res7['rows'], 'strike_rate' : res8['rows'], 'average' : res9['rows'], 'score_graph' : res10['rows'], 'matches_bowled' : res11['rows'], 'runs_conceded' : res12['rows'], 'numballs' : res13['rows'], 'numovers' : res14['rows'], 'numwkts' : res15['rows'], 'economy' : res16['rows'], 'five_wickets' : res17['rows'], 'conceded_graph' : res18['rows'], 'wickets_graph' : res19['rows'], 'out_mids' : ntimes_res['rows']});
                                                                                                                                                                }
                                                                                                                                                            });
                                                                                                                                                            
                                                                                                                                                        }
                                                                                                                                                    });
                                                                                                                                                }
                                                                                                                                            });
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }
                                                                                                                    });
                                                                                                                }                                                                                                            
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

exports.list_years = function(req,res) {
    var q = `select distinct season_year from match`;
    client.query(q, (err,years) => {
        if(err){
            console.log(JSON.stringify(err));
        }
        else{
            res.json(years);
        }
    });
}

exports.points_table = function(req,res) {
    //do here
}

exports.list_venues = function (req,res) {
    var q = `select * from venue`;
    client.query(q, (err,venues) => {
        if(err){
            console.log(JSON.stringify(err));
        }
        else{
            res.json(venues);
        }
    });
}

exports.venue_stats = function (req,res) {
    var venue_id = req.params.id;
    //basic info
    var q1 = `select * from venue where venue_id = ${venue_id}`;
    var q2 = `select count(*) from match where match.venue_id = ${venue_id}`;
    var q3 = `select max(db1.tot_runs), min(db1.tot_runs) from (select match.match_id as match_id, sum(runs_scored) + sum(extra_runs) as tot_runs from ball_by_ball inner join match on match.match_id = ball_by_ball.match_id inner join venue on venue.venue_id = match.venue_id where ball_by_ball.innings_no = 1 and venue.venue_id = ${venue_id} group by match.match_id) as db1`;
    var q4 = `select max(db1.runs) from (select sum(runs_scored) + sum(extra_runs) as runs from match inner join venue on venue.venue_id = match.venue_id inner join ball_by_ball on ball_by_ball.match_id = match.match_id inner join player_match on player_match.match_id = match.match_id and player_match.player_id = ball_by_ball.striker and player_match.team_id != match.match_winner where ball_by_ball.innings_no = 1 and match_winner is not null and venue.venue_id = ${venue_id} group by match.match_id) as db1`;
    var q5 = `select count(*) from (select count(*) from match inner join venue on venue.venue_id = match.venue_id inner join ball_by_ball on ball_by_ball.match_id = match.match_id inner join player_match on player_match.match_id = match.match_id and player_match.player_id = striker and player_match.team_id = match.match_winner where ball_by_ball.innings_no = 1 and venue.venue_id = ${venue_id} group by match.match_id) as db1`;
    var q6 = `select count(*) from (select count(*) from match inner join venue on venue.venue_id = match.venue_id inner join ball_by_ball on ball_by_ball.match_id = match.match_id inner join player_match on player_match.match_id = match.match_id and player_match.player_id = striker and player_match.team_id = match.match_winner where ball_by_ball.innings_no = 2 and venue.venue_id = ${venue_id} group by match.match_id) as db1`;
    var q7 = `select count(*) from (select count(*) from match inner join venue on venue.venue_id = match.venue_id inner join ball_by_ball on ball_by_ball.match_id = match.match_id inner join player_match on player_match.match_id = match.match_id and player_match.player_id = striker and match.match_winner is null where ball_by_ball.innings_no = 1 and venue.venue_id = ${venue_id} group by match.match_id) as db1`;
    var q8 = `select AVG(db1.runs), db1.season_year from (select sum(runs_scored) + sum(extra_runs) as runs, match.season_year as season_year from match inner join venue on venue.venue_id = match.venue_id inner join ball_by_ball on ball_by_ball.match_id = match.match_id inner join player_match on player_match.match_id = match.match_id and player_match.player_id = ball_by_ball.striker where ball_by_ball.innings_no = 1 and venue.venue_id = ${venue_id} group by match.match_id, match.season_year) as db1 group by db1.season_year`;

    client.query(q1, (err1, res1) => {
        if(err1){
            console.log(JSON.stringify(err1));
        }
        else{
            client.query(q2, (err2, res2) => {
                if(err2){
                    console.log(JSON.stringify(err2));
                }
                else{
                    client.query(q3, (err3, res3) => {
                        if(err3){
                            console.log(JSON.stringify(err3));
                        }
                        else{
                            client.query(q4, (err4, res4) => {
                                if(err4){
                                    console.log(JSON.stringify(err4));

                                }
                                else{
                                    client.query(q5,(err5, res5) => {
                                        if(err5){
                                            console.log(JSON.stringify(err5));
                                        }
                                        else{
                                            client.query(q6,(err6, res6) => {
                                                if(err6){
                                                    console.log(JSON.stringify(err6));
                                                }
                                                else{
                                                    client.query(q7,(err7, res7) => {
                                                        if(err7){
                                                            console.log(JSON.stringify(err7));
                                                        }
                                                        else{
                                                            client.query(q8,(err8, res8) => {
                                                                if(err8){
                                                                    console.log(JSON.stringify(err8));
                                                                }
                                                                else{
                                                                    res.json({'details' : res1['rows'], 'matches' : res2['rows'], 'minmax' : res3['rows'], 'highest_chase' : res4['rows'], 'first_bat' : res5['rows'], 'first_bowl' : res6['rows'], 'draw' : res7['rows'], 'average_score' : res8['rows']});
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}


