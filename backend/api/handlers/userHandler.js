const passport = require("passport");
const API = require("../models/apiSchema");
const Subscription = require("../models/subscriptionSchema");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);

module.exports = {
  register: async (req, res) => {
    const { username, password, firstName, lastName, email, developer } =
      req.body;

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
      bcrypt.hash(password, saltRounds, (err, hash) => {
        const newUser = new User({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName,
          email: email,
          developer: developer,
        });
        newUser.save().then((response) => {
          res.status(200).json({
            message: "User has been successfully created.",
            success: true,
            newUser,
          });
        });
      });
    } catch (err) {
      res.status(401).json({
        message: "Failed to create user",
        error: err.message,
      });
    }
  },

  login: async (req, res, next) => {
    try {
      passport.authenticate("local", (err, user) => {
        if (err) res.status(401).json({ message: err, valid: false });
        if (!user)
          res.status(401).json({
            message: "Please check email and password and try again.",
            valid: false,
          });
        else {
          req.login(user, (err) => {
            if (err) res.status(401).json({ message: err, valid: false });
            res.status(200).json({
              message: "Successfully logged in.",
              valid: true,
            });
          });
        }
      })(req, res, next);
    } catch (err) {
      res.status(401).json({
        message: "An error has occurred",
        error: err.message,
      });
    }
  },

  logout: async (req, res, next) => {
    try {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({
          message: "Successfully logged out.",
          valid: true,
        });
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: "An error has occurred",
        error: err.message,
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
