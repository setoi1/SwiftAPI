module.exports = {
  test: async (req, res) => {
    res.status(200).json({
      msg: "Success",
      status: true,
      msg_sent_successfully: true,
      msg_received_successfully: req.body?.msg_received_successfully
        ? "yup"
        : "nope",
    });
  },
};
