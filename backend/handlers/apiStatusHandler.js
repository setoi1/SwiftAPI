const { v4: uuidv4 } = require("uuid");
const API = require("../models/apiSchema");
const pingFrequency = 5; //minutes
const getNextReqPingTimestamp = (n) => {
  return n + 60000 * pingFrequency;
};

let soon2BRedis = {};
let sessionTokens = {};

module.exports = {
  status: async (req, res) => {
    const { session_key } = req.body.data;
    if (session_key in sessionTokens) {
      curr = Date.now();
      const nextPing = getNextReqPingTimestamp(curr);
      soon2BRedis[sessionTokens[session_key]] = Date.now();
      console.log(`key validated: ${session_key}`);
      res.status(200).json({ status: "success", nextRequiredPing: nextPing });
    } else {
      //behavior for this should be
      // check key against existing dev api validation keys
      // if found, add to soon2B and return 200
      // if not found, return 400 not valid
      res
        .status(400)
        .json({ status: "failure, api not valid", data: session_key });
    }
  },

  //authenticate user api with key under their account
  auth: async (req, res) => {
    const { api_access_token } = req.headers;
    const api = await API.findOne({ api_access_token: api_access_token });

    if (api !== [] || api !== null) {
      if (api.valid) {
        res.status(401).json({
          msg: "API already authenticated",
        });
        return;
      }
      api.valid = true;
      api.save().then((result) => {
        res.status(200).json({ msg: "Successfully authenticated" });
      });
    } else {
      res
        .status(400)
        .json({ msg: "Error authenticating, API accses tokenis invalid" });
    }
  },
};
