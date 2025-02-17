#!/bin/bash
PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

# random num floored to 1000
RANDOM_NUM=$(( $RANDOM / 100 ))

GUESS_COUNT=0

# main guess func, recursive
GUESS() {
read USER_GUESS

if [[ ! $USER_GUESS =~ ^[0-9]+$ ]]
then
  echo -e "\nThat is not an integer, guess again:"
  GUESS
fi

  GUESS_COUNT=$(( $GUESS_COUNT + 1 ))

if [[ ! $USER_GUESS = $RANDOM_NUM ]]
then
  if [[ $USER_GUESS -gt $RANDOM_NUM ]]
  then
    # secret is lower
    echo -e "\nIt's lower than that, guess again:"
    GUESS
  else
    # secret is higher
    echo -e "\nIt's higher than that, guess again:"
    GUESS
  fi
else
# TODO
  OUTPUT_INSERT_GAME=$($PSQL "INSERT INTO games(guess_count, user_id) VALUES($GUESS_COUNT, $USER_ID)")
  echo -e "\nYou guessed it in $GUESS_COUNT tries. The secret number was $RANDOM_NUM. Nice job!"
fi
}
# start of script
echo "Enter your username:"
read USER_NAME
USER_ID=$($PSQL "SELECT user_id FROM users WHERE name='$USER_NAME'")

if [[ -z $USER_ID ]]
#new user
then
  echo -e "\nWelcome, $USER_NAME! It looks like this is your first time here."
  OUTPUT_INSERT_USER=$($PSQL "INSERT INTO users(name) VALUES('$USER_NAME')")
  #update user id
  USER_ID=$($PSQL "SELECT user_id FROM users WHERE name='$USER_NAME'")
else
  #old user
  BEST_GAME=$($PSQL "SELECT MIN(guess_count) FROM users FULL JOIN games USING(user_id) WHERE user_id=$USER_ID")
  NUM_OF_GAMES=$($PSQL "SELECT COUNT(game_id) FROM users FULL JOIN games USING(user_id) WHERE user_id=$USER_ID")

  echo -e "\nWelcome back, $USER_NAME! You have played $NUM_OF_GAMES games, and your best game took $BEST_GAME guesses."
fi

echo -e "\nGuess the secret number between 1 and 1000:"
GUESS