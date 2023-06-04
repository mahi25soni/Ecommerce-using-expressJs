const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const router = require("./router/eComRouter")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser');

const app = express()


app.use(bodyParser.urlencoded  ( {extended:false} ) )
app.use(bodyParser.json());
app.use(express.static("assets"))
app.set('view engine', 'ejs');
app.use(cookieParser());



mongoose.set("strictQuery" , false)
mongoose.connect("mongodb+srv://ankit:khan12345@cluster0.qfttxvo.mongodb.net/Ecommerce", 
{useNewUrlParser: true})
.then(()=>console.log('connected'))
.catch(e=>console.log(e));

app.listen(3000, function(){
    console.log("localhost is running")
})


app.use("/" , router)