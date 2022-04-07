const express = require('express')
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
const dotenv = require('dotenv').config();
const app = express();
const fs = require('fs').promises;

app.use(express.json())
passport.use(new BasicStrategy(
    function (username, password, done) {
        if (username == "sbdrdn7en8dndd8sm9==" && password == "dccdecdcdecdecdc") {
            return done(null, "authenticated");
        } else {
            return done(null, false);
        }
    }
));
//o
app.use(passport.initialize());

app.get('/users', passport.authenticate('basic', { session: false }), async function (req, res) {
    const data = await fs.readFile('./users.json', "utf8");
    const response = await JSON.parse(data);
    res.status(201).json({
        "status": "success",
        "data": response
    })
})

app.get('/users/:id', passport.authenticate('basic', { session: false }), async function (req, res) {
    const data = await fs.readFile('./users.json', "utf8");
    let response = await JSON.parse(data);
    response = response.filter(el => {
        return el.id == req.params.id
    })
    if (req.params.id.length > 1) {
        res.status(404).json({
            "status": "failure",
            "message": "User ID is not valid"
        })
    } else {
        res.status(201).json({
            "status": "success",
            "data": response
        })
    }
})

app.post('/users', passport.authenticate('basic', { session: false }), async function (req, res) {
    const response = req.body;
    if (Object.keys(req.body).length == 0) {
        res.status(404).json({
            "status": "failure",
            "message": "Invalid Insert"
        })
    } else {
        const data = await fs.readFile('./users.json', "utf8");
        let result = await JSON.parse(data);
        result.push(response)
        await fs.writeFile('./users.json', JSON.stringify(result));
        res.status(201).json({
            "status": "success",
            "data": req.body
        })
    }

});

app.patch('/users/:id', passport.authenticate('basic', { session: false }), async function (req, res) {
    const data = await fs.readFile('./users.json', "utf8");
    let response = await JSON.parse(data);
    response = response.filter(el => {
        return el.id == req.params.id
    })
    let result = {};
    result.name = response[0].name || req.body.name,
        result.city = response[0].city || req.body.city,
        await fs.writeFile('./users.json', JSON.stringify(result));

    res.status(202).json({
        "status": "success",
        "data": result
    })
});

app.delete('/users/:id', passport.authenticate('basic', { session: false }), async function (req, res) {
    const data = await fs.readFile('./users.json', "utf8");
    let response = await JSON.parse(data);
    response.forEach(el => {
        if (el.id == req.params.id)
            response.pop()
    });

    await fs.writeFile('./users.json', JSON.stringify(response));

    res.status(202).json({
        "message": "success",
        "data": "User deleted"
    })
});

app.all('*', (req, res) => {
    res.send("Specified Route Not available")
})

app.listen(process.env.PORT, () => {
    console.log("server started")
})
