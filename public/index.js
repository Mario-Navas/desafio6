const socket = io.connect();
let products = []

socket.on('products',(data)=>{
    products.push(data)
    render()
})
fetch('api/productos')
    .then( response => response.json())
    .then(data =>{
        products = data
        render()
    })
function render(){
    $('.productContainer').html('')
    for(let item of products){
        $('.productContainer').prepend(
            `
            <tr>
                <td>${item.titulo}</td>
                <td>${item.precio}</td>
                <td>${item.miniatura}</td>
            </tr>
            `
        )
    }
}
$('#myForm').submit(function(e){
    e.preventDefault()
    data = {
        titulo: $('#titulo').val(),
        precio: $('#precio').val(),
        miniatura: $('#miniatura').val()
    }
    socket.emit('new_product', data)
})


//servicio de chat
let username = sessionStorage.getItem('user')
if(!username){
    username = prompt('ingrese nombre de usuario')
}
socket.on('messages', data =>{
    chatRender(data)
})
function chatRender(data){
    data.forEach(info =>{
        $('#messages').append(
            `
                <div>
                    <strong>${info.author}</strong>
                    :<em>${info.text}</em> [${info.time}, ${info.date}]
                </div>
            `
        )
    })
}
$('#myChat').submit(e =>{
    e.preventDefault()
    const message = {
        author: username,
        text: $('#text').val()
    }
    socket.emit('new_message', message)
})