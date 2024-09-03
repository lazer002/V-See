const mon = require('mongoose')
// const mongo = mon.connect(process.env.DB)
const mongo = mon.connect('mongodb+srv://ajit_manthan:ajitmanthan@cluster0.fvikk66.mongodb.net/1?retryWrites=true&w=majority&appName=Cluster0')
.then((res)=>{
    console.log('connected');
})
.catch((err)=>{
console.log(err);
})

module.exports = mongo

