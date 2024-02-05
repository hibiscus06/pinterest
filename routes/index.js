var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts")
const localStrategy = require("passport-local");
const passport = require('passport');
const upload = require('./multer');
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login', {error: req.flash('error')}); //here error is an array
});

router.get('/edit',function(req, res, next) {
  res.render('edit');
});

router.post('/upload', isLoggedIn, upload.single("postImage"), async function(req,res,next){
  if(!req.file){
    return res.status(404).send("no files were given");
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image:req.file.filename,
    title:req.body.title,
    description:req.body.description,
    user:user._id
  });
  
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");  
});

router.post('/fileupload', isLoggedIn, upload.single("image"), async function(req,res,next){
   
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile');
});

router.get('/profile',isLoggedIn, async function(req,res,next){
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  .populate("posts")
  res.render("profile",{user});
})

router.get('/show/posts',isLoggedIn, async function(req,res,next){
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  .populate("posts")
  res.render("show",{user});
})

router.get('/feed',isLoggedIn, async function(req,res,next){
  const user = await userModel.findOne({username:req.session.passport.user})
  const posts = await postModel.find()
  .populate("user")

  res.render("feed",{user, posts});
})

router.get('/newpost', async function(req,res){
  const user = await userModel.findOne({
    username:req.session.passport.user
  });
  
  res.render("newpost",{user});
})

router.post('/register',function(req,res){
  const userData = new userModel({
    username: req.body.username, 
    email: req.body.email,
    fullname: req.body.fullname,
  });

  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })

  })

  router.post('/login',passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login",
    failureFlash:true
  }),function(req,res){
  });
 
  router.get("/logout",function(req,res){
    req.logout(function(err){
      if(err){ return next(err);}
      res.redirect('/login');
    })
  });

  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) {
    return next();
    }
    res.redirect('/');
  }


module.exports = router;




