const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const apiSchema = new Schema(
  {
    user_id: {
      type: mongoose.ObjectId,
      required: true,
    },
    stripe_subscription_id: {
      type: String,
      required: true,
    },
    api_url: {
      type: String,
      required: true,
    },
    api_access_token: {
      type: String,
      required: true,
    },
    proxy_accessor: {
      type: String,
      required: true,
    },
    valid: {
      type: Boolean,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const API = mongoose.model("API", apiSchema);

module.exports = API;
