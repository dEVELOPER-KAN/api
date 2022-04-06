const express = require('express')
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
const dotenv = require('dotenv').config();
const app = express();


passport.use(new BasicStrategy(
    function (username, password, done) {
        if (username == "sbdrdn7en8dndd8sm9==" && password == "dccdecdcdecdecdc") {
            return done(null, "authenticated");
        } else {
            return done(null, false);
        }
    }
));

app.use(passport.initialize());

app.get('/users', passport.authenticate('basic', { session: false }), function (req, res) {
    res.status(200).json({
        "message": "success",
        "data": [
            {
                id: 1,
                name: "test1"
            },
            {
                id: 2,
                name: "test2"
            },
            {
                id: 3,
                name: "test3"
            }
        ]
    })
});

app.listen(process.env.PORT, () => {
    console.log("server started")
})
