
// ---------------------- Modulos ----------------------
const express = require('express')
const { Router } = require('express')
const router = Router()
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
// para cargar productos al uicio
const productos = require('./productos.json');
// para usar los metodos para manejar el arreglo productos
const Container = require('./methods.js')
const file = new Container('./data/products.json')

// Instancias express
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//------ Plantillas
// Se indica la carpeta donde se almacenarán las plantillas 
app.set('views', './views');
// Se indica el motor del plantillas a utilizar
app.set('view engine', 'ejs');

const messages = []


//file.init()
app.use(express.static('./public'))

app.get('/',(req,res) => {
    res.sendFile('index.html', {root: __dirname})
})

router.get('/',(req,res) =>{
    const elements = file.getAll()
    res.send(JSON.stringify(elements))
})

app.post('/guardar', (req, res)=>{
    // obtengo el ultimo id
    let orden = 1;
    for (const producto of Object.keys(productos)) {
        orden += 1;
    }
    // obtiene producto de formulario html
    let producto = {
        Titulo: req.body.titulo,
        Precio: req.body.precio,
        Miniatura: req.body.miniatura,
        Id: orden
    }
    // Agrega producto recibido al array de productos
    productos.push(producto);
    res.redirect('/')
//console.log(productos)

});

io.on('connection', (socket) =>{
    console.log('usuario conectado')
    socket.on('new_product',async (data)=>{
        await file.save(data)
        io.sockets.emit('products', data)
    })
})


io.on('connection', (socket)=>{
    socket.emit('messages', messages)
    socket.on('new_message', data =>{
        data.time = new Date().toLocaleTimeString()
        data.date = new Date().toLocaleDateString()
        messages.push(data)
        io.sockets.emit('messages', [data])
    })

})


app.use('/api/productos', router)

/* ---------------------- Servidor ----------------------*/
const PORT = 8080;
const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})
server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
});
