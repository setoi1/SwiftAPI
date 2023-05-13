const express = require("express");
const swift = require("./swiftAuth.js");
const dotenv = require("dotenv");
const app = express()
const port = 3000

dotenv.config()
swift.authOnStart();

app.get('/api/number/:num', (req, res) => {
    console.log("request received");
    const num = req.params.num;
    if (parseInt(num, 10)) res.status(200).json({status: true, number: num})
    else {
        res.status(401).json({message: "invalid number", status: false})
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})