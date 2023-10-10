module.exports = {
  validate: async (req, res) => {
    try {
      if (req.user) {
        res.status(200).json({
          msg: "Session is valid",
          valid: true,
          cookies: req.headers.cookie,
          userDetails: req.user,
        });
        return req.user;
      } else {
        res.status(200).json({
          msg: "Session is invalid, please login.",
          valid: false,
        });
      }
    } catch (err) {
      res.status(401).json({
        message: "An error has occurred",
        error: err.message,
      });
    }
  },
};
