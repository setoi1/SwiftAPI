const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema(
  {
    user_id: {
      type: mongoose.ObjectId,
      required: true,
    },
    api_id: {
      type: mongoose.ObjectId,
      required: true,
    },
    api_access_token: {
      type: String,
      required: true,
    },
    stripe_customer_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
