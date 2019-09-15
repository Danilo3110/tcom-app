
module.exports = function (app, express, mysqlConnection) {

    const router = express.Router();
  
    // app1 table //
    router.route('/app2')
      .get((req, res) => {
        mysqlConnection.query('SELECT * FROM app2', function (error, results) {
          if (error) throw error;
          return res.send({ error: false, data: results, message: 'app2 list.', user: req.user });
        });
      });
  
    router.route('/app2/:id')
      .get((req, res) => {
        if (!req.params.id) {
          return res.status(400).send({ error: true, message: 'Please provide link id' });
        }
        mysqlConnection.query('SELECT * FROM app2 where id=?', req.params.id, function (error, results) {
          if (error) throw error;
          return res.send({ error: false, data: results[0], message: 'Links by id.', user: req.user });
        });
      })
      .patch((req, res) => {
        mysqlConnection.query("UPDATE app2 SET ? WHERE id = ?", [req.body, req.params.id], function (error, results) {
          if (error) throw error;
          return res.send({ error: false, data: results, message: 'Comment has been patched successfully.', user: req.user });
        });
      });
  
    app.use(router);
  };