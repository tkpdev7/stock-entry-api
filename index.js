const express = require('express');
const app=express();
const {Pool} = require('pg');
const cors = require('cors');
// const pool = new Pool({
//     user:"postgres",
//     database:"stockEntryApp",
//     port:"5432",
//     password:"0000",
//     host:"localhost"
// })
// postgresql://formdb_user:Z41tIEVZzG10HXlHuGksYtzYSIsgHWyl@dpg-d167qp6uk2gs739k8jd0-a.oregon-postgres.render.com/formdb_5hyl
// const pool = new Pool({
//     user:"formdb_user",
//     database:"formdb_5hyl",
//     port:"5432",
//     password:"Z41tIEVZzG10HXlHuGksYtzYSIsgHWyl",
//     host:"d167qp6uk2gs739k8jd0-a.oregon-postgres.render.com",
//     ssl:true
// })
const connectionString = 'postgresql://formdb_user:Z41tIEVZzG10HXlHuGksYtzYSIsgHWyl@dpg-d167qp6uk2gs739k8jd0-a.oregon-postgres.render.com/formdb_5hyl?ssl=true';
const pool = new Pool({connectionString});
module.exports = pool;

const stockEntry = require('./routes/stock-entry')
const grindingIndicatorsRouter = require('./routes/grindingIndicators')
const packagingEntriesRouter = require('./routes/packagingEntries')
const productionMetrics = require('./routes/productionMetrics')
pool.query('SELECT * FROM products',(err,result)=>{
    if(err){
        console.error("sf");
    }else{
        console.log('Q',result.rows)
    }
})

app.get("/",(req,res)=>{
    throw new Error("Some wronf")
})
app.use((err,req,res,next)=>{
    res.status(500).send("Huuu");
});

app.listen(8080,()=>(console.log("Hi")))
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/stock',stockEntry)
app.use('/grinding-indicators', grindingIndicatorsRouter);
app.use('/packaging-entries', packagingEntriesRouter);
app.use('/production-metrics',productionMetrics)