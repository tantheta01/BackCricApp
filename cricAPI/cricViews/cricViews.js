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
        client.query(st,(err, res) => {
            if(err){

                console.log("an error took place in fetching all matches");
                console.log(JSON.stringify(err));
            }
            else{
                console.log(req.query.skip);
                console.log(req.query.limit);
                console.log("executing stiff currectly");
                console.log(JSON.stringify(res));
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
