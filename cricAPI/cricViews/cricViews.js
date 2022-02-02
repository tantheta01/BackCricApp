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
    // else{
    //     var st1 = `select sum(runs_scored) as runs, count(*) as balls, player_id as pid, innings_no from ball_by_ball group by player_id, innings_no where match_id = ${req.params.id}`;
        
    //     // client.query()
    // }
    
};

exports.score_card = function(req, res) {
    console.log("inside score card");
    var match_id = req.params.id;
    var q1 = `select db909.player_id as player_id, player.player_name as player_name, db909.nfours as nfours, db909.nsixes as nsixes, db909.runs as runs, db909.balls as balls, db909.sr as sr from (select db99.player as player_id, COALESCE(db99.nfours, 0) as nfours, COALESCE(db99.nsixes, 0) as nsixes, db99.runs as runs, db99.balls as balls, db99.sr as sr from (select * from (select count(*) as nfours, striker as pid from ball_by_ball where match_id = ${match_id} and runs_scored=4 and innings_no=1 group by striker) as db11 full outer join (select db1.pid as player, db1.runs as runs, db1.balls as balls, round(db1.runs*100.0/db1.balls, 3) as sr from (select sum(runs_scored) as runs, count(*) as balls, striker as pid, innings_no from ball_by_ball where match_id = ${match_id} and innings_no=1 group by striker, innings_no) as db1) as db22 on db11.pid = db22.player full outer join (select count(*) as nsixes, striker as pid from ball_by_ball where match_id = ${match_id} and runs_scored=6 and innings_no=2 group by striker) as db33 on db22.player = db33.pid) as db99) as db909 inner join player on player.player_id = db909.player_id`;


    var q2 = `select db909.player_id as player_id, player.player_name as player_name, db909.nfours as nfours, db909.nsixes as nsixes, db909.runs as runs, db909.balls as balls, db909.sr as sr from (select db99.player as player_id, COALESCE(db99.nfours, 0) as nfours, COALESCE(db99.nsixes, 0) as nsixes, db99.runs as runs, db99.balls as balls, db99.sr as sr from (select * from (select count(*) as nfours, striker as pid from ball_by_ball where match_id = ${match_id} and runs_scored=4 and innings_no=2 group by striker) as db11 full outer join (select db1.pid as player, db1.runs as runs, db1.balls as balls, round(db1.runs*100.0/db1.balls, 3) as sr from (select sum(runs_scored) as runs, count(*) as balls, striker as pid, innings_no from ball_by_ball where match_id = ${match_id} and innings_no=2 group by striker, innings_no) as db1) as db22 on db11.pid = db22.player full outer join (select count(*) as nsixes, striker as pid from ball_by_ball where match_id = ${match_id} and runs_scored=6 and innings_no=2 group by striker) as db33 on db22.player = db33.pid) as db99) as db909 inner join player on player.player_id = db909.player_id`;

    var q3 = `select ddb.bowler as bowler, player.player_name, ddb.nballs, ddb.total_runs, ddb.nwickets from (select db1.bowler as bowler, nballs, total_runs, COALESCE(nwickets, 0) as nwickets from (select bowler, count(*) as nballs, sum(runs_scored) + sum(extra_runs) as total_runs from ball_by_ball where match_id = ${match_id} and innings_no = 1 group by bowler) as db1 full outer join (select bowler, count(*) as nwickets from ball_by_ball where match_id = ${match_id} and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') and innings_no=1 group by bowler) as db2 on db2.bowler = db1.bowler) as ddb inner join player on player.player_id = ddb.bowler`;

    var q4 = `select ddb.bowler as bowler, player.player_name, ddb.nballs, ddb.total_runs, ddb.nwickets from (select db1.bowler as bowler, nballs, total_runs, COALESCE(nwickets, 0) as nwickets from (select bowler, count(*) as nballs, sum(runs_scored) + sum(extra_runs) as total_runs from ball_by_ball where match_id = ${match_id} and innings_no = 2 group by bowler) as db1 full outer join (select bowler, count(*) as nwickets from ball_by_ball where match_id = ${match_id} and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') and innings_no=2 group by bowler) as db2 on db2.bowler = db1.bowler) as ddb inner join player on player.player_id = ddb.bowler`;

    client.query(q1, (err, res1) => {
        if(err){
            console.log(JSON.stringify(err));
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
                                    console.log(JSON.stringify(res4));
                                    console.log("heyyy")
                                    res.json({'first_bat' : res1, 'second_bat' : res2, 'first_bowl' : res3, 'second_bowl' : res4});
                                }
                            });
                        }
                    });
                }
            });
        }
    });


    // client.query()
}

exports.score_comparison = function(req, res) {
    var match_id = req.params.id;
    var q1 = `select db1.runs + db1.ex_runs from (select sum(runs_scored) over (order by over_id, ball_id) as runs, sum(extra_runs) over (order by over_id, ball_id) as ex_runs from ball_by_ball where match_id = ${match_id} and innings_no=1) as db1`;
    var q2 = `select db1.runs + db1.ex_runs from (select sum(runs_scored) over (order by over_id, ball_id) as runs, sum(extra_runs) over (order by over_id, ball_id) as ex_runs from ball_by_ball where match_id = ${match_id} and innings_no=2) as db1`;
    client.query(q1, (err1, res1) => {
        if(err1){
            console.log(JSON.stringify(err1));
        }
        else{
            // console.log(JSON.stringify(res1));
            client.query(q2, (err2, res2) => {
                if(err2){
                    console.log(JSON.stringify(err2));
                    console.log(JSON.stringify(res2));
                }
            });
            console.log(JSON.stringify(res1));
        }
    });
}

exports.summary = function(req, res){
    console.log("yes this is called");
    var match_id = req.params.id;
    console.log("match ID");
    console.log(match_id)
    var inn_no1 = 1;
    var inn_no2 = 2;
    const q1 = `select player.player_id, player.player_name, ddb1.runs, ddb1.num_balls from (select player_id, runs, num_balls from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=1 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3) as ddb1 inner join player on player.player_id = ddb1.player_id`;

    // inn_no = 2;
    const q2 = `select player.player_id, player.player_name, ddb1.runs, ddb1.num_balls from (select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=2 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3) as ddb1 inner join player on player.player_id = ddb1.player_id`;

    // inn_no = 1
    const q3 = `select player.player_id, player.player_name, db11.nwickets, db11.tot_runs from (select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3) as db11 inner join player on player.player_id = db11.bowler`;
    // inn_no = 2;
    const q4 = `select player.player_id, player.player_name, db11.nwickets, db11.tot_runs from (select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=2 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3) as db11 inner join player on player.player_id = db11.bowler`;


    client.query(q1, (err1, runs1) => {
        if(err1){
            console.log("Att err1");
            // console.log(err1);
        }
        else{
            client.query(q2, (err2, runs2) => {
                if(err2){
                    console.log("at err2");
                    // console.log(err2);
                }
                else{
                    client.query(q3, (err3, wick1) => {
                        if(err3){
                            console.log("at err3");
                            // console.log(JSON.stringify(err3));
                        }
                        else{
                            client.query(q4, (err4, wick2) => {
                                if(err4){
                                    console.log("err4");
                                    console.log(err4);
                                }
                                else{
                                    console.log("Completed All queries");
                                    // console.log(JSON.stringify(runs1));
                                    // console.log(JSON.stringify(runs2));
                                    // console.log(JSON.stringify(wick1));
                                    // console.log(JSON.stringify(wick2));
                                    res.json({
                                        "first_bat": runs1,
                                        "second_bat": runs2,
                                        "first_bowl": wick1,
                                        "second_bowl": wick2
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


exports.points_table = function(req, res) {
    var year = req.params.year;
    


}

