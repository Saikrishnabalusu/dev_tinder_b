// console.log("hello world!!")

const express = require("express")

const app = express();

app.use("/",(req,res)=>{
    res.send("Hi home from the server!!")
})


app.use("/kittu",(req,res)=>{
    res.send("Hi kittu from the server!!")
})

app.use("/test",(req,res)=>{
    res.send("Hi test nodemon from the server!!")
})




app.listen(7777, ()=>{
    console.log("app listening successfully on port 7777...");
})