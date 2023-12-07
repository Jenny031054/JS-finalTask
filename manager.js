
//用在圓餅圖上的物件，在renderOrders()就組好了
let productObj = {};
// 渲染圓餅圖表
function renderC3(){
    
    let newColumnsArr = Object.keys(productObj);
    let newColumnsType = [];
    let newColors = {};
    newColumnsArr.forEach((i)=>{
        let itemArr = [];
        itemArr.push(i);
        itemArr.push(productObj[i]);
        console.log(itemArr);
        newColumnsType.push(itemArr)
    })
    console.log(newColumnsArr);
    console.log(newColumnsType);
    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newColumnsType
            // colors:{
            //     "Louvre 雙人床架":"#DACBFF",
            //     "Antony 雙人床架":"#9D7FEA",
            //     "Anty 雙人床架": "#5434A7",
            //     "其他": "#301E5F",
            // }
        },
    });

}


// 管理者部分 
// 取得訂單列表(管理者)
let ordersData = [];
function getOrderList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          'Authorization': token
        }
      }
    )
    .then(function(response){
        
        ordersData = response.data.orders;
        console.log(ordersData);
        renderOrders(ordersData)
    })
    .catch(function(error){
        console.log(error);
    })
};
function init(){
    getOrderList();
    renderC3();
}


//渲染訂單畫面
const orderPageBody = document.querySelector(".orderPage-body");
console.log(orderPageBody);

function renderOrders(){
  let str="";
  
  ordersData.forEach((i)=>{
    // 組好訂單日期
    let orderTime = new Date(i.createdAt*1000);
    console.dir(orderTime)
    let newOrderTime =`${orderTime.getFullYear()}/${orderTime.getMonth()+1}/${orderTime.getDate()}`

    // 組好訂單品項內容
    let productStr = "";
    // 組好一個大物件裝所有購買品項的名稱與數量 productObj = {"名稱":數量,}
    
     i.products.forEach((productItem)=>{
        productStr+= `<p>${productItem.title
        } X ${productItem.quantity}</p>`;
        // 判斷裡面有沒有這個品項
        if(productObj[productItem.category] == undefined){
            console.log("新來的");
            productObj[productItem.category] = productItem.quantity*productItem.price
        }else{
            productObj[productItem.category] += productItem.quantity*productItem.price
        }
        
     });
    
     console.log(productObj);

    // 組好訂單狀態
    let orderStatus = "";
    if(i.paid == true){
        orderStatus = "已處理"
    }else{
        orderStatus = "未處理"
    };
    console.log(i.paid)
    // 整條訂單資訊
     str += 
    `
    <tr>
        <td>${i.id}</td>
        <td>
        <p>${i.user.name}</p>
        <p>${i.user.tel}</p>
        </td>
        <td>${i.user.address
        }</td>
        <td>${i.user.email
        }</td>
        <td>
        <p>${productStr}</p>
        </td>
        <td>${newOrderTime}</td>
        <td class="orderStatus">
        <a href="#" class="jsOrderStatusBtn" data-status="${i.paid}"  data-id="${i.id}">${orderStatus}</a>
        </td>
        <td>
        <input type="button" class="jsOrderDelBtn delSingleOrder-Btn" value="刪除" data-id="${i.id}">
        </td>
    </tr>
    `;

  });
  orderPageBody.innerHTML = str;
  renderC3();
  
};
orderPageBody.addEventListener('click',(e)=>{
    e.preventDefault()
    const eTarget = e.target.getAttribute("class");
    console.log(eTarget);
    if(eTarget.includes("jsOrderDelBtn")){
        console.log("刪除訂單");
        let delOrderId = e.target.dataset.id;
        console.log(delOrderId);
        deleteOrder(delOrderId)
    }else if(eTarget.includes("jsOrderStatusBtn")){
        
        let status = e.target.dataset.status;
        let putStatusId = e.target.dataset.id;
        console.log("看狀態",status)
        putOrderStatus(status,putStatusId);

    }

})

// 刪除全部訂單(管理者)
function deleteAllOrder() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        console.log(response.data);
        getOrderList();
        renderC3();
      })
  };

// 修改訂單狀態
function putOrderStatus(status,putStatusId){
    console.log(status,putStatusId);
    status = Boolean(status);
    let newStatus ;
    if(status == true){
        newStatus = false
    }else{
        newStatus = true
    };
    console.log(newStatus)
    // put(網址,自訂data,headers)
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    //
    {
        "data": {
          "id":putStatusId,
          "paid":newStatus
        }
    },
    {
        headers:{
            'Authorization':token
        }
    }
    
    )
    .then(function(res){
        console.log(res.data);
        alert("成功修改訂單");
        getOrderList();
    })
    .catch(function (error) {
        console.log(error);
        
      })
}
// 刪除指定訂單(管理者)

function deleteOrder(orderId){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
        headers:{
            'Authorization':token
        }
    }
    )
    .then(function (response) {
        console.log(response.data);
        getOrderList();
        renderC3();
      })
    .catch(function (error) {
        console.log(error);
        
      })

}

init()