const express = require('express');
const path = require('path');
const phonePattern = /^(\+?1 *[ -.])?(\d{3}) *[ .-]?(\d{3}) *[ .-]?(\d{4}) *$/

//initalize app
const app = express();

// static path
let staticPath = path.join(__dirname, "public");
//middlewares
app.use(express.static(staticPath));
app.use(express.json())


app.get("/",(req, res) => {

    res.sendFile(path.join(staticPath, "index.html"));   })

app.get("/order",(req, res) => {

    res.sendFile(path.join(staticPath, "order.html"));   })

app.get("/success",(req, res) => {

    res.sendFile(path.join(staticPath, "success.html"));   })
//called when customer wants to buy and then we get there number and finish the rest of local delivery steps from our phones
//all i need is there order and phone number then i can continue the delivery with there phone            
app.post("/order", (req,res) =>{
    

//send cart to client with different cookie name as we will delete the current cart
res.cookie('oldcart', req.body.order, { maxAge: 24*24*60*60*1000, httpOnly: false});
res.status(200)
res.redirect('/success')

/*  //regex to verify
  if(!phonePattern.test(number_Input.value)){
   
  }
  else{
      
    
  }*/

})



app.listen(3000, () =>{
    console.log('listening on port 3000')
});