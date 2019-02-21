const express = require(`express`);
const router = express.Router();

const dbConfig = require(`./dbconfig`);
const oracledb = require(`oracledb`);


/* GET users listing. */
router.get(`/`, (req, res) => {
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
    connection.execute(`SELECT * FROM users`, [], (err, result) => {
      if (err) {
        res.status(500).send(err);
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

/* POST user data. */
router.post(`/`, (req, res) => {

  let USER_ID = req.body.USER_ID;
  let FIRST_NAME = req.body.FIRST_NAME;
  let LAST_NAME = req.body.LAST_NAME;
  let PHONE_NUMBER = req.body.PHONE_NUMBER;
  let HOME_ADDRESS = req.body.HOME_ADDRESS;
  let EMAIL_ADDRESS = req.body.EMAIL_ADDRESS;
  let TAX_ID = req.body.TAX_ID;
  let USER_CITY = req.body.USER_CITY;
  let USER_STATE = req.body.USER_STATE;
  let USER_ZIP = req.body.USER_ZIP;
  let FRANCHISE_ID = req.body.FRANCHISE_ID;

  if (!USER_ID || !FIRST_NAME || !LAST_NAME || !PHONE_NUMBER || !HOME_ADDRESS || !EMAIL_ADDRESS || !TAX_ID || !USER_CITY || !USER_STATE || !USER_ZIP || !FRANCHISE_ID) {
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

    let insertString = `INSERT INTO users (USER_ID, FIRST_NAME, LAST_NAME, PHONE_NUMBER, HOME_ADDRESS, EMAIL_ADDRESS, TAX_ID, USER_CITY, USER_STATE, USER_ZIP, FRANCHISE_ID) VALUES (${USER_ID}, '${FIRST_NAME}', '${LAST_NAME}', '${PHONE_NUMBER}', '${HOME_ADDRESS}', '${EMAIL_ADDRESS}', '${TAX_ID}', '${USER_CITY}', '${USER_STATE}', ${USER_ZIP}, ${FRANCHISE_ID})`;

    // eslint-disable-next-line no-console
    console.log(`insertString`);
    // eslint-disable-next-line no-console
    console.log(insertString);

    connection.execute(insertString, (err, result) => {
      if (err) {
        res.status(500).send(err);
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