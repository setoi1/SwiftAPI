const passport = require("passport");
const API = require("../models/apiSchema");
const Subscription = require("../models/subscriptionSchema");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);

module.exports = {
  register: async (req, res, next) => {
    console.log(req.body)
    const { username, password, firstName, lastName, email, developer } = req.body;

    const emailFilter = { email: email };
    const usernameFilter = { username: username };
    
    try {
      // Check for existing email
      const checkEmail = await User.findOne(emailFilter);
      if (checkEmail) {
        res.status(401).json({
          message: "Email is already taken",
          success: false,
        });
      }

      // Check for existing username
      const checkUsername = await User.findOne(usernameFilter);
      if (checkUsername) {
        res.status(401).json({
          message: "Username is already taken",
          success: false,
        });
      }

      // Password encryption and storing in Mongo
      const saltRounds = 10;

      bcrypt.hash(password, saltRounds, (e, hash) => {
        const newUser = new User({
          username: username,
          password: hash,
          email: email,
          developer: developer,
        });
        newUser.save()
        /*
          .then((res) => {
            console.log('save!')
            res.status(200).json({
              message: "User has been successfully created.",
              success: true,
              newUser,
            });
          });
        */
      });
    } catch (e) {
      res.status(401).json({
        message: "Failed to create user",
        error: e.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      passport.authenticate("local", (e, user) => {
        if (e) {
          res.status(401).json({ message: e, valid: false });
        }
        if (user) {
          req.login(user, (e) => {
            if (e) res.status(401).json({ message: e, valid: false });
            req.session.user = {
              uuid: '1234-5678'
            }
            req.session.save(e => {
              if (e) {
                console.error(e);
              } else {
                res.send(req.session.user);
              }
            })
            res.status(200).json({
              message: "Successfully logged in.",
              valid: true,
            });
          });
        }
        else {
          res.status(401).json({
            message: "Please check email and password and try again.",
            valid: false,
          });
        }
      });
    } catch (e) {
        res.status(401).json({
          message: "An error has occurred",
          error: e.message,
        });
    }
  },

  logout: async (req, res) => {
    try {
      req.logout((e) => {
        if (e) res.status(401).json({ message: e, valid: false });;
        req.session.destroy();
        res.redirect('/');
        res.status(200).json({
          message: "Successfully logged out.",
          valid: true,
        });
      });
    } catch (e) {
      res.status(401).json({
        message: "An error has occurred",
        error: e.message,
      });
    }
  },

  dashboard: async (req, res) => {
    if (req.user) {
      const subx = await Subscription.find({ username: req.user.username });
      var data = [];
      for (const sub of subx) {
        const api = await API.findOne({ _id: sub.api_id });

        const stripeProduct = await stripe.products.retrieve(
          api.stripe_subscription_id
        );

        const priceObj = await stripe.prices.retrieve(
          stripeProduct.default_price
        );

        var sub_data = {
          api_access_token: sub.api_access_token,
          api_id: api._id,
          api_name: stripeProduct.name,
          api_description: stripeProduct.description,
          api_url: api.api_url,
          api_charge: priceObj.unit_amount,
          api_recurring: priceObj.recurring.interval,
          path: api.path,
          api_unique_id: api.proxy_accessor,
        };
        data.push(sub_data);
      }
      res
        .status(200)
        .json({ data: data, message: "Data retrieved successfully." });
    } else {
      res.status(401).json({
        message: "Please login before trying to access this.",
      });
    }
  },
  developerDashboard: async (req, res) => {
    if (req.user) {
      const api = await API.find({ user_id: req.user._id });

      var data = [];
      for (const a of api) {
        const stripeProduct = await stripe.products.retrieve(
          a.stripe_subscription_id
        );

        const priceObj = await stripe.prices.retrieve(
          stripeProduct.default_price
        );

        var sub_data = {
          api_access_token: a.api_access_token,
          api_id: a._id,
          api_name: stripeProduct.name,
          api_description: stripeProduct.description,
          api_url: a.api_url,
          api_charge: priceObj.unit_amount,
          api_recurring: priceObj.recurring.interval,
          path: a.path,
          api_unique_id: a.proxy_accessor,
        };
        data.push(sub_data);
      }
      res
        .status(200)
        .json({ data: data, message: "Data retrieved successfully." });
    } else {
      res.status(401).json({
        message: "Please login before trying to access this.",
      });
    }
  },
  marketplace: async (req, res) => {
    var data = [];
    for (const api of await API.find({ valid: true })) {
      const stripeProduct = await stripe.products.retrieve(
        api.stripe_subscription_id
      );

      const priceObj = await stripe.prices.retrieve(
        stripeProduct.default_price
      );

      var api_data = {
        api_id: api._id,
        api_name: stripeProduct.name,
        api_description: stripeProduct.description,
        api_url: api.api_url,
        api_charge: priceObj.unit_amount,
        api_recurring: priceObj.recurring.interval,
        path: api.path,
        api_unique_id: api.proxy_accessor,
      };
      data.push(api_data);
    }
    res
      .status(200)
      .json({ data: data, message: "Data retrieved successfully." });
  },
};
