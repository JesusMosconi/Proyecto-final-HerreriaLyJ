//VARIABLES
const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const cartas = document.getElementById("template-card").content
const fragment = document.createDocumentFragment()
const carritoTemplate = document.getElementById("template-carrito").content
const footerTemplate = document.getElementById("template-footer").content
const URL = "productos.json"
let carrito = {}


// AGREGAR PRODUCTOS
document.addEventListener("DOMContentLoaded", () => {
    agregarProductos()
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        pintarCarrito()
    }
})

const agregarProductos = async () => {
    try {
        const response = await fetch(URL)
        const data = await response.json()
        pintarCartas(data)
    } catch (error) {
        console.log(error)
    }
}

// PINTAR LAS CARTAS
const pintarCartas = data => {
    data.forEach(producto => {
        cartas.querySelector("h5").textContent = producto.nombre
        cartas.querySelector("p").textContent = producto.precio
        cartas.querySelector("img").setAttribute("src", producto.img)
        cartas.querySelector(".btn").dataset.id = producto.id

        const clonar = cartas.cloneNode(true)
        fragment.appendChild(clonar)
    })
    cards.appendChild(fragment)
}
//AGREGAR AL CARRITO
cards.addEventListener("click", e => {
    agregarAlCarrito(e)
})

const agregarAlCarrito = e => {
    if (e.target.classList.contains("btn-primary")) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    console.log(objeto)
    const producto = {
        id: objeto.querySelector(".btn-primary").dataset.id,
        nombre: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ""
    Object.values(carrito).forEach(producto => {
        carritoTemplate.querySelector("th").textContent = producto.id
        carritoTemplate.querySelectorAll("td")[0].textContent = producto.nombre
        carritoTemplate.querySelectorAll("td")[1].textContent = producto.cantidad
        carritoTemplate.querySelector(".btn-success").dataset.id = producto.id
        carritoTemplate.querySelector(".btn-danger").dataset.id = producto.id
        carritoTemplate.querySelector("span").textContent = producto.cantidad * producto.precio

        const clonar = carritoTemplate.cloneNode(true)
        fragment.appendChild(clonar)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem("carrito", JSON.stringify(carrito))
}

//FOOTER
const pintarFooter = () => {
    footer.innerHTML = ""
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío</th>`
    }
    else {
        const cantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
        const precio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

        footerTemplate.querySelectorAll("td")[0].textContent = cantidad
        footerTemplate.querySelector("span").textContent = precio

        const clonar = footerTemplate.cloneNode(true)
        fragment.appendChild(clonar)
        footer.appendChild(fragment)
        // BOTON VACIAR CARRITO
        const vaciarCarrito = document.getElementById("vaciarCarrito")
        vaciarCarrito.addEventListener("click", () => {
            carrito = {}
            pintarCarrito()
        })
    }
}


//AUMENTAR REDUCIR CANTIDAD
items.addEventListener("click", e => {
    boton(e)
})
//AUMENTAR
const boton = e => {
    if (e.target.classList.contains("btn-success")) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }
//DISMINUIR
    if (e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}


//BOTON DE COMPRAR CON ANIMACION

const btnComprar = document.getElementById("comprar")
btnComprar.addEventListener("click", () => alertSwAl())

const alertSwAl = () => {
    if(Object.keys(carrito).length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No has seleccionado nada para comprar..',
            footer: '<p>Agrega algo al carrito!</p>'
          })
    }
    else{
        Swal.fire({
            title: 'Confirmar compra',
            text: "Estas seguro que quieres comprar estos productos?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, comprar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Listo!',
                'Tu producto ha sido comprado con exito',
                'success'
              )
            }
          })
    }
}

