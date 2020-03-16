var express=require("express"),
    connection=require("./db/index"),
    passport=require("passport"),
    bodyParser=require("body-parser"),
    LocalStrategy=require("passport-local"),
    flash=require("express-flash"),
    bcrypt=require("bcrypt"),
    app=express();   
const initializePassport=requrie("./passport-config");
initializePassport(
    passport,
    username=>users.find(user=>user.username===username)
); 
////local db
    const users=[]

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.use(require("express-session")({
    secret:"auth using passport",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


////ROUTES
app.get("/",function(req,res){
    res.render("home");
});
app.get("/secret",function(req,res){
    res.render("secret");
});

///login
app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate('local',{
    successRedirect:'secret',
    failureRedirect:'/login',
    failureFlash:true
}));

///register
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",async function(req,res){
    try{
        const hashedPassword=await bcrypt.hash(req.body.password,10);
        users.push({
            id:Date.now().toString(),
            username:req.body.username,
            password:hashedPassword
        })
        res.redirect("/login");
    }catch{
        res.redirect("/register");
    }
    console.log(users);
});


app.listen(3000,function(){
    console.log("Server started");
})