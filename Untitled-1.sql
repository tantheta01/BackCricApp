
(select db1.pid as player, db1.runs as runs, db1.balls as balls, db1.runs*100.0/db1.balls as sr from (select sum(runs_scored) as runs, count(*) as balls, striker as pid, innings_no from ball_by_ball where match_id = 501208 and innings_no=1 group by striker, innings_no) as db1);

select * from (select count(*) as nfours, striker as pid from ball_by_ball where match_id = 501208 and runs_scored=4 and innings_no=1 group by striker) as db11 full outer join (select db1.pid as player, db1.runs as runs, db1.balls as balls, db1.runs*100.0/db1.balls as sr from (select sum(runs_scored) as runs, count(*) as balls, striker as pid, innings_no from ball_by_ball where match_id = 501208 and innings_no=1 group by striker, innings_no) as db1) as db22 on db11.pid = db22.player full outer join (select count(*) as nsixes, striker as pid from ball_by_ball where match_id = 501208 and runs_scored=6 and innings_no=1 group by striker) as db33 on db22.player = db33.pid;


select * from ball_by_ball where match_id = 501208 and innings_no = 1 and out_type is not null;

select db1.runs + db1.ex_runs from (select sum(runs_scored) over (order by over_id, ball_id) as runs, sum(extra_runs) over (order by over_id, ball_id) as ex_runs from ball_by_ball where match_id = 501208 and innings_no=1) as db1;

select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = 501208 group by innings_no, striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3;

select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = 501208 and innings_no=1 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = 501208 and innings_no=1 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3;


select * from ball_by_ball inner join match on match.match_id = ball_by_ball.match_id inner join player_match on player_match.player_id = ball_by_ball and player_match.player_id = ball_by_ball.striker where match.season_year = ${year}

-- table 1
select tab1.t1, round(COALESCE(tab1.db1RR, 0) + COALESCE(tab2.db2RR, 0) - COALESCE(tab3.db3RR, 0) - COALESCE(tab4.db4RR, 0), 2) as NRR from (select db.t1 as t1, sum(db.rr) as db1RR from (select match.match_id as matchID, match.team1 as t1, match.team2 as t2, sum(ball_by_ball.runs_scored) + sum(ball_by_ball.extra_runs) as tot_runs, count(*) as nballs, (sum(ball_by_ball.runs_scored) + sum(ball_by_ball.extra_runs))*6.0 / count(*) as rr from ball_by_ball inner join match on ball_by_ball.match_id = match.match_id inner join player_match on ball_by_ball.striker = player_match.player_id and match.match_id = player_match.match_id and match.team1 = player_match.team_id group by match.match_id , match.team1, match.team2) as db group by db.t1) as tab1
full outer join
(select db.t1 as t1, sum(db.rr) as db2RR from (select match.match_id as matchID, match.team2 as t1, match.team1 as t2, sum(ball_by_ball.runs_scored) + sum(ball_by_ball.extra_runs) as tot_runs, count(*) as nballs, (sum(ball_by_ball.runs_scored) + sum(ball_by_ball.extra_runs))*6.0 / count(*) as rr from ball_by_ball inner join match on ball_by_ball.match_id = match.match_id inner join player_match on ball_by_ball.striker = player_match.player_id and match.match_id = player_match.match_id and match.team2 = player_match.team_id group by match.match_id , match.team1, match.team2) as db group by db.t1) as tab2
on tab1.t1 = tab2.t1
full outer join 
(select db.t2 as t2, sum(db.rr) as db3RR from (select match.match_id as matchID, match.team1 as t1, match.team2 as t2, sum(ball_by_ball.runs_scored) + sum(ball_by_ball.extra_runs) as tot_runs, count(*) as nballs, (sum(ball_by_ball.runs_scored) + sum(ball_by_ball.extra_runs))*6.0 / count(*) as rr from ball_by_ball inner join match on ball_by_ball.match_id = match.match_id inner join player_match on ball_by_ball.striker = player_match.player_id and match.match_id = player_match.match_id and match.team1 = player_match.team_id group by match.match_id , match.team1, match.team2) as db group by db.t2) as tab3
on tab2.t1 = tab3.t2
full outer join
(select db.t2 as t2, sum(db.rr) as db4RR from (select match.match_id as matchID, match.team2 as t1, match.team1 as t2, sum(ball_by_ball.runs_scored) + sum(ball_by_ball.extra_runs) as tot_runs, count(*) as nballs, (sum(ball_by_ball.runs_scored) + sum(ball_by_ball.extra_runs))*6.0 / count(*) as rr from ball_by_ball inner join match on ball_by_ball.match_id = match.match_id inner join player_match on ball_by_ball.striker = player_match.player_id and match.match_id = player_match.match_id and match.team2 = player_match.team_id group by match.match_id , match.team1, match.team2) as db group by db.t2) as tab4
on tab3.t2 = tab4.t2;


select 2*count(*) from match group by match_winner;

-- select venue.venue_name, venue.city_name, venue.country_name, match.match_id from venue inner join match on match.venue_id = venue.venue_id where venue.venue_id = 2 inner join ball_by_ball on ball_by_ball.match_id = match.match_id and ball_by_ball.innings_no = 1;


-- venue queries
select * from venue where venue_id = 2;

select count(*) from match where match.venue_id = 2;

select max(db1.tot_runs), min(db1.tot_runs) from (select match.match_id as match_id, sum(runs_scored) + sum(extra_runs) as tot_runs from ball_by_ball inner join match on match.match_id = ball_by_ball.match_id inner join venue on venue.venue_id = match.venue_id where ball_by_ball.innings_no = 1 and venue.venue_id = 2 group by match.match_id) as db1;

select max(db1.runs) from (select sum(runs_scored) + sum(extra_runs) as runs from match inner join venue on venue.venue_id = match.venue_id inner join ball_by_ball on ball_by_ball.match_id = match.match_id inner join player_match on player_match.match_id = match.match_id and player_match.player_id = ball_by_ball.striker and player_match.team_id != match.match_winner where ball_by_ball.innings_no = 1 and match_winner is not null and venue.venue_id = 2 group by match.match_id) as db1;


-- venue queries done
--bar chart done
select count(*) from (select count(*) from match inner join venue on venue.venue_id = match.venue_id inner join ball_by_ball on ball_by_ball.match_id = match.match_id inner join player_match on player_match.match_id = match.match_id and player_match.player_id = striker and player_match.team_id = match.match_winner where ball_by_ball.innings_no = 1 and venue.venue_id = 2 group by match.match_id) as db1;

select count(*) from (select count(*) from match inner join venue on venue.venue_id = match.venue_id inner join ball_by_ball on ball_by_ball.match_id = match.match_id inner join player_match on player_match.match_id = match.match_id and player_match.player_id = striker and player_match.team_id = match.match_winner where ball_by_ball.innings_no = 2 and venue.venue_id = 2 group by match.match_id) as db1;

select count(*) from (select count(*) from match inner join venue on venue.venue_id = match.venue_id inner join ball_by_ball on ball_by_ball.match_id = match.match_id inner join player_match on player_match.match_id = match.match_id and player_match.player_id = striker and match.match_winner is null where ball_by_ball.innings_no = 1 and venue.venue_id = 2 group by match.match_id) as db1;
--bar chart done

select AVG(db1.runs), db1.season_year from (select sum(runs_scored) + sum(extra_runs) as runs, match.season_year as season_year from match inner join venue on venue.venue_id = match.venue_id inner join ball_by_ball on ball_by_ball.match_id = match.match_id inner join player_match on player_match.match_id = match.match_id and player_match.player_id = ball_by_ball.striker where ball_by_ball.innings_no = 5 and venue.venue_id = 3 group by match.match_id, match.season_year) as db1 group by db1.season_year;



select db5.t1name as t1_name, db5.t2name as t2name, db5.winner_name as winner_name, venue.venue_name as vname, db5.match_id as match_id from (select db4.team1 as team1, db4.team2 as team2, db4.winner as winner, db4.vid as vid, db4.t1name as t1name, db4.t2name as t2name, team.team_name as winner_name, db4.match_id as match_id from (select db3.team1 as team1, db3.team2 as team2, db3.winner as winner, db3.vid as vid, db3.t1name as t1name, team.team_name as t2name, db3.match_id as match_id from (select db2.team1 as team1, db2.team2 as team2, db2.winner as winner, db2.vid as vid, team.team_name as t1name, db2.match_id as match_id from (select db1.team1 as team1, db1.team2 as team2, db1.match_winner as winner, db1.venue_id as vid, db1.match_id as match_id from (select row_number() over () as rn, team1, team2, match_winner, venue_id, match_id from match ORDER BY season_year) as db1 where db1.rn <= 10 and db1.rn >= 0) as db2 inner join team on db2.team1 = team.team_id) as db3 inner join team on team.team_id = db3.team2) as db4 inner join team on team.team_id = db4.winner) as db5 inner join venue on db5.vid = venue.venue_id;




select db909.player_id as player_id, player.player_name as player_name, db909.nfours as nfours, db909.nsixes as nsixes, db909.runs as runs, db909.balls as balls, db909.sr as sr from (select db99.player as player_id, COALESCE(db99.nfours, 0) as nfours, COALESCE(db99.nsixes, 0) as nsixes, db99.runs as runs, db99.balls as balls, db99.sr as sr from (select * from (select count(*) as nfours, striker as pid from ball_by_ball where match_id = 501203 and runs_scored=4 and innings_no=2 group by striker) as db11 full outer join (select db1.pid as player, db1.runs as runs, db1.balls as balls, round(db1.runs*100.0/db1.balls, 3) as sr from (select sum(runs_scored) as runs, count(*) as balls, striker as pid, innings_no from ball_by_ball where match_id = 501203 and innings_no=2 group by striker, innings_no) as db1) as db22 on db11.pid = db22.player full outer join (select count(*) as nsixes, striker as pid from ball_by_ball where match_id = 501203 and runs_scored=6 and innings_no=2 group by striker) as db33 on db22.player = db33.pid) as db99) as db909 inner join player on player.player_id = db909.player_id;


select ddb.bowler as bowler, player.player_name, ddb.nballs, ddb.total_runs, ddb.nwickets from (select db1.bowler as bowler, nballs, total_runs, COALESCE(nwickets, 0) as nwickets from (select bowler, count(*) as nballs, sum(runs_scored) + sum(extra_runs) as total_runs from ball_by_ball where match_id = 501203 and innings_no = 1 group by bowler) as db1 full outer join (select bowler, count(*) as nwickets from ball_by_ball where match_id = 501203 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') and innings_no=1 group by bowler) as db2 on db2.bowler = db1.bowler) as ddb inner join player on player.player_id = ddb.bowler;



select player.player_id, player.player_name, ddb1.runs, ddb1.num_balls from (select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = ${match_id} and innings_no=${inn_no} group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3) as ddb1 inner join player on player.player_id = ddb1.player_id;


select player.player_id, player.player_name, db11.nwickets, db11.tot_runs from (select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = ${match_id} and innings_no=${inn_no} and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = ${match_id} and innings_no=1 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3) as db11 inner join player on player.player_id = db11.bowler;


select player.player_id, player.player_name, ddb1.runs, ddb1.num_balls from (select * from (select sum(runs_scored) as runs, striker as player_id, count(*) as num_balls from ball_by_ball where match_id = 501203 and innings_no=2 group by  striker) as db1 order by db1.runs desc, db1.num_balls asc, db1.player_id asc limit 3) as ddb1 inner join player on player.player_id = ddb1.player_id



select player.player_id, player.player_name, db11.nwickets, db11.tot_runs from (select db1.nwickets as nwickets, db1.bowler, db2.tot_runs from (select count(*) as nwickets, bowler from ball_by_ball where match_id = 501203 and innings_no=1 and (out_type = 'bowled' or out_type = 'caught' or out_type = 'caught and bowled' or out_type = 'lbw' or out_type = 'stumped' or out_type = 'keeper catch') group by bowler) as db1 inner join (select sum(runs_scored) + sum(extra_runs) as tot_runs, bowler from ball_by_ball where match_id = 501203 and innings_no=1 group by bowler) as db2 on db1.bowler = db2.bowler order by db1.nwickets desc, db2.tot_runs asc, db1.bowler asc limit 3) as db11 inner join player on player.player_id = db11.bowler


select runs, match.match_id, season_year from (select sum(runs_scored) as runs, match_id from ball_by_ball where ball_by_ball.striker = 20 group by match_id) as db1 inner join match on match.match_id = db1.match_id;