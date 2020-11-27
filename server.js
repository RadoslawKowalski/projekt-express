var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;
var path = require("path")
var bodyParser = require("body-parser");
const { type } = require("os");
const { EDESTADDRREQ } = require("constants");
var users = [
    { id: "1", login: "test1", password: "test1", age: "10", student: "", sex: "male" },
    { id: "2", login: "test2", password: "test2", age: "15", student: "checked", sex: "female" },
    { id: "3", login: "test3", password: "test3", age: "17", student: "checked", sex: "male" },
    { id: "4", login: "test4", password: "test4", age: "11", student: "", sex: "male" },
    { id: "5", login: "test5", password: "test5", age: "20", student: "checked", sex: "female" },
    { id: "6", login: "test6", password: "test6", age: "12", student: "", sex: "female" }
]
var logged = false;
// exports.logged = logged;

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/handleForm", function (req, res) {
    console.log(req.body)
    console.log("adsfads " + users)
    for (let i = 0; i < users.length; i++) {
        if (req.body.login == users[i].login) {
            // console.log("user already exists")
            res.send("This user already exists!")
            break;
        }
    };
    req.body.id = users.length + 1
    users.push(req.body)
})

app.post("/handleForm2", function (req, res) {
    console.log(req.body)
    for (let i = 0; i < users.length; i++) {
        if (req.body.login == users[i].login && req.body.password == users[i].password) {
            logged = true;
            // res.send("Successfully logged in!")
            res.redirect("/admin")
            return;
        }
    }
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"))
})

app.get("/main", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"))
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"))
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"))
})

app.get("/admin", function (req, res) {
    if (logged) {
        res.sendFile(path.join(__dirname + "/static/adminTrue.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/adminFalse.html"))
    }
})

app.get("/logout", function (req, res) {
    logged = false;
    res.send("Logged out")
})

let tF = "<table>"
let tM = "<table>"

for (let i = 0; i < users.length; i++) {
    let row = "<tr>"
    row += "<td>ID: " + users[i].id + "</td><td>Sex: " + users[i].sex + ""
}

app.get("/id", function (req, res) {
    let t = "<table>"
    for (let i = 0; i < users.length; i++) {
        let row = "<tr>"
        row += "<td>ID: " + users[i].id + "</td><td>Login: " + users[i].login + " Password: " + users[i].password + "</td><td>Age: " + users[i].age + "</td><td>Student: " + users[i].student + "</td><td>Sex: " + users[i].sex + "</td>"
        row += "</tr>"
        t += row
    }
    t += "</table>"
    res.send(t)
})

app.get("/sex", function (req, res) {
    let tM = "<table>"
    let tF = "<table>"
    for (let i = 0; i < users.length; i++) {
        let row = "<tr>"
        row += "<td>ID: " + users[i].id + "</td><td>Sex: " + users[i].sex + "</td>"
        row += "</tr>"
        if (users[i].sex == "female") {
            tF += row
        } if (users[i].sex == "male") {
            tM += row
        }
    }
    tM += "</table>"
    tF += "</table>"
    res.send(tF + "<br>" + tM)
})

app.get("/age", function (req, res) {
    let form = "<form onchange=\"this.submit()\" method=\"POST\" action=\"sort\"><input type=\"radio\" value=\"ascending\" name=\"type\"><label>Ascending</label><input type=\"radio\" value=\"descending\" name=\"type\"><label>Descending</label></form>"
    let usersSorted = users;
    usersSorted.sort(function (a, b) {
        return parseFloat(a.age) - parseFloat(b.age)
    })
    let t = "<table>"
    for (let i = 0; i < users.length; i++) {
        let row = "<tr>"
        row += "<td>ID: " + users[i].id + "</td><td>Login: " + users[i].login + " Password: " + users[i].password + "</td><td>Age: " + users[i].age + "</td>"
        row += "</tr>"
        t += row
    }
    t += "</table>"
    res.send(form + "<br>" + t)
})

app.post("/sort", function (req, res) {
    let ascending = "";
    let descending = "";
    let usersSorted = users;
    if (req.body.type == "descending") {
        usersSorted.sort(function (a, b) {
            return parseFloat(b.age) - parseFloat(a.age)
        })
        ascending = "";
        descending = "checked";
    } else {
        usersSorted.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age)
        })
        ascending = "checked";
        descending = "";
    }
    let form = "<form onchange=\"this.submit()\" method=\"POST\" action=\"sort\"><input type=\"radio\" value=\"ascending\" name=\"type\"><label>Ascending</label><input type=\"radio\" value=\"descending\" name=\"type\"><label>Descending</label></form>"
    let t = "<table>"
    for (let i = 0; i < users.length; i++) {
        let row = "<tr>"
        row += "<td>ID: " + users[i].id + "</td><td>Login: " + users[i].login + " Password: " + users[i].password + "</td><td>Age: " + users[i].age + "</td>"
        row += "</tr>"
        t += row
    }
    t += "</table>"
    res.send(form + "<br>" + t)
})

app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

