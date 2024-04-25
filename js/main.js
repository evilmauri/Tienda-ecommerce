let productos = [];

fetch("https://tiendae-commerce-213e1-default-rtdb.firebaseio.com/")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })
    //importamos nuestro json desde nustra api
//Generamos un contenedor para el DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
/*se puede agregar solo si lo necesitamos*/
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))

function cargarProductos(productosElegidos){
    
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img  class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    })
    //mantenemos siempre el boton actualizado en caso de que se agregue otro producto
    actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if(e.currentTarget.id != "todos"){
        const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
        tituloPrincipal.innerText= productoCategoria.categoria.nombre;
        const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
        cargarProductos(productosBoton);
        }else{
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    })
});

//cada vez que se ejecute cargar productos se asigna del dom para agregarlo
function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}
//array
let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");


if(productosEnCarritoLS){
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
}else{
    productosEnCarrito = [];
}
//agregamos un producto al array
function agregarAlCarrito(e){

    Toastify({
        text: "Agregado al Carrito",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
        background: "linear-gradient(to right, #337da8, #110833)",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: "1rem"
        },
        offset: {
            x: '1.5rem',//horizontal
            y: '1.5rem' //vertical
        },
        onClick: function(){} // Callback after click
    }).showToast();
    
    const idBoton = e.currentTarget.id;
    //creamos el producto agregado
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    //si devuelve true agregar contador
    if(productosEnCarrito.some(producto => producto.id === idBoton)){
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    actualizarNumerito();

    //lo agregamos al localStorage
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}



function actualizarNumerito(){
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}