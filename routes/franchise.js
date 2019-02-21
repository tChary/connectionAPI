const express = require(`express`);
const router = express.Router();

const dbConfig = require(`./dbconfig`);
const oracledb = require(`oracledb`);


/* GET franchise listings. */
router.get(`/`, (_req, res) => {
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

/* GET a specific franchise listings. */
router.get(`/:id`, (req, res) => {
  let franchiseID = parseInt(req.params.id);
  if (isNaN(franchiseID)) {
    res.status(400).send(`Franchise ID must be a number.`);
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
    connection.execute(`SELECT * FROM franchise WHERE FRANCHISE_ID=${franchiseID}`, [], (err, result) => {
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

  //  let FRANCHISE_ID = req.body.FRANCHISE_ID;
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

  if (!STREET_ADDRES || !ADDR_CITY || !ADDR_STATE || !ADDR_ZIP || !CHAIRS || !DECORE_ITEMS || !NAPKIN_DISPENSORS || !PIZZA_CUTTERS || !PIE_TRAYS || !OVER_MODEL || !VENT_HOOD_MODEL || !CUSTOMER_DISHES || !KITCHEN_DISHES) {
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

    let insertString = `INSERT INTO franchise (STREET_ADDRES, ADDR_CITY, ADDR_STATE, ADDR_ZIP, CHAIRS, DECORE_ITEMS, NAPKIN_DISPENSORS, PIZZA_CUTTERS, PIE_TRAYS, OVER_MODEL, VENT_HOOD_MODEL, CUSTOMER_DISHES, KITCHEN_DISHES) VALUES ('${STREET_ADDRES}', '${ADDR_CITY}', '${ADDR_STATE}', ${ADDR_ZIP}, ${CHAIRS}, ${DECORE_ITEMS}, ${NAPKIN_DISPENSORS}, ${PIZZA_CUTTERS}, ${PIE_TRAYS}, '${OVER_MODEL}', '${VENT_HOOD_MODEL}', ${CUSTOMER_DISHES}, ${KITCHEN_DISHES}) RETURNING FRANCHISE_ID INTO :franchise`;

    // eslint-disable-next-line no-console
    console.log(`insertString`);
    // eslint-disable-next-line no-console
    console.log(insertString);

    connection.execute(insertString, {
      franchise: {
        type: oracledb.NUMBER,
        dir: oracledb.BIND_OUT
      }
    }, (err, result) => {
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
          replyObj.status = `Record Not Inserted - Commit`;
          res.status(202).send(replyObj);
          doRelease(connection);
          return;
        }
        let replyObj = {};
        replyObj.rowsAffected = `${result.outBinds.franchise[0]}`;
        res.send(replyObj);
        doRelease(connection);
      });
    });
  });
});

/* PATCH part of franchise listings. */
router.patch(`/update`, (req, res) => {

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
      if (result.rows.length !== 1) {
        res.sendStatus(404);
        doRelease(connection);
        return;
      }
      let resultArr = result.rows.map((row) => {
        let rowObj = {};
        result.metaData.forEach((item, index) => {
          let keyName = item.name;
          rowObj[keyName] = row[index];
        });
        return rowObj;
      });

      let resultObj = resultArr[0];

      let valuesString = ``;

      if (req.body.CHAIRS) {
        resultObj.CHAIRS += parseInt(req.body.CHAIRS);
        valuesString += `CHAIRS = ${resultObj.CHAIRS}`;
      }

      if (req.body.DECORE_ITEMS) {
        resultObj.DECORE_ITEMS += parseInt(req.body.DECORE_ITEMS);
        if (valuesString) {
          valuesString += `, DECORE_ITEMS = ${resultObj.DECORE_ITEMS}`;
        } else {
          valuesString += `DECORE_ITEMS = ${resultObj.DECORE_ITEMS}`;
        }
      }

      if (req.body.NAPKIN_DISPENSORS) {
        resultObj.NAPKIN_DISPENSORS += parseInt(req.body.NAPKIN_DISPENSORS);
        if (valuesString) {
          valuesString += `, NAPKIN_DISPENSORS = ${resultObj.NAPKIN_DISPENSORS}`;
        } else {
          valuesString += `NAPKIN_DISPENSORS = ${resultObj.NAPKIN_DISPENSORS}`;
        }
      }

      if (req.body.PIZZA_CUTTERS) {
        resultObj.PIZZA_CUTTERS += parseInt(req.body.PIZZA_CUTTERS);
        if (valuesString) {
          valuesString += `, PIZZA_CUTTERS = ${resultObj.PIZZA_CUTTERS}`;
        } else {
          valuesString += `PIZZA_CUTTERS = ${resultObj.PIZZA_CUTTERS}`;
        }
      }

      if (req.body.PIE_TRAYS) {
        resultObj.PIE_TRAYS += parseInt(req.body.PIE_TRAYS);
        if (valuesString) {
          valuesString += `, PIE_TRAYS = ${resultObj.PIE_TRAYS}`;
        } else {
          valuesString += `PIE_TRAYS = ${resultObj.PIE_TRAYS}`;
        }
      }

      if (req.body.CUSTOMER_DISHES) {
        resultObj.CUSTOMER_DISHES += parseInt(req.body.CUSTOMER_DISHES);
        if (valuesString) {
          valuesString += `, CUSTOMER_DISHES = ${resultObj.CUSTOMER_DISHES}`;
        } else {
          valuesString += `CUSTOMER_DISHES = ${resultObj.CUSTOMER_DISHES}`;
        }
      }

      if (req.body.KITCHEN_DISHES) {
        resultObj.KITCHEN_DISHES += parseInt(req.body.KITCHEN_DISHES);
        if (valuesString) {
          valuesString += `, KITCHEN_DISHES = ${resultObj.KITCHEN_DISHES}`;
        } else {
          valuesString += `KITCHEN_DISHES = ${resultObj.KITCHEN_DISHES}`;
        }
      }

      if (valuesString) {
        let updateString = `UPDATE franchise SET ${valuesString} WHERE FRANCHISE_ID = ${franchiseID}`;
        connection.execute(updateString, [], (err, result) => {
          if (err) {
            let replyObj = {};
            replyObj.error = err;
            replyObj.status = `Update did not complete.`;
            res.send(replyObj);
            doRelease(connection);
            return;
          }
          connection.commit((err) => {
            if (err) {
              let replyObj = {};
              replyObj.error = err;
              replyObj.status = `Record Not Update - Commit`;
              res.status(202).send(replyObj);
              doRelease(connection);
              return;
            }
            res.send(result);
            doRelease(connection);
          });
        });
      } else {
        res.send(result);
        doRelease(connection);
      }
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