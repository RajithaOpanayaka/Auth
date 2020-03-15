var express=require("express");
var connection=require("./db/index");
var passport=require("passport"),
    bodyParser=require("body-parser"),
    LocalStrategy=require("passport-local");
var app=express();

app.set('view engine','ejs');
app.use(require("express-session")({
    secret:"auth using passport",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());



app.get("/",function(req,res){
    res.render("home");
});
app.get("/secret",function(req,res){
    res.render("secret");
});


app.listen(3000,function(){
    console.log("Server started");
})