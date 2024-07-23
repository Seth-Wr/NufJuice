const shopping_bag_qty = document.querySelector(".shopping-bag-qty")
const order = document.querySelector(".order")
const total_Qty = document.querySelector(".total-qty")
const checkout_Price = document.querySelector(".checkout-price")
const homePage = document.querySelector(".homepage")

render_Page()
document.cookie = "cart=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;";
function render_Page(){
    const cookie = getCookie("oldcart")
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
      const html = `<h3>My Order</h3> ` + order_List.toString()
      //remove commas from the array to string 
      const finalhtml = html.replace(/,/g, "")
      total_Qty.textContent = cart.totalQty +" Items"
     //update the dom 
      order.innerHTML = finalhtml
    
    
    }
  }

//create html for each product
  function create_Order(name,price,img_url,qty){
    //product card html for front end
  return  `<div class="product-card">
    <div class="img-box">
    <img src=${img_url} alt="">
</div>
<div class="card-text">
    <h4 class="product-name">${name}</h4>
    <span class="price">${price}</span>           
            
    </div>
    
    <div class="qty-wrapper">
        <span class="qty">
            ${qty}
          </span>
    </div>
    
    </div>
</div>`
  }

homePage.addEventListener('click', () =>{
    window.location.href = '/'
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
            shopping_bag_qty.textContent = cart.totalQty
            shopping_bag_qty.classList.add("active")
        }
        else return
    }
    
    //check for shoppingcart qty if the page was reloaded from the cache
    function pageReload(){
        window.onpageshow = function(event) {
            if (event.persisted){
                render_Page()
                
                
            }
            else return
        }
    }