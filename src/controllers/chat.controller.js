class ChatController {
 
 
  getAllChat = (req, res) => {
  
    try {
      res.render('chat', { title: 'chat', layout: 'chatLayout' });
    } catch (err) {
      res.status(400).send('Status: No se ha renderizar productos');
    }
  };
}
module.exports = ChatController;
