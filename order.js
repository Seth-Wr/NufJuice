const shopping_bag_qty = document.querySelector(".shopping-bag-qty")
const order = document.querySelector(".order")
const total_Qty = document.querySelector(".total-qty")
const checkout_Price = document.querySelector(".checkout-price")



checkCookie("cart")
pageReload()
render_Page()
//make html from data im cookies

function render_Page(){
  const cookie = getCookie("cart")
  if(typeof cookie == 'string'){
    const cart = JSON.parse(cookie)
    const order_List = []
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
      let product =  create_Order(id,checked_Price,cart.items[id].img_url,cart.items[id].qty)
        order_List.push(product)
    }
    //make sure number ends in 2 numbers after decimal
    let total_Price = cart.totalPrice.toString()
    let checked_Price = total_Price.split(".")
    if(checked_Price[1].length < 2){
        for(i = checked_Price[1].length; i<2; i++){
            checked_Price[1] = checked_Price[1] +'0';
        }
        checked_Price = checked_Price[0] + '.'+ checked_Price[1]
        checkout_Price.textContent = '$' + checked_Price
    }
    else {
        checkout_Price.textContent = '$' + cart.totalPrice
    }
    const html = order_List.toString()
    const finalhtml = html.replace(/,/g, "")
    total_Qty.textContent = cart.totalQty +" Items"
   
    order.innerHTML = finalhtml
  
  }
}


function create_Order(name,price,img_url,qty){
  //product card html for front end
  return  `     <div class="product-card">
    <div class="img-box">
    <img src="${img_url}" alt="">
</div>
<div class="card-text">
    <h4 class="product-name">${name}</h4>
    <span class="price">${'$' +price}</span>           
            
    </div>
    <div class="qty-wrapper">
        <select class="qty-select" id="">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="${qty}" selected disabled hidden>${qty}</option>
        </select>  
        <button class="remove-btn">remove</button>
    </div>
    </div>`
}

//make cookie or rewrite if exists
function setCookie(cname,cvalue,exdays){
    //get date into string then add the cart in json
    const date = new Date();
    date.setTime(date.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    
}
//define variables based on render html after its rendered
const remove_Btn = document.querySelectorAll(".remove-btn");
const quanity_Select = document.querySelectorAll(".qty-select");
const product_Name = document.querySelectorAll(".product-name");
const product_Card = document.querySelectorAll(".product-card");

//removeProduct
remove_Btn.forEach((item,i) =>{
    item.addEventListener('click', ()=>{
      const  newCart = removeItemCart(product_Name[i].textContent)
       //removing classlist to hide qty span if qty 0 and deleting cookie if qty is 0
       if(newCart.totalQty == 0){
        shopping_bag_qty.textContent = '';
        shopping_bag_qty.classList.remove("active")
        product_Card[i].remove()
        checkout_Price.textContent = '$0.00';
        total_Qty.textContent = '0 Items'
        document.cookie = "cart=; expires=Thu, 08 Aug 2000 00:00:00 UTC; path=/;";
      }
      else{
        shopping_bag_qty.textContent = newCart.totalQty
        shopping_bag_qty.classList.add("active")
        let total_Price = newCart.totalPrice.toString()
        let checked_Price = total_Price.split(".")
        //change  total price
        if(checked_Price[1].length < 2){
            for(x = checked_Price[1].length; x<2; x++){
                checked_Price[1] = checked_Price[1] +'0';
            }
            checked_Price = checked_Price[0] + '.'+ checked_Price[1]
            checkout_Price.textContent = '$' + checked_Price;
            
        }
        else {
        
            checkout_Price.textContent = '$' + newCart.totalPrice
            
        } 
        //update qty and save cart in cookies by overiding cookie with same name and update shopping cart span 
      total_Qty.textContent = newCart.totalQty + " Items"
      product_Card[i].remove()
          const cart_String = JSON.stringify(newCart)
          setCookie('cart',cart_String, 24)

    }
    })
})

//change quantiy
quanity_Select.forEach((item,i) =>{
    item.addEventListener('change', ()=>{
        //make sure your for loop doesnt use i it will overlap the global varaible i in foreach statement
        
        let product_Cart_Price = document.querySelectorAll(".price")
     let  qty = quanity_Select[i]
     let current_Product_Name = product_Name[i].textContent
        const newCart = cartQtyChange(qty.value,current_Product_Name)
        //change cart by calling cart qty change then change the price to a string so we can make sure the number has .00 instead of 69. or 69.9
        let product_Price = newCart.items[current_Product_Name].price.toString();
        let checked_Product_Price = product_Price.split(".");
       if(checked_Product_Price[1].length < 2){
            for(x = checked_Product_Price[1].length; x<2; x++){
                checked_Product_Price[1] = checked_Product_Price[1] +'0';
            }
            //split into string array and if the second part of array is less than 2 add 0 until its 2 numbers
            checked_Product_Price = checked_Product_Price[0] + '.'+ checked_Product_Price[1]
            product_Cart_Price[i].textContent = '$' + checked_Product_Price
        }
        else {
            checked_Product_Price = checked_Product_Price[0] + "." + checked_Product_Price[1];
            product_Cart_Price[i].textContent = '$' + checked_Product_Price;
        } 
        //make sure number ends in 2 numbers after decimal
    let total_Price = newCart.totalPrice.toString()
    let checked_Price = total_Price.split(".")
    //change item price and total price
    if(checked_Price[1].length < 2){
        for(x = checked_Price[1].length; x<2; x++){
            checked_Price[1] = checked_Price[1] +'0';
        }
        checked_Price = checked_Price[0] + '.'+ checked_Price[1]
        checkout_Price.textContent = '$' + checked_Price;
        
    }
    else {
    
        checkout_Price.textContent = '$' + newCart.totalPrice
        
    } 
   //update qty and save cart in cookies by overiding cookie with same name and update shopping cart span 
    total_Qty.textContent = newCart.totalQty + " Items"
        const cart_String = JSON.stringify(newCart)
        setCookie('cart',cart_String, 24)
        shopping_bag_qty.textContent = newCart.totalQty
        shopping_bag_qty.classList.add("active")
    })
})
//find cookei by name
function getCookie(cname){
let name = cname + "=";
let decoded_Cookie = decodeURIComponent(document.cookie);
let cookie_Array = decoded_Cookie.split(/;/g);
for(let i =0; i <cookie_Array.length; i++){
    let c = cookie_Array[i]
    while (c.charAt(0) == ' '){
          
        c = c.substring(1); 
    }
    if(c.indexOf(name) == 0){
        return c.substring(name.length, c.length)
    }
}
    return {}
}

//check for shopping cart qty
function checkCookie(name){
    let cookie = getCookie(name)
    if(typeof cookie == 'string'){
        let cart = JSON.parse(cookie)
        shopping_bag_qty.textContent = cart.totalQty
        shopping_bag_qty.classList.add("active")
    }
    else return
}

//check for shoppingcart qty if the page was reloaded from the cache
function pageReload(){
    window.onpageshow = function(event) {
        if (event.persisted){
            checkCookie('cart')
            console.log("persisted")
        }
        else return
    }
}
function Cart(oldCart){
    //takes in old cart as param

    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    
    }


    //called when user selects on on the quantity selector or inputs number
    function cartQtyChange(qty,name){
        const cookie = getCookie("cart");
        if(typeof cookie == 'string'){
            const cart = JSON.parse(cookie)
            if(cart.items[name].qty < qty){
                //if the input quanity is more we will add to the following fields
                let difference = qty - cart.items[name].qty;
                cart.items[name].qty += difference;
                //parsing these values so the number stays aestechically pleasing and proffesional
                cart.items[name].price = parseFloat2Decimals( cart.items[name].price + difference * cart.items[name].price_per);
                cart.totalQty += difference;
                cart.totalPrice = parseFloat2Decimals(cart.totalPrice + cart.items[name].price_per * difference);
                return cart
            }else{
                let difference = cart.items[name].qty - qty;
                cart.items[name].qty -= difference
                cart.items[name].price = parseFloat2Decimals(cart.items[name].price - difference * cart.items[name].price_per);
                cart.totalQty -= difference;
                cart.totalPrice = parseFloat2Decimals(cart.totalPrice - cart.items[name].price_per * difference);
                return cart
            }
            
        }


        else return
    }
    //remove item from shopping cart
    function removeItemCart (name){
      const cookie =  getCookie("cart")
     if(typeof cookie == 'string') {
        const cart = JSON.parse(cookie);
        cart.totalPrice -= cart.items[name].price;
        cart.totalQty -=    cart.items[name].qty
       delete cart.items[name] 

       return cart
     }
     else return
    }
    
    //make float two decimals only have to call function twice because .toFixed returns a string
    function parseFloat2Decimals(value) {
        return parseFloat(parseFloat(value).toFixed(2));
    }