const API = require("../models/apiSchema");
const Subscription = require("../models/subscriptionSchema");
const User = require("../models/userSchema");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);

function makeid(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const result = Array.from({ length })
    .map(
      (e, i) =>
        characters[Math.floor(Math.random() * characters.length)] +
        (!((i + 1) % 4) ? "-" : "")
    )
    .join("")
    .slice(0, -1);
  return result;
}

module.exports = {
  subscribe: async (req, res) => {
    if (req.user) {
      const stripeProduct = await stripe.products.retrieve(
        req.body.stripeProductID
      );

      const apiID = await API.findOne({
        stripe_subscription_id: req.body.stripeProductID,
      });

      const subscription = await Subscription.findOne({
        api_id: apiID._id,
        username: req.user.username,
      });

      if (subscription === null) {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: stripeProduct.default_price,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `https://swift-api-senior-project.herokuapp.com/success?session_id={CHECKOUT_SESSION_ID}&id=${apiID._id}`,
          cancel_url: `https://swift-api-senior-project.herokuapp.com/`,
        });
        res.status(303).json({ url: session.url });
      } else {
        res
          .status(401)
          .json({ message: "Cannot purchase multiple of the same API." });
      }
    } else {
      res.status(401).json({
        message: "Please login before trying to subscribe to an API.",
      });
    }
  },
  checkSubscription: async (req, res) => {
    if (req.user) {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          req.body.session_id
        );

        const subscription = await Subscription.findOne({
          api_id: req.body.api_id,
          username: req.user.username,
        });

        if (session.payment_status === "paid" && subscription === null) {
          const subscription = new Subscription({
            user_id: req.user._id,
            api_id: req.body.api_id,
            api_access_token: makeid(16),
            stripe_customer_id: session.customer,
          });

          const api = await API.findById(req.body.api_id);

          subscription.save().then((response) => {
            res.status(200).json({
              msg: "API paid successfully.",
              success: true,
              api_access_token: subscription.api_access_token,
              path: api.path,
              api_unique_id: api.proxy_accessor,
            });
          });
        } else {
          if (subscription !== null) {
            res
              .status(401)
              .json({ message: "Cannot purchase multiple of the same API." });
          } else {
            res.status(401).json({ message: "API has not been paid for." });
          }
        }
      } catch (err) {
        res.status(401).json({ message: "No checkout session found." });
      }
    } else {
      res.status(401).json({
        message: "Please login before trying to subscribe to an API.",
      });
    }
  },
};
