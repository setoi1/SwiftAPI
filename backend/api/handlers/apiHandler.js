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

const makeAccessor = (s) => {
  return (s.replace(/[\s.]/g, "-") + makeid(6)).toLocaleLowerCase();
};

module.exports = {
  list: async (req, res) => {
    if (req.user) {
      const data = req.body.data;

      if ((await API.findOne({ api_url: data.API_URL })) !== null) {
        res.status(200).json({
          msg: "Cannot list an already listed API.",
          success: true,
        });
        return;
      }

      const product = await stripe.products.create({
        name: data.API_NAME,
        description: data.API_DESCRIPTION,
        url: data.API_URL,
        default_price_data: {
          currency: "USD",
          recurring: {
            interval: "month",
          },
          unit_amount: data.API_PRICING_PLAN,
        },
      });

      const product_id = product.id;

      const api_access_token = makeid(16);
      const api_unique_id = makeAccessor(data.API_NAME);
      if (product_id != null) {
        const api = new API({
          stripe_subscription_id: product_id,
          proxy_accessor: api_unique_id,
          api_url: data.API_URL,
          api_access_token: api_access_token,
          user_id: req.user._id,
          valid: false,
          path: data.API_PATH,
          visible: true,
        });
        api.save().then((response) => {
          res.status(200).json({
            api_unique_id: api_unique_id,
            access_token: api_access_token,
            msg: "API listing has been created successfully.",
            success: true,
          });
        });
      } else {
        res.status(400).json({
          msg: "Error creating Stripe product.",
          success: false,
        });
      }
    } else {
      res.status(400).json({
        msg: "Invalid login session, please log in.",
        success: false,
      });
    }
  },
  retrieveAPIByID: async (req, res) => {
    const subx = await API.findOne({ _id: req.body.ID });
    if (subx !== null) {
      const stripeProduct = await stripe.products.retrieve(
        subx.stripe_subscription_id
      );
      const user = await User.findOne({
        _id: subx.user_id.toString(),
      });
      const priceProduct = await stripe.prices.retrieve(
        stripeProduct.default_price
      );

      var data = {
        title: stripeProduct.name,
        user: user.username,
        description: stripeProduct.description,
        price: parseFloat(priceProduct.unit_amount / 100).toFixed(2),
        stripeProductID: subx.stripe_subscription_id,
        visible: subx.visible,
        path: subx.path,
        proxy_accessor: subx.proxy_accessor,
      };

      res.status(200).json({
        msg: "API Found",
        success: true,
        data: data,
      });
      return;
    }
    res.status(404).json({
      msg: "API does not exist",
      success: false,
    });
  },
  search: async (req, res) => {
    var resData = [];
    const apis = await API.find({ description: req.query.q });
    if (apis !== null) {
      for (const api of apis) {
        const stripeProduct = await stripe.products.retrieve(
          api.stripe_subscription_id
        );

        const user = await User.findOne({
          _id: api.user_id.toString(),
        });
        const priceProduct = await stripe.prices.retrieve(
          stripeProduct.default_price
        );

        var apiData = {
          title: stripeProduct.name,
          user: user.username,
          description: stripeProduct.description,
          price: parseFloat(priceProduct.unit_amount / 100).toFixed(2),
          stripeProductID: api.stripe_subscription_id,
        };
        resData.push(apiData);
      }
      res.status(200).json({
        msg: "APIs found",
        success: true,
        data: resData,
      });
    } else {
      res.status(401).json({
        msg: "No APIs found",
        success: true,
        data: resData,
      });
    }
  },
  changeVisibility: async (req, res) => {
    let message;
    const { api_id, toggleStatus } = req.body.data;
    if (!req.user) res.status(401).json({ message: "must be logged in" });
    const api = await API.findOne({ _id: api_id });
    if (!api) res.status(200).json({ message: "API not found" });
    if (req.user.id == api.user_id) {
      api.visible = toggleStatus;
      api.save().then((t) => 
      message = `API ${api.visible === true ? "showing" : "hidden"}`
      )
    } else {
      message = "You are not the owner"
    }
      res.status(200).json({ message: message, visible: api.visible });
  },
  isOwner: async (req, res) => {
    if (!req.user) res.status(401).json({ message: "must be logged in" });

    const { api_id } = req.body.data;
    const api = await API.findOne({ _id: api_id });

    if (!api) res.status(200).json({ message: "API not found" });
    if (req.user.id == api.user_id) {
      res.status(200).json({ owner: true });
    } else {
      res.status(200).json({ owner: false });
    }
  },
  isSubscribed: async (req, res) => {
    if (!req.user) res.status(401).json({message: "must be logged in"});

    const { api_id } = req.body.data;
    const { id } = req.user;

    const api = await Subscription.findOne({ api_id: api_id, user_id: id });
    console.log(api)
    if (api) res.status(200).json({key: api.api_access_token});
    else {
      res.status(200).json({key: "No key available"});
    }
  }
};
