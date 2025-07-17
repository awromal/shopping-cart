var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const { response } = require('../app');

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login');
  }
}



router.get('/', async function(req, res, next) {
    let user = req.session.user;
    console.log(user);
    let cartCount = 0;
    if (user && user._id) {
        cartCount = await userHelpers.getCartCount(user._id);
    }
    productHelpers.getAllProducts().then((products) => {
        res.render('user/view-products', { products, user, cartCount });
    });
  
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
      res.render('user/login',{"loginErr":req.session.loginErr})
      req.session.loginErr=false;
  }
  })

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup', (req, res) => {
  console.log('Signup POST data:', req.body); // Add this
  userHelpers.doSignup(req.body).then((response)=>{
  
  console.log(response)

  req.session.loggedIn=true
  req.session.user= response
  res.redirect('/')

}).catch((err) => {
    console.log('Signup error:', err.message);
    res.status(400).send(err.message); // for debugging
  });
});
router.post('/login', (req,res) => {
    console.log(req.body)
    userHelpers.doLogin(req.body).then((response) =>{

     console.log(response)

    if (response.status) {
      
      req.session.user = response.user;
      req.session.loggedIn = true;
      
      res.redirect('/'); 
    } else {
      req.session.loginErr="Invalid username and password";
      res.redirect('/login')
  }}).catch((err) => {
    console.error("Login error:", err);
    res.status(500).send("Internal Server Error");
  });

});

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin,async(req,res)=>{
    let products=await userHelpers.getCartProducts(req.session.user._id)
    console.log(products)
   res.render('user/cart',{products,user:req.session.user})
})


router.get('/add-to-cart/:id',(req, res) => {
    console.log('Add to cart called for product:',req.params.id);
    userHelpers.addToCart(req.params.id, req.session.user._id).then(()=>{
     res.redirect('/');
    })
});

  


module.exports = router;
