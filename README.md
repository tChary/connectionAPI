# Node to Oracle Autonomous Transaction Processing.

### History

This project originally started as an API for connecting Oracle Integration Cloud to a Autonomous Transaction Processing database instance for a demo use case involving adding franchise locations to a database.

### Today

This project now exists as a tutorial on how to create a Node application that can connect to an Oracle Autonomous Transaction Processing instance. Whether you need to create a quick REST endpoint for your ATP database or have existing microservices running in Node and want to use ATP for your database.

### Acknowledgments

Credit to [tejuscs](https://github.com/tejuscs) for his [very thorough lab on Autonomous Transaction Processing](https://oracle.github.io/learning-library/workshops/autonomous-transaction-processing/?page=README.md). If you want more information on ATP beyond connecting to a Node app, I highly recommend it.

### Prerequisites

This tutorial assumes you have the following:

- An Oracle Autonomous Transaction Processing Database
- The client credentials (wallet) for the ATP database




-----
POST Request to /franchise
```
{
	"FRANCHISE_ID" : <integer>,
	"STREET_ADDRES" : <string>,
	"ADDR_CITY" : <string>,
	"ADDR_STATE" : <string>,
	"ADDR_ZIP" : <integer>,
	"CHAIRS" : <integer>,
	"DECORE_ITEMS" : <integer>,
	"NAPKIN_DISPENSORS" : <integer>,
	"PIZZA_CUTTERS" : <integer>,
	"PIE_TRAYS" : <integer>,
	"OVER_MODEL" : <string>,
	"VENT_HOOD_MODEL" : <string>,
	"CUSTOMER_DISHES" : <integer>,
	"KITCHEN_DISHES" : <integer>
}
```
Response:
```
{
    "rowsAffected": 1
}
```
-----
POST Request to /users
```
{
	"USER_ID" : <integer>,
	"FIRST_NAME" : <string>,
	"LAST_NAME" : <string>,
	"PHONE_NUMBER" : <string>,
	"HOME_ADDRESS" : <string>,
	"EMAIL_ADDRESS" : <string>,
	"TAX_ID" : <string>,
	"USER_CITY" : <string>,
	"USER_STATE" : <string>,
	"USER_ZIP" : <string>,
	"FRANCHISE_ID" : <integer>
}
```
Response:
```
{
  "rowsAffected": 1
}
```