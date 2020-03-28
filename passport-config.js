const LocalStrategy=require("passport-local").Strategy;
const bcrypt=require("bcrypt");
var connection=require("./db/index");

function initialize(passport){
    var user=null;
    const authenticateUser=async (username,password,done) =>{
        
        connection.query("select * from user where username = ?", [username], function (err, rows){
                    if(err){
                        return err;
                    }
                    user=rows[0];//await getUserByUsername(username);////add await
                    if(user==null){
                        return done(null,false,{message:'no user with that username'})
                    }
                });

                if(user!=null){
                    try{
                       // console.log(user.username);
                        if(bcrypt.compare(password,user.password)){
                            return done(null,user)
                        }else{
                            return done(null,false,{message:'Password incorrect'})
                        }
                    }catch(e){
                        return done(e)
                    }
                }
               
          
                   
                
    }
    passport.use(new LocalStrategy(authenticateUser))
    
}

module.exports=initialize;