const express = require(`express`);
const router = express.Router();

// Get the database configuration data.
const dbConfig = require(`./dbconfig`);
const oracledb = require(`oracledb`);


/* GET users listing. */
router.get(`/`, (_req, res) => {
  // Creating the connection to Oracle Autonomous Transaction Processing.
  oracledb.getConnection({
    user: dbConfig.dbuser,
    password: dbConfig.dbpassword,
    connectString: dbConfig.connectString
  }, (err, connection) => {
    // Checking for error when creating connection.
    if (err) {
      res.status(500).send(err);
      doRelease(connection);
      return;
    }
    // We have a good connection, so execute a grab of all data from table.
    connection.execute(`SELECT * FROM users`, [], (err, result) => {
      // Error checking again.
      if (err) {
        res.status(500).send(err);
        doRelease(connection);
        return;
      }
      // Taking the raw data from the rows and turning them into an array of objects with appropriate key-value pairing.
      let resultArray = result.rows.map((row) => {
        let rowObj = {};
        result.metaData.forEach((item, index) => {
          let keyName = item.name;
          rowObj[keyName] = row[index];
        });
        return rowObj;
      });
      // Send our results.
      res.send(resultArray);
      // Release the connection.
      doRelease(connection);
    });
  });
});

/* POST user data. */
router.post(`/`, (req, res) => {
  // Putting the values from the request body into variables for ease-of-use.
  let USER_ID = req.body.USER_ID;
  // Checking for apostrophes in names, because that bit us before. Escaping them appropriately to be added to DB.
  let nameArr = req.body.FIRST_NAME.split(`'`);
  let FIRST_NAME = nameArr.join(`''`);
  // Same with last name.
  nameArr = req.body.LAST_NAME.split(`'`);
  let LAST_NAME = nameArr.join(`''`);

  let PHONE_NUMBER = req.body.PHONE_NUMBER;
  let HOME_ADDRESS = req.body.HOME_ADDRESS;
  let EMAIL_ADDRESS = req.body.EMAIL_ADDRESS;
  let TAX_ID = req.body.TAX_ID;
  let USER_CITY = req.body.USER_CITY;
  let USER_STATE = req.body.USER_STATE;
  let USER_ZIP = req.body.USER_ZIP;
  let FRANCHISE_ID = req.body.FRANCHISE_ID;

  // If we are missing any of the values, return a 400.
  if (!USER_ID || !FIRST_NAME || !LAST_NAME || !PHONE_NUMBER || !HOME_ADDRESS || !EMAIL_ADDRESS || !TAX_ID || !USER_CITY || !USER_STATE || !USER_ZIP || !FRANCHISE_ID) {
    res.status(400).send(`Required data missing from request body.`);
    return;
  }

  // Create the DB connection.
  oracledb.getConnection({
    user: dbConfig.dbuser,
    password: dbConfig.dbpassword,
    connectString: dbConfig.connectString
  }, (err, connection) => {
    // Check for error creating connection.
    if (err) {
      res.status(500).send(err);
      doRelease(connection);
      return;
    }

    // Creating our query string for the insert statement.
    let insertString = `INSERT INTO users (USER_ID, FIRST_NAME, LAST_NAME, PHONE_NUMBER, HOME_ADDRESS, EMAIL_ADDRESS, TAX_ID, USER_CITY, USER_STATE, USER_ZIP, FRANCHISE_ID) VALUES (${USER_ID}, '${FIRST_NAME}', '${LAST_NAME}', '${PHONE_NUMBER}', '${HOME_ADDRESS}', '${EMAIL_ADDRESS}', '${TAX_ID}', '${USER_CITY}', '${USER_STATE}', ${USER_ZIP}, ${FRANCHISE_ID})`;

    // eslint-disable-next-line no-console
    console.log(`insertString`);
    // eslint-disable-next-line no-console
    console.log(insertString);

    // Execute the insert statement.
    connection.execute(insertString, (err, result) => {
      // Check for error when inserting.
      if (err) {
        let replyObj = {};
        replyObj.error = err;
        replyObj.status = `Record Not Inserted`;
        // We return a 202 here so OIC can fail gracefully.
        res.status(202).send(replyObj);
        doRelease(connection);
        return;
      }
      // There's no error, so let's commit the transaction.
      connection.commit((err) => {
        // Error checking again.
        if (err) {
          let replyObj = {};
          replyObj.error = err;
          replyObj.status = `Record Not Inserted`;
          // Once again, we return a 202 here so OIC can fail gracefully.
          res.status(202).send(replyObj);
          doRelease(connection);
          return;
        }
        // Send the positive result.
        res.send(result);
        doRelease(connection);
      });
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