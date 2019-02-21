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
      let resultArray = result.rows.map((row) => {
        let rowObj = {};
        result.metaData.forEach((item, index) => {
          let keyName = item.name;
          rowObj[keyName] = row[index];
        });
        return rowObj;
      });
      res.send(resultArray);
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
      res.status(500).send(err);
      doRelease(connection);
      return;
    }

    let insertString = `INSERT INTO franchise (FRANCHISE_ID, STREET_ADDRES, ADDR_CITY, ADDR_STATE, ADDR_ZIP, CHAIRS, DECORE_ITEMS, NAPKIN_DISPENSORS, PIZZA_CUTTERS, PIE_TRAYS, OVER_MODEL, VENT_HOOD_MODEL, CUSTOMER_DISHES, KITCHEN_DISHES) VALUES (${FRANCHISE_ID}, '${STREET_ADDRES}', '${ADDR_CITY}', '${ADDR_STATE}', ${ADDR_ZIP}, ${CHAIRS}, ${DECORE_ITEMS}, ${NAPKIN_DISPENSORS}, ${PIZZA_CUTTERS}, ${PIE_TRAYS}, '${OVER_MODEL}', '${VENT_HOOD_MODEL}', ${CUSTOMER_DISHES}, ${KITCHEN_DISHES})`;

    // eslint-disable-next-line no-console
    console.log(`insertString`);
    // eslint-disable-next-line no-console
    console.log(insertString);

    connection.execute(insertString, (err, result) => {
      if (err) {
        let replyObj = {};
        replyObj.error = err;
        replyObj.status = `Record Not Inserted`;
        res.status(202).send(replyObj);
        doRelease(connection);
        return;
      }
      connection.commit((err) => {
        if (err) {
          let replyObj = {};
          replyObj.error = err;
          replyObj.status = `Record Not Inserted`;
          res.status(202).send(replyObj);
          doRelease(connection);
          return;
        }
        res.send(result);
        doRelease(connection);
      });
    });
  });
});

/* GET franchise listings. */
router.patch(`/`, (req, res) => {

  if (!req.body.FRANCHISE_ID) {
    res.status(400).send(`Required data missing from request body.`);
    return;
  }

  let franchiseID = req.body.FRANCHISE_ID;

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

    let queryString = `SELECT * FROM franchise WHERE FRANCHISE_ID=${franchiseID}`;

    connection.execute(queryString, [], (err, result) => {
      if (err) {
        res.send(err);
        doRelease(connection);
        return;
      }
      if (result.rows.length === 0) {
        res.status(404);
        doRelease(connection);
        return;
      }
      console.log(`result.rows[0]`);
      console.log(result.rows[0]);
      res.send(result);
      doRelease(connection);
    });
  });
});




function doRelease(connection) {
  connection.close(
    function (err) {
      if (err)
        // eslint-disable-next-line no-console
        console.error(err.message);
    });
}

module.exports = router;