var express=require("express"),
    connection=require("./db/index"),
    passport=require("passport"),
    bodyParser=require("body-parser"),
    LocalStrategy=require("passport-local"),
    flash=require("express-flash"),
    bcrypt=require("bcrypt"),
    methodOverride=require("method-override"),
    app=express();   
const initializePassport=require("./passport-config");
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
app.use(methodOverride('_method'))

passport.serializeUser((user,done)=>done(null,user.id));
passport.deserializeUser((id,done)=>{
    connection.query("select * from user where id = "+ id, function (err, rows){
        done(err, rows[0]);
    });
});


////ROUTES
app.get("/",function(req,res){
    res.render("home");
});
app.get("/secret",checkAuthenticated,function(req,res){
    res.render("secret");
});

///login
app.get("/login",checkNotAuthenticated,function(req,res){
    res.render("login");
});

app.post("/login",checkNotAuthenticated,passport.authenticate('local',{
    successRedirect:'/secret',
    failureRedirect:'/login',
    failureFlash:true
}));

///register
app.get("/register",checkNotAuthenticated,function(req,res){
    res.render("register");
});
app.post("/register",checkNotAuthenticated,async function(req,res){
    try{
        const hashedPassword=await bcrypt.hash(req.body.password,10);
        var sql="INSERT INTO user (username,password) VALUES (?,?)";
        var values=[req.body.username,hashedPassword];
        connection.query(sql,values,function(err,result){
            if(err){
                console.log(err);
            }
        })
        res.redirect("/login");
    }catch{
        res.redirect("/register");
    }
    console.log(users);
});

///log out
app.delete('/logout',function(req,res){
    req.logOut();
    res.redirect('/login');
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return res.redirect('/secret');
    }
    next();
}


app.listen(3000,function(){
    console.log("Server started");
})