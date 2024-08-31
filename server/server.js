const express =  require('express')
const app = express()
 const cors = require('cors')
require('dotenv').config()
app.use(cors({origin:'http://localhost:5173',credentials:true})) 
 const bodyparser = require('body-parser')
 const router = require('./router/router')
 require('./db/connection.js')
 app.use(express.json())
 require('./auth/gauth.js')

 app.use(bodyparser.urlencoded({extended:true}))
app.use('/uploads',express.static('uploads'))



 app.use('/',router)
 app.listen(9999,()=>{
    console.log('9999');
 })