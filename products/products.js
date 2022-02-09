const fs = require('fs')

class Products{
    constructor(filename='products.json'){
        this.id = 0 
        this.list = []
        this.filename = filename
        this.init()
    }
    init(){
        try{
            console.log(`Loading ${this.filename}`)
            const data = fs.readFileSync(this.filename)
            const fileData = JSON.parse(data)
            for( const obj of fileData) {
                this.insert(obj)
            }
            console.log('file loaded.')
        }
        catch(err){
            console.log(`Ocurrio un error al incializar ${this.filename}, ${err}`)
        }
    }
    find(id){
        let element = this.list.find(obj => obj.id == id)
        return element != undefined ? element : null
    }
    insert(obj){
        try{
            obj.id = ++this.id
            this.list.push(obj)
            return obj
        }
        catch(err){
            console.log(`ocurrio un error al insertar un objeto ${err}`)
        }
    }
    update(id, obj){
        try{
            const index = this.list.findIndex((objT) => objT.id == id)
            obj.id = this.list[index].id
            this.list[index] = obj
            return obj
        }
        catch(err){
            console.log(`hubo un error al actualizar el archivo ${err}`)
        }
    }
    deleteById(id){
        try{
            const index = this.list.findIndex((obj) => obj.id == id)
            if(index != -1){
                this.list.splice(index, 1)
                return `se borro el item con id ${id}`
            }
            else return null
        }
        catch(err){
            console.log(`Ocurrio un error al borrar el elemento con id ${id}, ${err}`)
        }
    }
}

module.exports = Products