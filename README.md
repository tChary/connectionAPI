# API to allow connections from OIC to ATP.

Let's try to get the API spec here in this document...

-----
```
Request :

{
“name”:“raj”,
“dateofbirth”:“12182003",
“position”:“clerk”,
“phone_number”:“1234567890",
“franchise”:“1"
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