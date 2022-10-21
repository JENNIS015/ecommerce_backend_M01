const UserFactory = require('../classes/User/UserFactory.class'),
  sendEmail = require('../notificaciones/emails/Registration/newUser');

authUser = async (request, accessToken, refreshToken, profile, cb) => {
  const exist = await UserFactory.get().mostrarEmail(profile.emails[0].value);
  if (exist) {
    cb(null, profile);
  } else {
    const newUserRegister = {
      email: profile.emails[0].value,
      name: profile.name.givenName,
      lastName: profile.name.familyName,
      membershipID: 2,
      avatar: profile.photos[0].value,
      ref: 'Red',
    };

    await UserFactory.get().guardar(newUserRegister);
    cb(null, newUserRegister, sendEmail(newUserRegister));
  }
};
