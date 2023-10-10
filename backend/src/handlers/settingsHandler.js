const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();

module.exports = {
  update: async (req, response) => {
    if (req.user) {
      User.findOne(
        {
          username: req.user.username,
        },
        function (err, doc) {
          if (!doc) {
            response.status(400).json({
              message: "User does not exist.",
            });
          } else {
            bcrypt
              .compare(req.body.currentPassword, doc.password)
              .then((res) => {
                if (res === true) {
                  bcrypt
                    .hash(req.body.newPassword, 10)
                    .then((hash) => {
                      doc.password = hash;
                      doc.save();
                      req.session.destroy(function (err) {
                        if (err) {
                          response.status(401).json({
                            success: false,
                            message: "Error destroying session.",
                          });
                        } else {
                          response.status(200).json({
                            success: true,
                          });
                        }
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      response.status(402).json({
                        message: "Error resetting password.",
                      });
                    });
                } else {
                  response.status(401).json({
                    message: "Invalid password.",
                  });
                }
              });
          }
        }
      )
        .clone()
        .catch((err) => {
          console.log(err);
          response.status(401).json({
            message: "Authentication failed",
          });
        });
    } else {
      response.status(401).json({
        message: "Invalid login session.",
      });
    }
  },
};
