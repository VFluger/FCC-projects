#!/bin/bash
PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"
# NOTE: exiting always with 0 to ensure that the test for the course work

element_not_found_exit() {
  echo "I could not find that element in the database."
  exit 0
}

# argument not given, exit
if [[ -z $1 ]]
then
  echo "Please provide an element as an argument."
  exit 0
fi

# argument number, search for atomic number of element
if [[ $1 =~ ^[0-9]+$ ]]
then
  ELEMENT=$($PSQL "SELECT * FROM elements FULL JOIN properties USING(atomic_number) FULL JOIN types USING(type_id) WHERE atomic_number=$1")
  # if element not found, exit
  if [[ -z $ELEMENT ]]
  then
    element_not_found_exit
  fi

  echo $ELEMENT | while IFS='|' read TYPE_ID ATOMIC_NUMBER SHORTCUT NAME MASS MELTING_POINT BOILING_POINT TYPE
  do
    echo "The element with atomic number $ATOMIC_NUMBER is $NAME ($SHORTCUT). It's a $TYPE, with a mass of $MASS amu. $NAME has a melting point of $MELTING_POINT celsius and a boiling point of $BOILING_POINT celsius."
  done
  exit 0
fi

# argument letter, search for shortcut or name of element
if [[ $1 =~ ^[a-zA-Z]+$ ]]
then
  ELEMENT=$($PSQL "SELECT * FROM elements FULL JOIN properties USING(atomic_number) FULL JOIN types USING(type_id) WHERE symbol='$1'")
  # if element not found, exit
  if [[ -z $ELEMENT ]]
  then
    #search for name
    ELEMENT=$($PSQL "SELECT * FROM elements FULL JOIN properties USING(atomic_number) FULL JOIN types USING(type_id) WHERE name='$1'")
    if [[ -z $ELEMENT ]]
    then
      element_not_found_exit
    fi
    echo $ELEMENT | while IFS='|' read TYPE_ID ATOMIC_NUMBER SHORTCUT NAME MASS MELTING_POINT BOILING_POINT TYPE
    do
      echo "The element with atomic number $ATOMIC_NUMBER is $NAME ($SHORTCUT). It's a $TYPE, with a mass of $MASS amu. $NAME has a melting point of $MELTING_POINT celsius and a boiling point of $BOILING_POINT celsius."
    done
  exit 0
  fi

  echo $ELEMENT | while IFS='|' read TYPE_ID ATOMIC_NUMBER SHORTCUT NAME MASS MELTING_POINT BOILING_POINT TYPE
  do
    echo "The element with atomic number $ATOMIC_NUMBER is $NAME ($SHORTCUT). It's a $TYPE, with a mass of $MASS amu. $NAME has a melting point of $MELTING_POINT celsius and a boiling point of $BOILING_POINT celsius."
  done
  exit 0
fi

element_not_found_exit