const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

//REGISTER
router.post('/register', async (req, res) => {

    //LETS VALIDATE THE DATA BEFORE WE MAKE A USER
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //CHECKIN IF THE USER IS ALREADY IN THE DATABASE
    const emailExists = await User.findOne({ email: req.body.email});
    if (emailExists) return res.status(400).send('Email already exists');

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //CREATE A NEW USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {

    //LETS VALIDATE THE DATA BEFORE LOGIN
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //CHECKIN IF THE EMAIL EXISTS
    const user = await User.findOne({ email: req.body.email});
    if (!user) return res.status(400).send('Email or password is wrong !');

    //PASSWORD IS CORRECT
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Email or password is wrong !!');

    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({_id: user._id, name: user.name}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);



    res.send('Logged in successfully');

});

module.exports = router;