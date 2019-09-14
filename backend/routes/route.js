const jwt = require('jsonwebtoken');
const verifyToken = require('../verifyToken');

module.exports = function (app, express, mysqlConnection) {

  const router = express.Router();

  // table //
  router.route('/accommodations')
    .get(verifyToken, (req, res) => {
      mysqlConnection.query('SELECT * FROM accommodations', function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Accommodations list.', user: req.user });
      });
    })
    .post(verifyToken, (req, res) => {
      if (!req.body) {
        return res.status(400).send({ error: true, message: 'Please provide accommodation data' });
      }
      mysqlConnection.query('INSERT INTO accommodations (name, hotel_descr, hotel_img, link, id_city) values (?,?,?,?,?)',
        [req.body.name, req.body.hotel_descr, req.body.hotel_img, req.body.link, req.body.id_city], function (error, results) {
          if (error) throw error;
          //req.user is the info about the logged in user
          return res.send({ error: false, data: results, message: 'New accommodation has been added successfully.', user: req.user });
        });
    });
  router.route('/accommodations/:id')
    .get(verifyToken, (req, res) => {
      if (!req.params.id) {
        return res.status(400).send({ error: true, message: 'Please provide accommodation id' });
      }
      mysqlConnection.query('SELECT * FROM accommodations where id=?', req.params.id, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Accommodations list by id.', user: req.user });
      });
    })
    .patch(verifyToken, (req, res) => {
      mysqlConnection.query("UPDATE accommodations SET ? WHERE id = ?", [req.body, req.params.id], function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Accommodation has been patched successfully.', user: req.user });
      });
    })
    .delete(verifyToken, (req, res) => {
      mysqlConnection.query('DELETE FROM accommodations WHERE id = ?', req.params.id, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Accommodation has been deleted successfully.', user: req.user });
      });
    });

  // users table //
  router.route('/users')
    .get(verifyToken, (req, res) => {
      mysqlConnection.query('SELECT * FROM users', function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Users list.', user: req.user });
      });
    })
    .post(verifyToken, (req, res) => {
      mysqlConnection.query('INSERT INTO users (name, username, password, is_admin, photo) values (?,?,?,?,?)',
        [req.body.name, req.body.username, req.body.password, req.body.is_admin, req.body.photo], function (error, results) {
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
            privileges: loggedUser.privileges,
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