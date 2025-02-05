#!/bin/bash

# salon appointments system
PSQL="psql --tuples-only --username=freecodecamp --dbname=salon -c"

echo -e "\n~~~ Vojtik's Salon ~~~"
MAIN_MENU() {
if [[ -z $1 ]]
then
  echo -e "\nWelcome to My Salon, how can I help you?\n"
else 
  echo -e "\n$1"
fi
$PSQL "SELECT * FROM services" | while read SERVICE_ID BAR SERVICE_NAME
do
  if [[ -z $SERVICE_ID ]]
  then
    continue
  fi
  echo $SERVICE_ID\) $SERVICE_NAME
done
read SERVICE_ID_SELECTED
SERVICE_NAME_SELECTED=$($PSQL "SELECT name FROM services WHERE service_id=$SERVICE_ID_SELECTED")

if [[ $SERVICE_ID_SELECTED -gt 4 ]]
then
  MAIN_MENU "Sorry, I couldn't find that service, try again?"
fi

echo "Please, enter your phone number"
read CUSTOMER_PHONE
USER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")
if [[ -z $USER_ID ]]
then
  echo "Please enter your name"
  read CUSTOMER_NAME
  INSERT_CUSTOMER_OUTPUT=$($PSQL "INSERT INTO customers(phone, name) VALUES('$CUSTOMER_PHONE', '$CUSTOMER_NAME')")
  USER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")
else
  CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone='$CUSTOMER_PHONE'")
fi
echo "What time would you like to visit us?"
read SERVICE_TIME

INSERT_APPOINTMENT_OUTPUT=$($PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($USER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME')")
FORMATTED_SERVICE_NAME=$(echo $SERVICE_NAME_SELECTED | sed 's/ //g')
FORMATTED_CUSTOMER_NAME=$(echo $CUSTOMER_NAME | sed 's/ //g')
echo -e "\nI have put you down for a $FORMATTED_SERVICE_NAME at $SERVICE_TIME, $FORMATTED_CUSTOMER_NAME."
}
MAIN_MENU
