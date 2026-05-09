import { PRODUCTS } from "../../../data/data";          //Importamos los productos

const cartContainer = document.getElementById("cart-container");    //busca el contenedor del HTML donde se va a mostrar el carrito



const cart = JSON.parse(localStorage.getItem("cart") || "[]");  //trae el carrito guardado en localStorage.
                                                                //si no existe, usamos un array vacío.
console.log("Carrito guardado:", cart);

if (cartContainer) {                //si el contenedor existe avanza
  if (cart.length === 0) {        //si esta vacio muestra mensaje
    cartContainer.innerHTML = "<p>El carrito está vacío.</p>";
  } else {
    let total = 0;              //variable para acumular el total de la compra
    cart.forEach((cartItem: any) => {           //recorre cada item guardado en el carrito
      const product = PRODUCTS.find(product => product.id === cartItem.id);  //busca el producto completo usando el id guardado

      if (product) {                                      //si el producto existe, lo muestra
                
        total += product.precio * cartItem.cantidad;    //calcula el subtotal y lo sumamos al total
                
        const item = document.createElement("div");     //crea contenedor html para el producto

        item.innerHTML = `
          <img 
            src="/src/assets/images/${product.imagen}" 
            alt="${product.nombre}"
          />
          <h3>${product.nombre}</h3>
          <p>Precio: $${product.precio}</p>
          <p>Cantidad: ${cartItem.cantidad}</p>

          <div class="cart-actions">
            <button class="increase" data-id="${product.id}">+</button>
            <button class="decrease" data-id="${product.id}">-</button>
            <button class="remove" data-id="${product.id}">Eliminar</button>
        </div>
        `;     //inserta mezclando datos del producto y del carrito y agrega botones + - eliminar


        cartContainer.appendChild(item);                //agrega el producto al contenedor principal del carrito
      }
    });

    const totalContainer = document.getElementById("cart-total"); //busca el contenedor del resumen donde se muestra el total

    if (totalContainer) {             //muestra el total acumulado dentro del panel resumen
      totalContainer.textContent = `Total: $${total}`;
    }
  }
}

cartContainer?.addEventListener("click", (event) => {       //escucha los clicks dentro del contenedor del carrito
  const target = event.target as HTMLElement;             //guarda el elemento exacto donde el usuario hizo click

  const id = Number(target.dataset.id);                   //obtiene el id del producto desde data-id y lo convierte a número

  if (target.classList.contains("increase")) {            //aumenta
    increaseQuantity(id);
  }

  if (target.classList.contains("decrease")) {            //disminuye
    decreaseQuantity(id);
  }

  if (target.classList.contains("remove")) {              //elimina
    removeProduct(id);
  }
});

const clearCartButton = document.getElementById("clear-cart");  //busca el botón para vaciar todo el carrito
clearCartButton?.addEventListener("click", clearCart);          //si existe, le asigna el evento para limpiar el carrito




function saveCart(updatedCart: any[]) {                     //guarda el carrito actualizado
  localStorage.setItem("cart", JSON.stringify(updatedCart));//convierte a texto para poder guardarlo
  location.reload();                                        //recarga la página
}

function increaseQuantity(id: number) {                     //función que aumenta en 1 la cantidad
  const updatedCart = cart.map((item: any) => {             //recorre el carrito y devuelve un nuevo array actualizado
    if (item.id === id) {                                   //si lo encuentra copia y lo aumenta
      return { ...item, cantidad: item.cantidad + 1 };
    }
    return item;                                            //sino lo devuele igual
  });
  saveCart(updatedCart);                                    //guarda el carrito actualizado
}

function decreaseQuantity(id: number) {                     //función que disminuye en 1 la cantidad
  const updatedCart = cart
    .map((item: any) => {                                   //primero recorre el carrito para restar cantidad
      if (item.id === id) {                                 //si lo encuentra copia y disminuye
        return { ...item, cantidad: item.cantidad - 1 };
      }
      return item;                                          //sino lo devuele igual
    })
    .filter((item: any) => item.cantidad > 0);              //elimina el producto si queda en 0
  saveCart(updatedCart);                                    //guarda el carrito actualizado
}

function removeProduct(id: number) {                        //función que elimina completamente un producto del carrito
  const updatedCart = cart.filter((item: any) => item.id !== id);
                                                    //crea un nuevo carrito dejando afuera el producto cuyo id coincide
  saveCart(updatedCart);                                    //guarda el carrito actualizado
}

function clearCart() {                                      //función que limpia el carrito
  localStorage.removeItem("cart");                          //elimina el carrito guardado en localStorage
  location.reload();                                        //recarga la página para actualizar la vista
}