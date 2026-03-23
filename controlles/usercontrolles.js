const isValidEmail = require("../middlewares/emailvalidator")
const passwordvalidator = require("../middlewares/passwordvalidator")
const User=require("../models/user")
const bcrypt = require("bcrypt")

// usercontrolles.js → Adduser

exports.Adduser = async (req, res) => {
  try {
    const { email, password, name /* ... other fields */ } = req.body;

    // Force role to 'user' – ignore anything sent by client
    const userData = {
      ...req.body,
      role: 'user'           // ← always!
    };

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    if (!passwordvalidator(password)) {
      return res.status(400).json({ 
        msg: "Password must be ≥6 chars, contain uppercase, lowercase, number & symbol" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ...userData,
      password: hashedPassword
    });

    await user.save();

    return res.status(201).json({ msg: "Registration successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

exports.Login=async(req,res)=>{
    try {
        const {email,password}=req.body

        const existUser= await User.findOne({email})
        if (!existUser) {
            return res.status(400).json({msg:"Bad credential !"})
        }
        const existpassword= await bcrypt.compare(password,existUser.password) 
          if(!existpassword){
            return res.status(400).json({msg:"Bad credential !"})
          }
          const jwt = require("jsonwebtoken")
          const payload = { _id: existUser._id };
          const token = jwt.sign(payload, process.env.secretKey);

          return res.status(200).json({msg:"login success",token})
    } catch (error) {
        return res.status(503).json({msg:error.message})
    }
}

exports.getUser=async(req,res)=>{
    try {
        return res.status(200).send(req.user);
      } catch (error) {
        return res.status(500).json(error)
      }
}

exports.getUsers=async(req,res)=>{
    try{
          const users=await User.find()
          return res.status(200).json(users)

    }
    catch{  return res.status(500).json(error)}
}

exports.UpdateUSER=async(req,res)=>{
    try {
     
    const {body}=req
    await User.findByIdAndUpdate(req.params.id,body,{new:true})
        
       return res.status(202).json({msg:"Update success"})
    } catch (error) {
        return res.status(503).json({msg:error.message})
    }
}