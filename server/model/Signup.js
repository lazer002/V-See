const mon = require('mongoose')

let userschema = new mon.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String ,
        required:true
    },
    username:{
        type:String ,
        required:true
    },
    user_role:{
        type:String ,
        required:true,
        default:'false'
    },
    user_id:{
        type:String ,
        required:true,
    },
    Profile:{
        type:String,
        
    }
})

let User = mon.model('User',userschema)

module.exports = User