const express = require('express');
const router = express.Router();
const knex = require('../client');
const cookieParser = require('cookie-parser');
const maxAge = 1000 * 60 * 60 * 24 * 7;
router.use(cookieParser());

router.get('/', (req, res) => {
    knex("clucks")
        .select("*")
        .orderBy("created_at", "desc")
        .then((data) => {
            data.forEach(element => {
                element.creatTime = returnTime(element.created_at);
            });
            res.render("clucks/index", {
                username: req.cookies.username,
                clucks: data,
            });
        });
});

router.get('/login', (req, res) => {
    res.render("clucks/login", {
        username: req.cookies.username
    });
});

router.post('/login', (req, res) => {
    res.cookie("username", req.body.username, {
        maxAge: new Date(maxAge)
    });
    res.redirect("/clucks");
});

router.post("/sign_out", (req, res) => {
    res.clearCookie("username");
    res.redirect('/clucks');
});

router.get('/new_cluck', (req, res) => {
    if (req.cookies.username) {
        res.render("clucks/new_cluck", {
            username: req.cookies.username
        });
    } else {
        res.render("clucks/login", {
            username: req.cookies.username
        });
    }
});

router.post('/new_cluck', (req, res) => {
    const cluckParmas = {
        content: req.body.content,
        image_url: req.body.image_url,
        username: req.cookies.username
    };
    knex("clucks").insert(cluckParmas).then(data => {
        res.redirect(`/clucks`);
    })
});

function returnTime(date) {
    const now = new Date();
    date = new Date(date);
    const ms = now.getTime() - date.getTime();
    let result = "";
    let checkMs = 0;
    if (ms < 60000) {
        result = "Just now"
    } else if (ms < 3600000) {
        checkMs = Math.floor(ms / 1000 / 60);
        if (checkMs > 1) {
            result = checkMs + " minutes ago";
        } else {
            result = "1 minute ago";
        }
    } else if (ms >= 3600000) {
        checkMs = Math.floor(ms / 1000 / 60 / 60);
        if (checkMs > 1) {
            result = checkMs + " hours ago";
        } else {
            result = "1 hour ago";
        }
    } else if (ms >= 86400000) {
        checkMs = Math.floor(ms / 1000 / 60 / 60 / 24);
        if (checkMs > 1) {
            result = checkMs + " days ago";
        } else {
            result = "1 day ago";
        }
    } else {
        result = "too long ago";
    }
    return result;
}

module.exports = router;