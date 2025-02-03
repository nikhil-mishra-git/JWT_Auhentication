const express = require('express');
const app = express();
const userRoute = require('./routes/user.routes');
const database = require('./db');
const path = require('path')


// Body Parser
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Setup EJS
app.set('view engine','ejs');

// Static file
app.use(express.static(path.join(__dirname,'public')));

// App Common Route
app.get('/',(req,res)=>{
    res.render('index');
})

// Use Router
app.use('/user',userRoute);

app.listen(4800,()=>{console.log("Server Running on PORT : 4800");
})