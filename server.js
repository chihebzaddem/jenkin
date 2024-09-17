const express= require('express');
require('./config/connect');
const productRoute=require('./routes/product');
const userRoute= require('./routes/user');
const app= express();

app.use(express.json());

//http://127.0.0.1/product/
app.use('/product',productRoute);
app.use('/user',userRoute);
app.use('/getimage',express.static('./uploads'));

app.listen(3000,()=>{
    console.log('server work')
});
