const express = require('express');
const app=express();
const {Pool} = require('pg');
const cors = require('cors');
const pool = new Pool({
    user:"postgres",
    database:"stockEntryApp",
    port:"5432",
    password:"0000",
    host:"localhost"
})
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