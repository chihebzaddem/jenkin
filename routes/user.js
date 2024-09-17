const express= require('express');
const router = express.Router();
const User= require('../models/user');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
router.post('/register', async(req,res)=>{
    data = req.body;
    usr= new User(data);
    salt = bcrypt.genSaltSync(10);
    cryptedPass= await bcrypt.hashSync(data.password,salt);
    usr.password=cryptedPass;
    usr.save()
    .then((saved)=>{
        res.status(200).send(saved)
    }).catch((err)=>{
        res.satus(400).send(err);
    })
});
router.post('/login', async(req,res)=>{
    data=req.body;
    user=await User.findOne({email:data.email})
    if(!user){
        res.status(404).send('email not found')
    }else{
        validPass= bcrypt.compareSync(data.password,user.password)
        if(!validPass){
            res.status(401).send('email or password invalid')
        }else{
            payload={
                _id: user._id,
                email:user.email,
                name: user.email
            }
           token = jwt.sign(payload,'1234567')
           res.status(200).send({mytoken:token})
        }
    }
})
router.post('/create', async (req,res)=>{
    try{
        data=req.body;
        usr=new User(data);
        savedUser= await usr.save();
        res.send(savedUser)
    }
    catch(err){
        res.send(err)
    }
});
router.get('/getall',(req,res)=>{
    User.find()
    .then(
        (users)=>{
            res.send(users);
        }
    )
    .catch((err)=>{
        res.send(err)
    });
    console.log('getall')
});
router.get('/all', async (req,res)=>{
    try{
        users=await User.find({name:"chiheb"});
        res.send(users)
    }
    catch(err){
        res.send(err)
    }
});
router.get('/getbyid/:id',(req,res)=>{
    myid= req.params.id;
    
    User.findOne({_id:myid})
         .then((user)=>{
            res.send(user);
         })
         .catch((err)=>{
            res.send(err)
         })
});
router.put('/update/:id',(req,res)=>{
    id=req.params.id;
    newData = req.body;
    User.findByIdAndUpdate({_id:id},newData)
       .then((updated)=>{
         res.send(updated)
       }).catch((err)=>{
        res.send(err)
       })
});
router.delete('/delete/:id',(req,res)=>{
    id=req.params.id;
    User.findOneAndDelete({_id:id})
      .then((deleteduser)=>{
        res.send(deleteduser)
      }).catch((err)=>{
        res.send(err);
      })
});
module.exports=router;