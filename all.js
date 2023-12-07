// 請代入自己的網址路徑
const api_path = "jenny0310";
const token = "KeJqwxLUCwSv4Druw5yC7hlfTA82";

//宣告產品的data
let productData = '';
// 宣告購物車的產品
let cartData =[];

// 
function init(){
    getProduct()
    getCartList()
}
//宣告 渲染產品的外層ul productWrap;
const productWrap = document.querySelector(".productWrap");
function renderProduct(productData){
    let str='';
    productData.forEach((item,index)=>{
        str +=
        `
        <li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="addCardBtn" data-index="${index}" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
        </li>
        `

    });
    productWrap.innerHTML = str
   
};

// 點擊加入購物車按鈕
productWrap.addEventListener("click",(e)=>{
    const itemId = e.target.dataset.id;
    console.log(e.target)
    let numCheck=1;
    if(e.target.getAttribute("class") == "addCardBtn"){
        e.preventDefault();
        console.log("有點到加入購物車BTN");
        console.log(cartData);
        // 判斷購物車內是否有重複品項
        cartData.carts.forEach(function(item){
            
            if(item.product.id == itemId){
                
                numCheck = Number(item.quantity += 1);
            };
        });
        addCartItem(itemId,numCheck);
        
    };

});






// 取得產品列表
function getProduct(){

    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function(response){
        
        productData = response.data.products;
        console.log(productData);
        renderProduct(productData)
    })
    .catch(function(error){
        console.log(error)
    })
};
// 加入購物車
function addCartItem(itemId,numCheck){
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
        {
            "data": {
            "productId":itemId,
            "quantity": numCheck
            }
        }
    )
    .then(function(response){
        console.log(response.data);
        getCartList();
        
    })
    .catch(function(error){
        console.log(error)
    })
};

//渲染購物車畫面
const shoppingCartTable = document.querySelector(".shoppingCart-table");
const shoppingCart = document.querySelector(".shoppingCart");
function renderCart(cartData){
    let cartList = cartData.carts;
    let str=
    `
    <tr>
        <th width="40%">品項</th>
        <th width="15%">單價</th>
        <th width="15%">數量</th>
        <th width="15%">金額</th>
        <th width="15%"></th>
    </tr>
    `;
    cartList.forEach((i)=>{
    let totalPrice = Number(i.product.price)*Number(i.quantity);
        str += 
        `
        <tr class="cartItem">
            <td>
                <div class="cardItem-title">
                    <img src="${i.product.images
                    }" alt="">
                    <p>${i.product.title}</p>
                </div>
            </td>
            <td>NT$${i.product.price}</td>
            <td>${i.quantity}</td>
            <td>NT${totalPrice}</td>
            <td class="discardBtn" data-cartid="${i.id}">
                <a href="#" class="material-icons discardBtn" data-cartid="${i.id}">
                    clear
                </a>
            </td>
        </tr>
        `;
     console.log(i.id)
    });
    str +=
    `
    <tr>
        <td>
            <a href="#" class="discardAllBtn">刪除所有品項</a>
        </td>
        <td></td>
        <td></td>
        <td>
            <p>總金額</p>
        </td>
        <td>NT$${toThousands(cartData.finalTotal)}</td>
    </tr>
    `
    
    shoppingCartTable.innerHTML = str;
    // 點擊刪除全部、指定品項 按鈕

    shoppingCart.addEventListener("click",(e)=>{
        e.preventDefault();
        let clickBtn = e.target
        if( clickBtn.getAttribute('class') == "discardAllBtn"){
            deleteAllCartItem();
            getCartList()
        }else if( clickBtn.getAttribute('class').includes("discardBtn") ){
            //有點不確定要怎麼選到這按鈕裡面的a
            const deleteId = clickBtn.dataset.cartid;
            deleteCartItem(deleteId);
        };

    });
     
};




// 取得購物車列表

function getCartList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
        
        cartData = response.data;
        console.log(cartData);
        renderCart(cartData);
    })
    .catch(function(error){
        console.log(error)
    })
};
 
// 刪除所有購物車商品
function deleteAllCartItem(){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
        console.log(response.data);
        getCartList()
    })
    .catch(function(error){
        console.log(error.response.data.message)
    })
};
// 刪除購物車內特定產品
function deleteCartItem(cartId){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then(function(response){
        console.log(response.data);
        getCartList()
    })
};






//監聽購買表單點擊事件
const orderInfoForm = document.querySelector('.orderInfo-form');
const orderInfoAllInput = document.querySelectorAll(".orderInfo-input");
const customerName =  document.querySelector('#customerName');
const customerPhone =  document.querySelector('#customerPhone');
const customerEmail =  document.querySelector('#customerEmail');
const customerAddress =  document.querySelector('#customerAddress');
const tradeWay =  document.querySelector('#tradeWay');

//確認每筆input都有填寫 、 把購買資料組入一個物件
function validForm(){
    const orderInfoMessage = document.querySelectorAll(".orderInfo-message");
    let orderUserObj = {};
   
    orderInfoAllInput.forEach((item,index)=>{

        orderInfoMessage.forEach( (message) =>{ 
        message.classList.add("d-none");
        console.log(item.value)
        if(item.value == ""){
            orderInfoMessage[index].classList.remove("d-none");
            console.log("沒填")
        }else if(item.value !== ""){
         
            orderInfoMessage[index].classList.add("d-none");
            console.log("有填")
        };
        });
        
    });
   
    if(customerName.value =="" ||customerPhone.value =="" || customerEmail.value ==""  || customerAddress.value ==""  || tradeWay .value ==""){
        return
    };
    
      
};
// 點擊送出訂單按鈕
orderInfoForm.addEventListener('click',(e)=>{
    e.preventDefault();
    let orderObj = 
    {
        "data": {
          "user": {
            "name": customerName.value,
            "tel": customerPhone.value,
            "email": customerEmail.value ,
            "address": customerAddress.value,
            "payment": tradeWay.value
          }
        }
      };
    console.log(orderObj)
    if(cartData.length === 0){
        alert("購物車空空der")
    };

    
    if(e.target.getAttribute("class") == "orderInfo-btn"){
        console.log("送出資料");
        validForm();
        createOrder(orderObj);
        
               
    }
});
function clearForm(){
    // 清除表單資訊
    customerName.value =="" 
    customerPhone.value =="" 
    customerEmail.value ==""  
    customerAddress.value ==""  
    tradeWay.value =="";
    
  

}
// 送出購買訂單 (表單取值，送出的物件再取表單值的時候裝成一個物件格式)
function createOrder(orderObj){
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, orderObj
    )
    .then(function(response){
        console.log(response.data);
        alert("訂單建立成功");
        clearForm();
        getCartList()

    })
    .catch(function(error){
        alert(error.response.data.message);
    })
};

// 工具類function
function toThousands(x){
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".")
}





init();

