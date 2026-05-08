import { PRODUCTS, getCategories } from "../../../data/data";  //importa de data los productos y de getCategories las catageorias

const container = document.getElementById("products");  //busca

const searchInput = document.getElementById("search") as HTMLInputElement;  //busca el input de búsqueda en el HTML
const categoriesContainer = document.getElementById("categories")           //busca el contenedor donde vamos a mostrar las categorías


const categories = getCategories();                   //obtiene las categorías desde data.ts

if (categoriesContainer) {                            //si el contenedor existe, mostramos las categorías
  
  const allButton = document.createElement("button"); //botón para mostrar todos los productos
  allButton.textContent = "Todos";

  allButton.addEventListener("click", () => {         //evento click muestra "todos" por medio de la función
    renderProducts(PRODUCTS);
  });

  categoriesContainer.appendChild(allButton);         //agrega el botón "Todos" dentro del contenedor de categorías

  categories.forEach((category: any) => {             //recorre las categorías

    const button = document.createElement("button");  //crea cada botón

    button.textContent = category.nombre;             //nombra el botron con el nombre de la categoría
    
    button.addEventListener("click", () => {          //evento click para filtrar por categoría

      const filtrados = PRODUCTS.filter(product =>                //recorre todos los productos y deja los que cumplen con la condición
        product.categorias.some(cat => cat.id === category.id)    //condición
      );

      renderProducts(filtrados);              //muestra con la función
    });

    categoriesContainer.appendChild(button);    //agregamos el botón de la categoría al HTML
  });
}

searchInput.addEventListener("input", () => {   //escucha cuando el usuario escribe en el input

  const texto = searchInput.value.toLowerCase();  //obtiene el texto que escribió el usuario

  const filtrados = PRODUCTS.filter(product =>    //filtra el producto según el nombre
    product.nombre.toLowerCase().includes(texto)
  );

  renderProducts(filtrados);                      //mostramos los productos filtrados
});

//función que recibe una lista de productos y los muestra en pantalla
function renderProducts(products: typeof PRODUCTS) {

  if (container) {        //verifica que el contenedor exista en el HTML
    container.innerHTML = "";       //limpia el contenido previo para evitar duplicados
                                    //esto es clave cuando usamos filtros o búsqueda
    if (products.length === 0) {    //si no hay producto muestra mensaje
      container.innerHTML = "<p>No se encontraron productos.</p>";
      return;                       //corta la función evitando que se siga ejecutando el forEach
    }

    products.forEach(product => {   //recorre la lista de productos recibida      
      const item = document.createElement("div");   //crea un elemento <div> para cada producto      
      
      item.innerHTML = `
         <img 
        src="/src/assets/images/${product.imagen}" 
        alt="${product.nombre}"
        />
        <h3>${product.nombre}</h3>
        <p>$${product.precio}</p>
        <button class="add-to-cart" data-id="${product.id}">
          Agregar al carrito
        </button>
      `;      //inserta el contenido dinámico del producto usando datos reales provenientes de data.ts
      
      container.appendChild(item);    //agrega el producto al contenedor principal
      
      const button = item.querySelector<HTMLButtonElement>(".add-to-cart"); //busca el botón dentro del producto recién creado
      
      button?.addEventListener("click", () => {   //escucha el evento click para agregar al carrito
        
        addToCart(product.id);  //llama a la función que maneja el carrito y le pasamos el id del producto seleccionado
      });
    });
  }
}

//llama a la función al cargar la página para mostrar todos los productos inicialmente
renderProducts(PRODUCTS);


function addToCart(id: number) {                    //Traigo el carrito del localStorage (si no existe, arranca vacío)
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existing = cart.find((item: any) => item.id === id);

  if (existing) {                       //Busco si el producto ya está en el carrito
    existing.cantidad += 1;             //Si existe → aumento cantidad
  } else {
    cart.push({ id: id, cantidad: 1 }); //Si no existe → lo agrego con cantidad 1
  }

  localStorage.setItem("cart", JSON.stringify(cart)); //Guardo el carrito actualizado

  console.log("Carrito actualizado:", cart);
}