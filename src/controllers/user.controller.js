const bcrypt = require('bcrypt'),
  APICustom = require('../classes/Error/customError'),
  sendEmail = require('../notificaciones/emails/Registration/newUser'),
  UserFactory = require('../classes/User/UserFactory.class');

class UserController {
  constructor() {
    this.userDAO = UserFactory.get();
    this.message = new APICustom();
  }
  renderProfile = async (req, res) => {
    const email = req.user.email ? req.user.email : req.user._json.email;
    try {
      const usuario = await this.userDAO.mostrarEmail(email);
      res.render('profile', { usuario: usuario.toJSON(), title: 'Perfil' });
    } catch (error) {
      this.message.errorInternalServer(error, 'error al obtener perfik');
    }
  };

  renderLogOut = (req, res, next) => {
    try {
      req.session.destroy((err) => {
        res.clearCookie('jwt');
        res.redirect('/');

        if (err) next(err);
      });
    } catch (error) {
      const mensaje = 'Error al cerrar sesion';
      this.message.errorInternalServer(error, mensaje);
    }
  };
  register = async (req, email, password, done) => {
    try {
      const user = await this.userDAO.mostrarEmail(email);

      if (user) {
        done(null, false, {
          message: 'The Email is already Taken',
        });
      } else {
        req.body.email = email;
        password = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(5),
          null
        );

        const phoneFull = '+' + req.body.country + req.body.phone;
        const newUserRegister = {
          email: email,
          password: password,
          phone: phoneFull,
          name: req.body.name,
          lastName: req.body.lastName,
          address: req.body.address,
          age: req.body.age,
          avatar: req.file.filename,
          membershipID: 2 //no admin por defecto
        };

        await this.userDAO.guardar(newUserRegister);
        done(null, newUserRegister, sendEmail(newUserRegister));
      }
    } catch (error) {
      const mensaje = 'Error al crear usuario';
      this.message.errorInternalServer(error, mensaje);
    }
  };

  existPassport = async (email) => {
    const user = await this.userDAO.mostrarEmail(email);
    return user;
  };

  editProfile = async (req, res) => {
    const id = req.params.id;

    const nuevoDatos = {
      name: req.body.name,
      lastName: req.body.lastName,
      address: req.body.address,
      age: req.body.age,
      phone: req.body.phone,
    };

    try {
      const newUser = await this.userDAO.actualizarPorEmail(id, nuevoDatos);

      res.status(200).json({ Perfil_actualizado: newUser });
    } catch (error) {
      const mensaje = 'Error al editar el perfil';
      this.message.errorInternalServer(error, mensaje);
    }
  };

  login = async (req, email, password, done) => {
    try {
      const user = await this.userDAO.mostrarEmail(email);
      if (!user) {
        done(null, false, {
          message: 'No existe el correo registrado',
        });
      } else {
        bcrypt.compare(password, user.password, function (err, result) {
          if (result == true) {
            return done(null, user);
          } else {
            done(null, false, {
              message: 'Contraseña incorrecta',
            });
          }
        });
      }
    } catch (error) {
      const mensaje = 'Error al iniciar sesion';
      this.message.errorInternalServer(error, mensaje);
    }
  };

  //CHAT
  addChannel = function (req, res, next) {
    const channelToAdd = req.body.createInput;
    const username = req.user.username;

    User.findOne({ username }, function (err, user) {
      if (err) {
        res.send({
          error: err,
        });
        return next(err);
      }

      if (!user) {
        return res.status(422).json({
          error: 'Could not find user.',
        });
      }

      // This prevents the user from joining duplicate channels
      if (user.usersChannels.indexOf(channelToAdd) == -1) {
        user.usersChannels.push(channelToAdd);
      } else {
        return res.status(422).json({
          error: 'Already joined that channel.',
        });
      }

      user.save(function (err, updatedUser) {
        if (err) {
          res.send({
            error: err,
          });
          return next(err);
        }

        res.status(200).json({
          message: 'Successfully joined channel.',
          channels: user.usersChannels,
        });
      });
    });
  };

  // Takes a channel name and username
  // If a user is found, it looks through the user's usersChannel array
  // The request channel to remove is filtered from the array and the user's info is saved again
  // Returns the new usersChannel array in the json response
  removeChannel = function (req, res, next) {
    const channelName = req.body.channel;
    const username = req.user.username;

    User.findOne({ username }, function (err, user) {
      if (err) {
        res.send({
          error: err,
        });
        return next(err);
      }

      if (!user) {
        return res.status(422).json({
          error: 'Could not find user.',
        });
      }

      // Removes the channel that was requested
      const removedChannel = user.usersChannels.filter(function (channel) {
        return channel !== channelName;
      });

      user.usersChannels = removedChannel;

      user.save(function (err, updatedUser) {
        if (err) {
          res.send({
            error: err,
          });
          return next(err);
        }

        res.status(200).json({
          message: `Removed channel: ${channelName}`,
          updatedChannels: user.usersChannels,
        });
      });
    });
  };

  // Given a username
  // Looks through Users for the username
  // If it can find a user, it returns all their current userChannels in a json response
  getChannels = function (req, res, next) {
    const username = req.user.username;

    User.findOne({ username }, function (err, user) {
      if (err) {
        res.send({
          error: err,
        });
        return next(err);
      }

      if (!user) {
        return res.status(422).json({
          error: 'Could not find user.',
        });
      }

      res.status(200).json({
        message: 'Here are the users channels',
        usersChannels,
      });
    });
  };
}

module.exports = UserController;
