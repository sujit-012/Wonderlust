const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const { name } = require("ejs");
const flash = require("connect-flash")
const path = require("path")
//const cookieParser = require("cookie-parser")

// app.use(cookieParser("secretcode"));

// app.get("/getsingnedcookie", (req , res) => {
//     res.cookie("made-in" , "india" , {signed: true});
//     res.send("signed cookie is sent")
// })

// app.get("/verify", (req , res) => {
//     console.log(req.signedCookies)
//     res.send("verified")
// })

// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("Hi, I am root")
// })

// app.get("/greet", (req , res) =>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`);
// })

// app.get("/getcookiies", (req,res) => {
//     res.cookie("greet", "namaste")
//     res.cookie("madeIn", "India")
//     res.send("sent you some cookies!!")
// })

// app.use("/users", users);
// app.use("/posts", posts);

// app.get("/reqcount", (req , res) => {
//     if (req.session.count) {
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }

//     res.send(`you sent a request ${req.session.count} times`)
//}) 

const ssessionOption = {
    secret: "mysupersecretstring", 
    resave: false , 
    saveUninitialized: true
}

app.use(session(ssessionOption))
app.use(flash())
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use((req , res , next) => {
    res.locals.sucessMsg =  req.flash("sucess");
    res.locals.errorMsg =  req.flash("error");
    next();
})

app.get("/register" , (req,res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "user  is not register")
    }else{
        req.flash("sucess", "user register sucessfully")
    }
    res.redirect("/hello")
})

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name})
})

app.get("/test", (req, res) => {
    res.send("test sucessful !!")
})

app.listen(3000, () => {
    console.log("server is listening to 3000");
})