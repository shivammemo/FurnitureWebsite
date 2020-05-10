var express=require('express');
var ejs=require('ejs')
var bodyParser=require('body-parser')
var passport = require("passport")
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var mongoose=require('mongoose').set('debug', true);

var app=express()

mongoose.connect("mongodb://localhost/furnicom")
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(require("express-session")({
    secret:"Rusty is the best og in the world",
    resave: false,
    saveUninitialized: false
}));
var furnitureSchema=new mongoose.Schema({
    category:String,
    name:String,
    price:Number,
    description:String,
    image:String
})

var furniture=mongoose.model("Product", furnitureSchema)



app.use(passport.initialize());
app.use(passport.session());
// 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function(req, res)
{
    res.render('home');
})



app.get('/sofas', function(req, res)
{
    furniture.find({"category":"sofa"}, function(err, furn)
    {
        if(err)
        {
            console.log("Error occur")
            console.log(err)
        }
        else{
            res.render('sofas', {products:furn})
        }
    })
    
})

app.get('/tables', function(req, res)
{
    furniture.find({"category":"tables"}, function(err, furn)
    {
        if(err)
        {
            console.log("Error Occur")
            console.log(err)
        }
        else{
            res.render('tables',{products:furn})
        }
    })
})

app.get('/login', function(req,res)
{
    res.render('login')
})

app.get('/signup', function(req, res)
{
    res.render('signup')
})

app.get('/home2', function(req, res)
{
    res.render('home2')
})


app.post("/signup", function (req, res) {
    User.register(new User({ name : req.body.name,username:req.body.username, email: req.body.email}),req.body.password,  function (err, user) {
        if (err) {
            console.log(err);
            return res.render('signup');
        } //user stragety
        passport.authenticate("local")(req, res, function () {
            res.redirect("/home2"); //once the user sign up
        });
    });
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/home2",
    failureRedirect: "/login"
}), function (req, res) {
    res.send("User is " + req.user.id);
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/home2");
}

app.get('/home/:id', function(req, res)
{
    furniture.findById(req.params.id.trim(), function(err, alfur)
    {
        if(err)
        {
            console.log("Error occured")
            console.log(err)
        }
        else{
            res.render('show', {products:alfur})
        }
    })
})

app.get('/home2/:id', function(req, res)
{
    furniture.findById(req.params.id.trim(), function(err, alf)
    {
        if(err)
        {
            console.log("An error occured")
            console.log(err)
        }
        else{
            res.render('checkout',{products:alf})
        }
    })
})
app.listen(3000, function()
{
    console.log("server is running at port 3000")
})

