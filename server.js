const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const nodemailer = require('nodemailer');
const phonePattern = /^(\+?1 *[ -.])?(\d{3}) *[ .-]?(\d{3}) *[ .-]?(\d{4}) *$/

dotenv.config();
//initalize app
const app = express();

// static path
let staticPath = path.join(__dirname, "public");
//middlewares
app.use(express.static(staticPath));
app.use(express.json())


  


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });
  const mailOptions = (html) => {
    
   return { 
    from: {name: 'seth',
  address: process.env.user
  }, 
  to: ['anng9874@gmail.com'],
  subject: "You received a order",
  html: html,
   
  }
  }

  
  
  const sendMail = async (transporter, mailOptions) =>{
    try {
      await transporter.sendMail(mailOptions);
      return true
      //change status of order  after email is semt to the user

    } catch (error) {
      console.error(error)
      return false
    }
  }
 

app.get("/",(req, res) => {

    res.sendFile(path.join(staticPath, "index.html"));   })

app.get("/order",(req, res) => {

    res.sendFile(path.join(staticPath, "order.html"));   })

app.get("/success",(req, res) => {

    res.sendFile(path.join(staticPath, "success.html"));   })
//called when customer wants to buy and then we get there number and finish the rest of local delivery steps from our phones
//all i need is there order and phone number then i can continue the delivery with there phone            
app.post("/order", async(req,res) =>{ 
  try {
    const date = new Date();
    const current_date = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long', hour: 'numeric', hour12: false})
    const current_day = current_date.split(',')[0]
    const current_hour = parseInt(current_date.split(',')[1])
    
    const cart = JSON.parse(req.body.order)
    const productList = []
    //loop through ids in cart then make into html string and remove commas
    for(let id in cart.items){
        //make sure number ends in 2 numbers after decimal instead of 69. its 69.00
        let product_Price = cart.items[id].price.toString();
        let checked_Price = product_Price.split(".");
        if(checked_Price[1].length < 2){
            for(i = checked_Price[1].length; i<2; i++){
                checked_Price[1] = checked_Price[1] +'0';
            }
            checked_Price = checked_Price[0] + '.'+ checked_Price[1]
            
        }
        else {
            checked_Price = checked_Price[0] + "." + checked_Price[1];
        }
        //make html for email confirmation of order
      let product =  createProductHtml(id,checked_Price,cart.items[id].img_url,cart.items[id].qty)
        productList.push(product)
        
    } 
    //make total price end in 2 numbers after decimal
    let product_Price = cart.totalPrice.toString();
    let checked_Price = product_Price.split(".");
    if(checked_Price[1].length < 2){
        for(i = checked_Price[1].length; i<2; i++){
            checked_Price[1] = checked_Price[1] +'0';
        }
        checked_Price = checked_Price[0] + '.'+ checked_Price[1]
        
    }
    else {
        checked_Price = checked_Price[0] + "." + checked_Price[1];
    }
  
    let order = createOrderHtml(productList,cart.totalQty,checked_Price,req.body.email,req.body.phone,req.body.shipping)
  
    
  //send cart to client with different cookie name as we will delete the current cart
 
  
   //regex to verify
   //if req fails to meet requirments we will send error msg to display on front end
    if(!phonePattern.test(req.body.phone)){
      const body = {msg: `Please enter a valid Phone number.`}
      res.status(400)
      res.send(body)
    }
    else if(cart.totalQty < 3){
      const body = {msg: `Our minimum order size for delivery is 3 items.`}
      res.status(400)
      res.send(body)
    } 
    else if(current_day == 'Sunday' ||  current_hour <= 7 || current_hour >= 20 ){
      const body = {msg: `Our buisness hours are Mon-Sat 8am-8pm.`}
      res.status(400)
      res.send(body)
    } 
    
    else{
      const email_results =  await sendMail(transporter,mailOptions(order))
      if( email_results == true){
        res.cookie('oldcart', req.body.order, { maxAge: 24*24*60*60*1000, httpOnly: false});
        res.status(200)
        res.redirect('/success')
      }  else{
        const body = {msg: `Network error.`}
        res.status(500)
        res.send(body)
      }    
      
    }
  } catch (error) {
    console.error(error)
    const body = {msg: `Network error.`}
    res.status(500)
    res.send(body)
    
  }
 

})



app.listen(3000, () =>{
    console.log('listening on port 3000')
});

//create each product card for html email
function createProductHtml(name,price,img_url,qty){
 const html = ` <div class="product-card" style="display: flex; margin-top: 16px; margin-bottom: 16px">
    <div class="img-box">
    <img src=${img_url} style="object-fit: scale-down;
    height: 80px;
    width: 80px;" alt="">
</div>
<div class="card-text" style="width:100%;
padding-top:8px;
padding-right:16px;">
    <h4 class="product-name" style="padding-left: 8px;
    font-size: 20px;
    margin: 0;
    margin-bottom: 8px;">${name}</h4>
    <span class="price" style="  padding-left: 8px;
    font-weight: 600;">${price}</span>           
            
    </div>
    
    <div class="qty-wrapper" style="display: flex;
    flex-direction: row;">
        <span class="qty" style="padding-right: 8px;
        width: 48px;
        
        
        margin-bottom: 40px;
        margin-top: 8px;">
           qty: ${qty}
          </span>
    </div>
    
    </div> `
    
    return html;
}
//create the finished order for the html email
function createOrderHtml(products,totalqty,totalprice,email,number,shipping){
  const html = `
  <div class="order" style="margin-top:40px;display: grid;grid-template-columns:1fr;grid-gap: 24px;
  margin-bottom: 32px;"><h3 style=" text-align: center;
  margin: 0;        
  font-size: 20px;">New Order</h3> ` + products.toString() + `</div>
  <div class="total" style="   margin-top: 8px;
  justify-content: center;
  margin-bottom: 16px;
  flex-direction: column;
  text-align: center">
                          <span class="total-qty" style=" padding-right: 16px;">${totalqty} Items</span>
                          <span style="display=block;" class="total-price" style="font-weight: 700;">Total Price <span class="checkout-price">$${totalprice}</span></span>
                         <div> <p  class="total-price" style="font-weight: 700;">email: ${email}</p> </div>
                         <div> <p  class="total-price" style="font-weight: 700;">phone: ${number}</p> </div>
                         <div> <p  class="total-price" style="font-weight: 700;">shipping: ${shipping}</p> </div>
                      </div>
                     `
  //remove commas from the array to string 
  const finalhtml = html.replace(/,/g, "")
  return finalhtml
}
