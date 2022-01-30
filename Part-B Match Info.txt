Match : match_id, team1_name vs team2_name, year of playing

        Toss:

        Venue:

        Umpires :

        Playing XI of team1:

        Playing XI of team2:

select team_name from match join team on match.team1 = team.team_id where match_id = match_id;
select team_name from match join team on match.team2 = team.team_id where match_id = match_id;
select season_year from match where match_id = match_id;
select team_name from match join team on match.toss_winner = team.team_id where match_id = match_id;
select venue_name from match join venue on match.venue_id = venue.venue_id where match_id = match_id;
select umpire_name from umpire join umpire_match on umpire.umpire_id = umpire_match.umpire_id where match_id = match_id;
select player_name from player join player_match on player.player_id = player_match.player_id join match on match.team1 = player_match.team_id where match.match_id = player_match.match_id and match.match_id = match_id;
select player_name from player join player_match on player.player_id = player_match.player_id join match on match.team2 = player_match.team_id where match.match_id = player_match.match_id and match.match_id = match_id;
