const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const db = require('./config/connection')
const session = require('express-session')


// Router imports
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

const app = express();



// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('views', './views');
app.set('view engine', 'hbs');

app.engine('hbs', hbs.engine({
  extname: '.hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views', 'layout'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({
  secret: 'yourSecretKey', 
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } 
}));


db.connect((err) =>{
if(!err){
   console.log("Database Connected");
}else{
   console.log("Database is not connected");
}
});

app.use('/', userRouter);
app.use('/admin', adminRouter)



app.use((req, res, next) => {
  next(createError(404));
});




app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
  });
});





module.exports = app;