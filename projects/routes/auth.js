const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/login',(req,res)=>res.render('auth/login'));
router.get('/register',(req,res)=>res.render('auth/register'));

router.post('/register', async(req,res)=>{
    const hash = await bcrypt.hash(req.body.password,10);

    await User.create({
        username:req.body.username,
        password:hash
    });

    res.redirect('/auth/login');
});

router.post('/login', async(req,res)=>{
    const user = await User.findOne({username:req.body.username});
    if(!user) return res.redirect('/auth/login');

    const ok = await bcrypt.compare(req.body.password,user.password);
    if(!ok) return res.redirect('/auth/login');

    req.session.userId = user._id;

    res.redirect('/projects/my');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.redirect('/projects/my'); 
        res.redirect('/auth/login'); 
    });
});

module.exports = router;
