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

/* POST users listing. */
router.post(`/`, (req, res) => {});

function doRelease(connection) {
  connection.close(
    function (err) {
      if (err)
        console.error(err.message);
    });
}

module.exports = router;