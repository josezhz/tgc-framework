const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

let app = express();

app.set("view engine", "hbs");

app.use(express.static("public"));

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

app.use(
    express.urlencoded({
        extended: false
    })
);

async function main() {
    app.get('/', function (req, res) {
        res.send("Hello");
    });
}
main();

app.listen(3000, () => {
    console.log("Server started");
});