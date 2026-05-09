import { PRODUCTS, getCategories } from "../../../data/data";  //importa de data los productos y con getCategories las catageorias

const container = document.getElementById("products");  //busca el contenedor

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
    const button = document.createElement("button");  //crea cada botón de cada categoría
    button.textContent = category.nombre;             //nombra el botron con el nombre de la categoría
    button.addEventListener("click", () => {          //evento click para filtrar por categoría

      const filtrados = PRODUCTS.filter(product =>                //recorre todos los productos y deja los que cumplen con la condición
        product.categorias.some(cat => cat.id === category.id)    //condición
      );

      renderProducts(filtrados);              //muestra con la función los productos filtrados
    });

    categoriesContainer.appendChild(button);    //agregamos el botón de la categoría al HTML
  });
}

searchInput.addEventListener("input", () => {   //escucha cuando el usuario escribe en el input buscador
  const texto = searchInput.value.toLowerCase();  //obtiene el texto que escribió el usuario, pasa a minúsculas

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
      const item = document.createElement("div");   //crea un elemento html para cada producto      
      
      item.innerHTML = `
         <img 
        src="/src/assets/images/${product.imagen}" 
        alt="${product.nombre}"
        />
        <h3>${product.nombre}</h3>
        <p>${product.descripcion}</p>
        <p>$${product.precio}</p>
        <button class="add-to-cart" data-id="${product.id}">
          Agregar al carrito
        </button>
      `;      //inserta el contenido dinámico del producto usando datos reales provenientes de data.ts
      
      container.appendChild(item);    //agrega el producto al contenedor principal
      
      const button = item.querySelector<HTMLButtonElement>(".add-to-cart"); //busca el botón "Agregar al carrito" dentro del producto creado
      
      button?.addEventListener("click", () => {   //escucha el evento click para agregar al carrito
        
        addToCart(product.id);  //llama a la función para agregar el producto al carrito
      });
    });
  }
}

//muestra todos los productos automáticamente al cargar la página
renderProducts(PRODUCTS);


//funcion para agregar productos al carrito utilizando localStorage
function addToCart(id: number) {        //Trae el carrito del localStorage
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");  //obtiene el carrito guardado en localStorage o crea un array vacío si no existe

  const existing = cart.find((item: any) => item.id === id);  //busca si el producto seleccionado ya existe dentro del carrito

  if (existing) {
    existing.cantidad += 1;             //Si existe → aumento cantidad
  } else {
    cart.push({ id: id, cantidad: 1 }); //Si no existe → lo agrego con cantidad 1
  }

  localStorage.setItem("cart", JSON.stringify(cart)); //Guardo el carrito actualizado en el localStorage

  console.log("Carrito actualizado:", cart);  //muestra en consola el estado actualizado del carrito
}