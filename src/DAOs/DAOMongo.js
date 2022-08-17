const ServiceDAOMongoDB = require('../services/serviceDAO.MongoDB');
const ServiceDAOChatMongoDB = require('../services/serviceDAOChat.MongoDB'),
  ProductModel = require('../models/products.model.mongo'),
  CartModel = require('../models/cart.model.mongo'),
  OrderModel = require('../models/order.model.mongo'),
  UserModel = require('../models/user.model.mongo'),
  {
    ConversationModel,
    ChannelModel,
    MessageModel,
  } = require('../models/chat.model.mongo');

class ProductosDAOMongoDB extends ServiceDAOMongoDB {
  constructor() {
    super(ProductModel);
  }
}

class CartDAOMongoDB extends ServiceDAOMongoDB {
  constructor() {
    super(CartModel);
  }
}

class OrderDAOMongoDB extends ServiceDAOMongoDB {
  constructor() {
    super(OrderModel);
  }
}

class UserDAOMongoDB extends ServiceDAOMongoDB {
  constructor() {
    super(UserModel);
  }
}

class ConversationsDAOMongoDB extends ServiceDAOChatMongoDB {
  constructor() {
    super(ConversationModel);
  }
}
class ChannelDAOMongoDB extends ServiceDAOChatMongoDB {
  constructor() {
    super(ChannelModel);
  }
}
class MessageDAOMongoDB extends ServiceDAOChatMongoDB {
  constructor() {
    super(MessageModel);
  }
}

module.exports = {
  ProductosDAOMongoDB,
  CartDAOMongoDB,
  OrderDAOMongoDB,
  UserDAOMongoDB,
  ConversationsDAOMongoDB,
  ChannelDAOMongoDB,
  MessageDAOMongoDB,
};
