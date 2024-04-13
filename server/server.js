const express=require('express');
const cors=require('cors')
const mongoose =require('mongoose');
const userModel=require('./models/users.js');
const app=express();

mongoose.connect("mongodb+srv://anasmobeidat86:anas2002@cluster0.2vx4res.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("connected successfully")
}).catch((error)=>{
    console.log("error with connecting with DB",error)
})
app.use(cors())
app.use(express.json())

app.get('/users',async(req,res)=>{
    const users= await userModel.find();
    res.json(users)
})
app.post('/createUser',async(req,res)=>{
    
    const newUser= new userModel(req.body);
    await newUser.save();
    res.json(req.body)


})

app.listen(5000,()=>{
    console.log('server is listen on port 5000....');
})