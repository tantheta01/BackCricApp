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
        var st = `select * from (select row_number() over () as rn, * from match ORDER BY season_year) as db1 where db1.rn <= 10 and db1.rn >= 0`
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
    var q1 = `select * from (select count(*) as nfours, striker as pid from ball_by_ball where match_id = ${match_id} and runs_scored=4 and innings_no=1 group by striker) as db11 full outer join (select db1.pid as player, db1.runs as runs, db1.balls as balls, db1.runs*100.0/db1.balls as sr from (select sum(runs_scored) as runs, count(*) as balls, striker as pid, innings_no from ball_by_ball where match_id = ${match_id} and innings_no=1 group by striker, innings_no) as db1) as db22 on db11.pid = db22.player full outer join (select count(*) as nsixes, striker as pid from ball_by_ball where match_id = 501208 and runs_scored=6 and innings_no=1 group by striker) as db33 on db22.player = db33.pid`;


    var q2 = `select * from (select count(*) as nfours, striker as pid from ball_by_ball where match_id = ${match_id} and runs_scored=4 and innings_no=2 group by striker) as db11 full outer join (select db1.pid as player, db1.runs as runs, db1.balls as balls, db1.runs*100.0/db1.balls as sr from (select sum(runs_scored) as runs, count(*) as balls, striker as pid, innings_no from ball_by_ball where match_id = ${match_id} and innings_no=2 group by striker, innings_no) as db1) as db22 on db11.pid = db22.player full outer join (select count(*) as nsixes, striker as pid from ball_by_ball where match_id = 501208 and runs_scored=6 and innings_no=2 group by striker) as db33 on db22.player = db33.pid`;

    var q3 = `select * from (select bowler, count(*) as nballs, sum(runs_scored) + sum(extra_runs) as total_runs from ball_by_ball where match_id = ${match_id} and innings_no = 1 group by bowler) as db1 full outer join (select bowler, count(*) as nwickets from ball_by_ball where match_id = ${match_id} and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') and innings_no=1 group by bowler) as db2 on db2.bowler = db1.bowler`;

    var q4 = `select * from (select bowler, count(*) as nballs, sum(runs_scored) + sum(extra_runs) as total_runs from ball_by_ball where match_id = ${match_id} and innings_no = 2 group by bowler) as db1 full outer join (select bowler, count(*) as nwickets from ball_by_ball where match_id = ${match_id} and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') and innings_no=2 group by bowler) as db2 on db2.bowler = db1.bowler`;

    client.query(q1, (err, res) => {
        if(err){
            console.log(JSON.stringify(err));
        }
        else{
            console.log(JSON.stringify(res));
            client.query(q2, (err2, res2) => {
                if(err2){
                    console.log(JSON.stringify(err2));
                }
                else{
                    console.log(JSON.stringify(res2));
                    client.query(q3, (err3, res3) => {
                        if(err3){
                            console.log(JSON.stringify(err3));
                        }
                        else{
                            console.log(JSON.stringify(res3));
                            client.query(q4, (err4, res4) => {
                                if(err4){
                                    console.log(JSON.stringify(err4));

                                }
                                else{
                                    console.log(JSON.stringify(res4));
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
    var match_id = req.match_id;
    q1 = `select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=1 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3`;

    q2 = `select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=1 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3`;

    q3 = `select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3`;

    q4 = `select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=2 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=2 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3`;

    client.query(q1, (err1, runs1) => {
        if(err1){
            console.log(err1);
        }
        else{
            client.query(q2, (err2, runs2) => {
                if(err2){
                    console.log(err2);
                }
                else{
                    client.query(q3, (err3, wick1) => {
                        if(err3){
                            console.log(JSON.stringify(err3));
                        }
                        else{
                            client.query(q4, (err4, wick2) => {
                                if(err4){
                                    console.log(err4);
                                }
                                else{
                                    console.log("Completed All queries");
                                    console.log(JSON.stringify(runs1));
                                    console.log(JSON.stringify(runs2));
                                    console.log(JSON.stringify(wick1));
                                    console.log(JSON.stringify(wick2));
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

