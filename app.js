//npm install --save express pentru a instala express
//npm install -g nodemon
//npm install express-handlebars --save
//npm install --save mongoose
//npm install --save body-parser

const express = require('express'); // am instalat modulul express si trebuie sa folosim require 
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');


const app = express();

//LOAD ROUTES

const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport confing

require('./config/passport')(passport);


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://0.0.0.0:27017/licenta-dev')
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));


//HANDLEBARS Middleware

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//body parser

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

//Static folder

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

//express session 

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables

app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//INDEX ROUTE

app.get('/', (req, res) => {
    res.render('index'); 
});

//ABOUT ROUTE

// app.get('/about', (req, res) =>{
//     res.render('about');    
// });




//Use Routes

app.use('/ideas', ideas);
app.use('/users', users);

// fetch('https://traineeship-koa-server.onrender.com/movies')
//     .then((res) => {
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//       let output='';
//       data.forEach((user) => {
//        output += `<div class="card">
//        <img src="${user.Images[1]}" class="images">
//        <h1 class="title"><a href='Details.html?id=${user.imdbID}'>${user.Title}</a></h1>
//        <p class="genre text-medium">${user.Genre}</p>
//        <div class="first-section">
//        <p class="year text-medium"><span class='icon'><i class="fa-solid fa-calendar"></i></span>${user.Year}</p>
//        <p class="runtime text-medium"><span class='icon'><i class="fa-solid fa-clock"></i></span>${user.Runtime}</p>
//        </div>
//        <p class="director text-medium">${user.Director}</p>
//       </div>`;  
//       });
//       document.getElementById('cards').innerHTML = output;
//     })
//     .catch((err) => {
//       console.log(err);
//     });  


const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
