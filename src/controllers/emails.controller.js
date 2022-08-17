class EmailController {
  postEmail = (req, res) => {
    res.render(`${req.params.template}`, {
      data: req.body,
    });
  };
}



module.exports = EmailController;
