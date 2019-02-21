# API to allow connections from OIC to ATP.

Let's try to get the API spec here in this document...

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