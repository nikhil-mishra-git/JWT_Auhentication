const express = require('express');
const app = express();
const userRoute = require('./routes/user.routes');
const database = require('./db');


// Body Parser
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// App Common Route
app.get('/',(req,res)=>{
    res.send('Hola Brooo');
})

// Use Router
app.use('/user',userRoute);

app.listen(4800,()=>{console.log("Server Running on PORT : 4800");
})