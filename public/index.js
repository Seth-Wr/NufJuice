const start_Shopping = document.querySelectorAll(".start-shopping-btns")
const menu = document.querySelector(".menu-header")
const order_Button = document.querySelectorAll(".order-btn")
const product_Name = document.querySelectorAll(".product-name")
const product_Price = document.querySelectorAll(".price")
const product_Img = document.querySelectorAll(".product-img")
const shopping_bag_qty = document.querySelector(".shopping-bag-qty")
const toast_container = document.querySelector(".toast-container")
const toast_msg = document.querySelector(".toast-msg")

checkCookie("cart")
pageReload()

start_Shopping.forEach((item,i) =>{
    //scroll to menu from about us or hero
    item.addEventListener('click', ()=>{
        menu.scrollIntoView({
            behavior: "smooth"
        });
    })
})
//add to cart
order_Button.forEach((item,i) =>{
    //add item to our cart object in the cookie first has to be uri encoded
    // to save proper values for special characters
    item.addEventListener('click',()=>{
        let  cart =  getCookie('cart')
        //make the price html span into a float going only to the first 2 decimals
         const price = parseFloat2Decimals(product_Price[i].textContent.replace('$', ''))
        //adding item to cart with params from the html page
        //convert cart into string to set cookie
        //then add to cart with function and store in variable
        let oldCart = {}
        if (typeof cart == "string"){
            oldCart =  JSON.parse(cart) 
        }
     
       const cart_Object = new Cart(oldCart)
     const newCart = addToCart(cart_Object,product_Name[i].textContent,price,product_Img[i].src)
       const cart_String = JSON.stringify(newCart)
        setCookie('cart',cart_String, 24)
        shopping_bag_qty.textContent = newCart.totalQty
        shopping_bag_qty.classList.add("active")
        toast_msg.textContent =`${product_Name[i].textContent} has been added to your cart`
        toast_container.classList.add("active")
       const toast_timeout = setTimeout(toast_remove,2000)
       function toast_remove(){
        toast_container.classList.remove("active")
    }
    })
})


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
        if(cart.totalQty == 0){
            shopping_bag_qty.classList.remove("active")
        }
        shopping_bag_qty.textContent = cart.totalQty
        shopping_bag_qty.classList.add("active")
    }
    else {
        shopping_bag_qty.classList.remove("active")
    }
}

//check for shoppingcart qty if the page was reloaded from the cache
function pageReload(){
    window.onpageshow = function(event) {
        if (event.persisted){
            checkCookie('cart')
        
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