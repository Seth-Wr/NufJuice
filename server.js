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
      
      
      //change status of order  after email is semt to the user

    } catch (error) {
      console.error(error)
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
    let product =  createProductHtml(id,checked_Price,cart.items[id].img_url,cart.items[id].qty)
      productList.push(product)
      
  } 

  let order = createOrderHtml(productList,cart.totalQty,cart.totalPrice,req.body.email,req.body.phone,req.body.shipping)

  sendMail(transporter,mailOptions(order))
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

//create each product card for html email
function createProductHtml(name,price,img_url,qty){
 const html = ` <div class="product-card" style="padding-top: 16px; padding-bottom: 16px;
  display: flex;
  background-color: #fff;
  position: relative;
  margin-left: 24px;
  margin-right: 24px;
  border-radius: 24px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, .1);">
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
            ${qty}
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
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  flex-direction: column;
  text-align: center">
                          <span class="total-qty" style=" padding-right: 16px;">${totalqty} Items</span>
                          <span class="total-price" style="font-weight: 700;">Total Price <span class="checkout-price">$${totalprice}</span></span><br>
                          <span class="total-price" style="font-weight: 700;">${email}</span><br>
                          <span class="total-price" style="font-weight: 700;">${number}</span><br>
                          <span class="total-price" style="font-weight: 700;">${shipping}</span>
                      </div>
                     `/*<body style=" margin: 0;
                      background-color: rgba(251, 250, 247, 1);
                       font-family: 'Times New Roman', Times, serif;
                       overflow-x: hidden;"`></body> */
  //remove commas from the array to string 
  const finalhtml = html.replace(/,/g, "")
  return finalhtml
}