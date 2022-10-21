const bcrypt = require('bcrypt'),
  APICustom = require('../classes/Error/customError'),
  sendEmail = require('../notificaciones/emails/Registration/newUser'),
  UserFactory = require('../classes/User/UserFactory.class'),
  jwt = require('jsonwebtoken'),
  config = require('../utils/config'),
  passwordChange = require('../notificaciones/emails/Login/passwordChange'),
  sendNewPasswordEmail = require('../notificaciones/emails/Login/forgotPassword');
class UserController {
  constructor() {
    this.userDAO = UserFactory.get();
    this.message = new APICustom();
  }
  renderProfile = async (req, res) => {
    await this.userDAO
      .mostrarEmail(req.params.id)
      .then((result) => {
        res.status(200).json({ data: result });
      })
      .catch((error) => {
        this.message.errorInternalServer(error, 'error al obtener perfil');
      });
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
  register = async (req, res) => {
    const email = req.body.email,
      password = req.body.password;
    try {
      const user = await this.userDAO.mostrarEmail(email);
      const avatar = req.file ? req.file.filename : null;
      if (user) {
      res.status(400).json({ message: 'The Email is already Taken' });
      
      } else {
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
          avatar: avatar,
          membershipID: 2, //no admin por defecto
        };

        await this.userDAO.guardar(newUserRegister);
        sendEmail(newUserRegister);

        const token = jwt.sign(
          {
            name: user.email,
            membershipID: user.membershipID,
          },
          config.JWT.SECRET
        );
        return res.cookie({ access_token: token }).json({
          success: true,
          message: 'LoggedIn Successfully',
          token: token,
        });
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
  getUsers = async (req, res) => {
    const docs = await this.userDAO.mostrarTodos();
    return res.status(200).json({ users: docs });
  };
  editProfile = async (req, res) => {
    const id = req.params.id;
    let datos = req.body;

    try {
      if (datos.password) {
        let newPassword = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(5),
          null
        );

        datos = { password: newPassword };
      }
      const newUser = await this.userDAO.actualizarPorEmail(id, datos);

      res.status(200).json({ Perfil_actualizado: newUser });
    } catch (error) {
      const mensaje = 'Error al editar el perfil';
      this.message.errorInternalServer(error, mensaje);
    }
  };

  forgot = async (req, res) => {
    let user = await this.userDAO.mostrarEmail(req.body.email);

    if (!user) {
      res.status(422).json({
        errors: [{ title: 'Invalid email!', detail: 'User does not exist' }],
      });
    } else {
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        config.JWT.SECRET,
        { expiresIn: '7d' }
      );

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
      res.status(200).json({
        errors: [
          {
            title: 'Correo Enviado',
            detail: 'Se ha enviado el correo para restablecer',
          },
        ],
      });

      await this.userDAO.actualizarPorEmail(user.email, user);
      sendNewPasswordEmail(token);
    }
  };

  checkToken = async (req, res) => {
    let user = await this.userDAO.buscarCondicionBody({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(422).send({
        errors: [
          {
            title: 'El token se ha vencido o no existe.',
            detail: ' Restaure la contraseña nuevamente',
          },
        ],
      });
    } else {
      return res.status(200).send({ token: req.params.token });
    }
  };

  updatePassword = async (req, res) => {
    let user = await this.userDAO.buscarCondicionBody({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      `enter code here`;
      return res.status(400).send({
        errors: [
          {
            title: 'error',
            detail: 'Password reset token is invalid or has expired',
          },
        ],
      });
    }
    if (req.body.password === req.body.confirm) {
      let newPassword = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(5),
        null
      );
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await this.userDAO.guardar(user);
      passwordChange(user.email);
    } else {
      return res.status(400).send({
        errors: [{ title: 'error', detail: 'Password do not match' }],
      });
    }
  };

  deleteUser = async (req, res) => {
    try {
      await this.userDAO.eliminar('email', req.params.id);
      res.status(200).json('Elemento eliminado');
    } catch (error) {
      const mensaje = 'Error al borrar usuario';
      this.message.errorInternalServer(error, mensaje);
    }
  };

  login = async (req, res) => {
    const email = req.body.email,
      password = req.body.password;
    try {
      const user = await this.userDAO.mostrarEmail(email);

      if (!user) {
        return res
          .status(400)
          .send({ message: 'No existe el correo registrado' });
      } else {
        bcrypt.compare(password, user.password, function (err, result) {
          if (result == true) {
            const token = jwt.sign(
              {
                name: user.email,
                membershipID: user.membershipID,
              },
              config.JWT.SECRET
            );
            return res
              .cookie({ access_token: token })
              .json({
                success: true,
                message: 'LoggedIn Successfully',
                token: token,
              });
          } else {
            return res.status(400).send({ message: 'Contraseña incorrecta' });
          }
        });
      }
    } catch (error) {
      const mensaje = 'Error al iniciar sesion';
      this.message.errorInternalServer(error, mensaje);
    }
  };
}

module.exports = UserController;
