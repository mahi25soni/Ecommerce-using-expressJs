function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
  }
  
const csrftoken = getCookie('csrftoken');

let buttons= Array.from(document.getElementsByClassName('about-quantity'))
buttons.forEach(element =>{
    element.addEventListener('click',()=>{
        id = element.getAttribute('id')
        value = element.getAttribute('value')
        addtocart(id, value)
        
    })
})

function addtocart(id , value)
{
    console.log("indide the function")
    data = {'value':value}
    fetch(
        url=`/addtocart/${id}/`,{
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body : JSON.stringify(data)
        }  
        )
        .then((res) => res.json()) // Call res.json() to parse the response as JSON
        .then((data) => {
      console.log(data.count);
            changeTheCart(data.count)
    })
    .catch((err) => console.log(err));
    
}

function changeTheCart(count) {
    const something = document.getElementById("cart-total")
    something.innerHTML = count
}


