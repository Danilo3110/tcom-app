const jwt = require('jsonwebtoken');
const verifyToken = require('../verifyToken');

module.exports = function (app, express, mysqlConnection) {

  const router = express.Router();

  // users table //
  router.route('/users')
    .get(verifyToken, (req, res) => {
      mysqlConnection.query('SELECT * FROM users', function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Users list.', user: req.user });
      });
    })
    .post(verifyToken, (req, res) => {
      mysqlConnection.query('INSERT INTO users (name, username, password, user_type, photo_url) values (?,?,?,?,?)',
        [req.body.name, req.body.username, req.body.password, req.body.user_type, req.body.photo_url], function (error, results) {
          if (error) throw error;
          return res.send({ error: false, data: results, message: 'Successfully added new user', user: req.user });
        });
    });
  router.route('/users/:id')
    .get(verifyToken, (req, res) => {
      if (!req.params.id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
      }
      mysqlConnection.query('SELECT * FROM users where id=?', req.params.id, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Users by id.', user: req.user });
      });
    })
    .patch(verifyToken, (req, res) => {
      mysqlConnection.query("UPDATE users SET ? WHERE id = ?", [req.body, req.params.id], function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Accommodation has been patched successfully.', user: req.user });
      });
    })
    .delete(verifyToken, (req, res) => {
      mysqlConnection.query('DELETE FROM users WHERE id=?', req.params.id, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been deleted successfully.', user: req.user });
      });
    });

  // login route //
  router.route('/login')
    .post((req, res) => {
      mysqlConnection.query('SELECT * FROM `users` WHERE username = ? && password = ?', [req.body.username, req.body.password], function (error, results) {
        if (error) throw error;
        const loggedUser = results[0];
        if (loggedUser) {
          //create and assign a token
          const token = jwt.sign({
            id: loggedUser.id,
            username: loggedUser.username,
            password: loggedUser.password,
            user_type: loggedUser.user_type,
            photo_url: loggedUser.photo_url,
            name: loggedUser.name,
          }, 'sdfsdfsdfsdf131sdfsdfs', { expiresIn: '1h' });
          //res now includes all info specified in jwt.sign method
          res.send({ token });
        }
        else { res.send({ message: 'No user with those credentials' }); }
      });
    });

  app.use(router);
};