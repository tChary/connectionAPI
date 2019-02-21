const express = require(`express`);
const router = express.Router();

const dbConfig = require(`./dbconfig`);
const oracledb = require(`oracledb`);


/* GET franchise listings. */
router.get(`/`, (req, res) => {
  oracledb.getConnection({
    user: dbConfig.dbuser,
    password: dbConfig.dbpassword,
    connectString: dbConfig.connectString
  }, (err, connection) => {
    if (err) {
      res.send(err);
      doRelease(connection);
      return;
    }
    connection.execute(`SELECT * FROM franchise`, [], (err, result) => {
      if (err) {
        res.send(err);
        doRelease(connection);
        return;
      }
      res.send(result);
      doRelease(connection);
    });
  });
});

/* POST franchise data. */
router.post(`/`, (req, res) => {

  let FRANCHISE_ID = req.body.FRANCHISE_ID;
  let STREET_ADDRES = req.body.STREET_ADDRES;
  let ADDR_CITY = req.body.ADDR_CITY;
  let ADDR_STATE = req.body.ADDR_STATE;
  let ADDR_ZIP = req.body.ADDR_ZIP;
  let CHAIRS = req.body.CHAIRS;
  let DECORE_ITEMS = req.body.DECORE_ITEMS;
  let NAPKIN_DISPENSORS = req.body.NAPKIN_DISPENSORS;
  let PIZZA_CUTTERS = req.body.PIZZA_CUTTERS;
  let PIE_TRAYS = req.body.PIE_TRAYS;
  let OVER_MODEL = req.body.OVER_MODEL;
  let VENT_HOOD_MODEL = req.body.VENT_HOOD_MODEL;
  let CUSTOMER_DISHES = req.body.CUSTOMER_DISHES;
  let KITCHEN_DISHES = req.body.KITCHEN_DISHES;

  if (!FRANCHISE_ID || !STREET_ADDRES || !ADDR_CITY || !ADDR_STATE || !ADDR_ZIP || !CHAIRS || !DECORE_ITEMS || !NAPKIN_DISPENSORS || !PIZZA_CUTTERS || !PIE_TRAYS || !OVER_MODEL || !VENT_HOOD_MODEL || !CUSTOMER_DISHES || !KITCHEN_DISHES) {
    res.status(400).send(`Required data missing from request body.`);
    return;
  }

  oracledb.getConnection({
    user: dbConfig.dbuser,
    password: dbConfig.dbpassword,
    connectString: dbConfig.connectString
  }, (err, connection) => {
    if (err) {
      res.send(err);
      doRelease(connection);
      return;
    }

    let insertString = `INSERT INTO franchise (FRANCHISE_ID, STREET_ADDRES, ADDR_CITY, ADDR_STATE, ADDR_ZIP, CHAIRS, DECORE_ITEMS, NAPKIN_DISPENSORS, PIZZA_CUTTERS, PIE_TRAYS, OVER_MODEL, VENT_HOOD_MODEL, CUSTOMER_DISHES, KITCHEN_DISHES) VALUES (${FRANCHISE_ID}, '${STREET_ADDRES}', '${ADDR_CITY}', '${ADDR_STATE}', ${ADDR_ZIP}, ${CHAIRS}, ${DECORE_ITEMS}, ${NAPKIN_DISPENSORS}, ${PIZZA_CUTTERS}, ${PIE_TRAYS}, '${OVER_MODEL}', '${VENT_HOOD_MODEL}', ${CUSTOMER_DISHES}, ${KITCHEN_DISHES})`;

    console.log(`insertString`);
    console.log(insertString);

    connection.execute(insertString, (err, result) => {
      if (err) {
        res.send(err);
        doRelease(connection);
        return;
      }
      connection.commit((err) => {
        if (err) {
          res.send(err);
          doRelease(connection);
          return;
        }
        res.send(result);
        doRelease(connection);
      })
    });
  });
});


function doRelease(connection) {
  connection.close(
    function (err) {
      if (err)
        console.error(err.message);
    });
}

module.exports = router;