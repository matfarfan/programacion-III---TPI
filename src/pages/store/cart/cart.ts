import { PRODUCTS } from "../../../data/data";          //Importamos los productos

const cartContainer = document.getElementById("cart-container");    //busca el contenedor del HTML donde se va a mostrar el carrito



const cart = JSON.parse(localStorage.getItem("cart") || "[]");  //trae el carrito guardado en localStorage.
                                                                //si no existe, usamos un array vacío.
console.log("Carrito guardado:", cart);

if (cartContainer) {                //si el contenedor existe avanza
  if (cart.lenght === 0) {        //si esta vacio muestra mensaje
    cartContainer.innerHTML = "<p>El carrito está vacío.</p>";
  } else {
    let total = 0;              //variable para acumular el total de la compra
    cart.forEach((cartItem: any) => {           //recorre cada item guardado en el carrito
      const product = PRODUCTS.find(product => product.id === cartItem.id);  //busca el producto completo usando el id guardado

      if (product) {                                      //si el producto existe, lo muestra, para evitar errores
                
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


        cartContainer.appendChild(item);                //agrega el producto al contenedor principal
      }
    });

    const clearButton = document.createElement("button");   //botón para vaciar el carrito
    clearButton.textContent = "Vaciar carrito";             //texto que se muestra
    clearButton.addEventListener("click", clearCart);       //evento click para eliminar el carrito
    cartContainer.appendChild(clearButton);                 //agrega el botón al contenedor del carrito para que sea visible en pantalla
        
    const totalElement = document.createElement("h2");      //crea elemento para mostrar el total
    totalElement.textContent = `Total: $${total}`;          //muestra el total acumulado
    cartContainer.appendChild(totalElement);                //lo agrega al final del carrito
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

function saveCart(updatedCart: any[]) {                     //guarda el carrito actualizado
  localStorage.setItem("cart", JSON.stringify(updatedCart));//
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

function decreaseQuantity(id: number) {                     //función que aumenta en 1 la cantidad
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
  localStorage.removeItem("cart");
  location.reload();
}