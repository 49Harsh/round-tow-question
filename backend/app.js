const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors')




const app = express();
app.use(express.json());
app.use(cors());


// db connect

mongoose.connect('mongodb://localhost:27017/dumyProj')
.then(() =>console.log('connect to mongodb'))
.catch(err => console.error('mongodb connection error'))

// User model
const UserSchema = new mongoose.Schema({
    email:{
        type:String, 
        required:true,
        unique:true
    },
    password:{
        type:String, 
        required:true,

    },
})

const User = mongoose.model('User', UserSchema);

// sign up route

app.post('/api/signup', async (req, res) =>{
    try{
        const {email, password} = req.body;
        
       if(!email || !password){
        return res.status(400).json({error:"email"})
       }
        
        const user = new User({email, password})
        await user.save();

        res.status(201).json({message: 'user created'});
    } catch(error){
        res.status(500).json({error:'error signing up'})
    }
});

// login route 
app.post('/api/login', async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({error:"Invalid user"})
        }
        if(user.password !== password){
        return res.status(401).json({error:"Invalid password"})
        }
        return res.status(200).json({message: 'Loggedin'})
    }catch(error){
        console.error('loggin error:', error);
        res.status(500).json({error:'error logged in'})
    }
});


app.listen(8000,(err) =>{
    if(err){
        console.error("error")
    }else{
        console.log('server is running on port 8000')
    }
    
})