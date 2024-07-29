const express = require("express");
const User = require("../models/User");
const fetchuser=require("../middleware/fetchuser");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
var jwt=require('jsonwebtoken');

const JWT_SECRET="Bunny@MachoMan";

// Create a USER using-  POST "/api/auth/createuser". NO LOGIN REQUIRED
router.post(
  "/createuser",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // HANDILING ERRORS
    
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try {
      // check mail exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success,error: "User already exists" });
      }
      const salt = await bcrypt.genSaltSync(10);
      const secPass= await bcrypt.hash(req.body.password, salt); 
    //   Create New User
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data={
        user:{
            id: user.id
        }
      }
      const authtoken=jwt.sign(data, JWT_SECRET);
    //   console.log(jwtData);

     success=true;
      res.json({success,authtoken});

    } catch (error) {
      // console.error(error.message);
      res.status(500).send("Error Occured");
    }
  }
);

//Authenticate user using-  POST "/api/auth/login".
router.post("/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter Password").exists()
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
      let user= await User.findOne({email});
      if(!user){
        return res.status(400).json({errror:"Enter Correct Credentials"})
      }

      const passwordCompare = await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        success=false
        return res.status(400).json({success, errror:"Enter Correct Credentials"})
      }

      const data={
        user:{
          id: user.id
        }
      }
      const authtoken=jwt.sign(data, JWT_SECRET);
      success=true
      res.json({success, authtoken});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error Occured");
    }

  })

// ROUTE 3 POST "/api/auth/getuser"
router.post("/getuser", fetchuser, async (req, res) => {
    try {
      userId=req.user.id;
      const user=await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error Occured");
    }
  })



module.exports = router;
