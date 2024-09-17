const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');

let filename = '';

// Configure multer storage
const mystorage = multer.diskStorage({
    destination: './uploads', // Ensure this directory exists
    filename: (req, file, cb) => {
        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];
        cb(null, fl);
        filename = fl;
    }
});

const upload = multer({ storage: mystorage });

// Add product route
router.post('/addproduct', upload.single('image'), (req, res) => {
    const data = req.body;

    // Assign image file name to data object if the file exists
    if (filename) {
        data.image = filename;
    }

    // Create new product instance with the data
    const prod = new Product(data);

    // Save the product to the database
    prod.save()
        .then((savedProd) => {
            filename = ''; // Reset filename for next request
            res.status(200).json(savedProd);
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
});
router.get('/getallproducts',(req,res)=>{
    Product.find()
    .then(
        (prods)=>{
            res.status(200).send(prods);
        }
    )
    .catch((err)=>{
        res.status(400).send(err)
    });
    
});
router.get('/getprodbyid/:id',(req,res)=>{
    myid= req.params.id;
    
    Product.findOne({_id:myid})
         .then((prod)=>{
            res.status(200).send(prod);
         })
         .catch((err)=>{
            res.status(400).send(err)
         })
});
router.put('/updateproduct/:id',(req,res)=>{
    id=req.params.id;
    newData = req.body;
    Product.findByIdAndUpdate({_id:id},newData)
       .then((updated)=>{
         res.status(200).send(updated)
       }).catch((err)=>{
        res.status(400).send(err)
       })
});
router.delete('/deleteproduct/:id',(req,res)=>{
    id=req.params.id;
    Product.findOneAndDelete({_id:id})
      .then((deletedprod)=>{
        res.status(200).send(deletedprod)
      }).catch((err)=>{
        res.status(400).send(err);
      })
});
module.exports=router;