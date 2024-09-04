const mon = require('mongoose')
const mongo = mon.connect(process.env.DB)
.then((res)=>{
    console.log('connected');
})
.catch((err)=>{
console.log(err);
})

module.exports = mongo