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
    console.log(checked_Price[1].length)
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
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10+</option>
            <option value="${qty}" selected disabled hidden>${qty}</option>
        </select>
        <button>remove</button>
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
    function addToCart(cart,id,price_per,img_url){
        //function to add to cart saves item name as id
    let storedItem = cart.items[id];
    //if no item add one
    if(!storedItem){
        storedItem = cart.items[id] = { qty: 0, price: 0, price_per: 0,img_url: img_url};
    }
    //update values of cart and prevents super long floats to keep cookie data limit low
    storedItem.price_per = price_per;
    storedItem.qty++;
    storedItem.price =  parseFloat2Decimals(storedItem.price_per * storedItem.qty)
    cart.totalPrice =  parseFloat2Decimals(cart.totalPrice + storedItem.price_per);
    cart.totalQty ++;
    let newCart = cart;
    return newCart;

    };
    
    //make float two decimals only have to call function twice because .toFixed returns a string
    function parseFloat2Decimals(value) {
        return parseFloat(parseFloat(value).toFixed(2));
    }