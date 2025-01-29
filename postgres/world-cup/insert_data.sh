#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -t --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -t --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.
first_line=true
($PSQL "TRUNCATE TABLE games, teams")
cat games.csv | while IFS=',' read YEAR ROUND WINNER OPPONENT WINNER_GOALS OPPONENT_GOALS
do
  if $first_line
  then
    first_line=false
    continue
  fi
  WINNER_ID=$($PSQL "SELECT team_id FROM teams WHERE name='$WINNER'")
  if [[ -z $WINNER_ID ]]
  then
    ADD_WINNER_TEAM_OUTPUT=$($PSQL "INSERT INTO teams(name) VALUES('$WINNER')")
    WINNER_ID=$($PSQL "SELECT team_id FROM teams WHERE name='$WINNER'")
    if [[ $ADD_WINNER_TEAM_OUTPUT = 'INSERT 0 1' ]]
      then
      echo INSERT SUCCESS
    fi
  fi
  OPPONENT_ID=$($PSQL "SELECT team_id FROM teams WHERE name='$OPPONENT'")
  if [[ -z $OPPONENT_ID ]]
  then
    ADD_OPPONENT_TEAM_OUTPUT=$($PSQL "INSERT INTO teams(name) VALUES('$OPPONENT')")
    OPPONENT_ID=$($PSQL "SELECT team_id FROM teams WHERE name='$OPPONENT'")
    if [[ $ADD_OPPONENT_TEAM_OUTPUT = 'INSERT 0 1' ]]
      then
      echo INSERT SUCCESS
    fi
  fi
  
  ADD_GAME_OUTPUT=$($PSQL "INSERT INTO games(year, round, winner_id, opponent_id, winner_goals, opponent_goals) VALUES($YEAR, '$ROUND', $WINNER_ID, $OPPONENT_ID, $WINNER_GOALS, $OPPONENT_GOALS)")
  if [[ $ADD_GAME_OUTPUT = 'INSERT 0 1' ]]
  then
    echo GAME INSERT SUCCESS
  fi
done