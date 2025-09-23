const AllUserSchema=require('../Models/AllUserSchema.js')
const bcrypt = require('bcryptjs');
const JWT=require('jsonwebtoken')
exports.CreateUser=async (req, res) => {
        try {
            const {
                username,
                Name,
                email,
                password}=req.body;
                const existingUser = await AllUserSchema.findOne({email});
                 if (existingUser) return res.status(400).json({
                message: "User already exists"
            });
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            const newUser=  await AllUserSchema.create({
                 username,
                Name,
                email,
                password:passwordHash
            })
             const token = JWT.sign({
                id: newUser._id
            },process.env.JSON_TOKEN, {
                expiresIn: "1d"
            });
          
             return res.status(201).json({
                token,
                user: newUser,
                message: `${Name} registered successfully`
            });
            }
           catch (error) {
            console.error(error);
            res.status(500).json({
                error: error.message,
                message: 'Registration failed'
            });
        }
}
exports.LoginUser= async (req, res) => {
  try {
    const { email, password} = req.body;

    const user = await AllUserSchema.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = JWT.sign({
                id: user._id
            },process.env.JSON_TOKEN, {
                expiresIn: "1d"
            });
          
             return res.status(201).json({
                token,
                user: user,
                message: `${user.Name} Login successfully`
            });
}
 catch (error) {
            console.error(error);
            res.status(500).json({
                error: error.message,
                message: 'Registration failed'
            });
        }
    }