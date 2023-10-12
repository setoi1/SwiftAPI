const { default: axios } = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const updateStatus = (interval, key) => {
    setInterval(() => {
    axios.post("http://localhost:5000/api/apistatus/status", {
        data: { session_key: key }
    }).then((res) => {
        if (res.status === 200) console.log("Succssfully persisted API status");
    }).catch((e) => {
        if (e.response.status === 400) {
            console.log("An error has ocurred relaying online status")
        }
    })
}, interval)
};

const initOnSuccess = (sessionKey) => {
    console.log(`Successfully authenticated with SwiftAPI, session key: ${sessionKey}`);
    updateStatus(1000 * 60 * 5, sessionKey);
}

module.exports = {
    authOnStart: () => {
        axios.post("http://localhost:5000/api/apistatus/auth", {
            data: { sw_key: process.env.SWIFT_KEY },
        }).then((res) => {
            if(res.status === 200) initOnSuccess(res.data.session_key);
        }).catch((e) => {
            if (e.response.status === 400) {
                console.log("Could not authenticate with this developer key.")
            }
        })
    }
} 
