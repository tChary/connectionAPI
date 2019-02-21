# API to allow connections from OIC to ATP.

Let's try to get the API spec here in this document...

-----
```
POST Request to /franchise:

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

Response

{
“response”:“Record Created”
}
```
-----
```
Request :

{
    “franchise”:“1",
    “chairs”:“7",
    “decore_items”:“21",
    “napkins”:“”,
    “pizza_cutters”:“20",
    “pie_tray”:“10",
    “oven”:“1",
    “vent_hood”:“”,
    “ingredient_tray”:“”
}


Response

{
“response”:“Data Submitted”
}
```