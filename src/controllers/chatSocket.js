const {
  MessageDAOFactory,
  UserOnlineFactory,
} = require('../classes/Chat/ChatDAOFactory.class');
const logger = require('../utils/loggers');
const formatMessage = require('../classes/Chat/chatMessage');
const config = require('../utils/config');
const MessageDAO = MessageDAOFactory.get(); //chat
const OnlineUsersDAO = UserOnlineFactory.get(); //user

exports = module.exports = function (io) {
  io.on('connection', (socket) => {
    const user = socket.handshake.session.passport.user;
    const name = user.name.givenName ? user.name.givenName : user.name;

    logger.info(
      'user ' +
        user.email +
        '/' +
        socket.id +
        ' authenticated and is now connected.'
    );


    socket.on('chatMessage', async (data) => {
      if (user.membership == 2) {
        data.toUser = config.EMAIL.CHAT_ADMIN_EMAIL;
      }

      let dataProcess = {
        name: name,
        fromUser: user.email,
        toUser: data.toUser,
        msg: data.msg,
      };
     
      const dataElement = formatMessage(dataProcess);
      await MessageDAO.save(dataElement).catch((err) => logger.error(err));

      socket.emit('messageMine', dataElement);

      await OnlineUsersDAO.findConnectByUser(data.toUser)
        .then((res) => {
        
          if (res != null) {
         
            socket.to(res.socketID).emit('message', dataElement);
          }
        })
        .catch((err) => logger.error(err));
    });

    
    socket.on('userDetails', async (data) => {

      let onlineUser = {
        socketID: socket.id,
        name: name,
        email: user.email,
        membership: user.membership,
      };


      const exist = await OnlineUsersDAO.saveOnlineUser(onlineUser)
        .then(() =>
          logger.warn(
            onlineUser.name + 'socketId ' + socket.id + ' is online...'
          )
        )
        .catch((err) => logger.error(err));

      if (user.membership == 2) {
        data.toUser = config.EMAIL.CHAT_ADMIN_EMAIL;
      } else {
        await OnlineUsersDAO.findUsersConnect()
          .then(
            (res) =>
              (filteredArray = res.filter((item) => {
                return item.email !== config.EMAIL.CHAT_ADMIN_EMAIL;
              }))
          )
          .then((data) => socket.emit('userList', data))
          .catch((err) => logger.error(err));
      }
      let dataNueva = {
        name: name,
        fromUser: user.email,
        toUser: data.toUser,
      };

      await MessageDAO.findCollection(dataNueva)
        .then((res) => socket.emit('output', res))
        .catch((err) => logger.error(err));
    });


    let userID = socket.id;
    socket.on('disconnect', async () => {
      const myquery = { socketId: userID };
      await OnlineUsersDAO.deleteCollection(myquery)
        .then((res) =>
          logger.warn(
            'Usuario ' + name + ' con socket ' + userID + ' offline...'
          )
        )
        .catch((err) => logger.error(err));
    });
  });
};
