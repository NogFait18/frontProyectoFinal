import type { ICategoria } from "../types/ICategoria";
import type { IUser, IUserLogin } from "../types/IUser";

// importacion de la URL para no repetir codigo, desde .ENV
const API_URL = `${import.meta.env.VITE_URL_API}`;

//-------------------------------------------------------------------------------------------------------------------------
//        ENPOINTS USUARIOS
//-------------------------------------------------------------------------------------------------------------------------

/* Metodo Get  para mostrar usuarios*/
/* comento este metodo que llama automaticamente al fetch y provoca un error*/

// export const mostrarUsuarios = fetch(`${API_URL}`,{
//   method:"GET",
// })
// .then((res)=> res.json())
// .then((data) => console.log(data))

/* agrego este metodo que lo envuelve en una funcion para ser llamada */
export const mostrarUsuarios = async () => {
  const response = await fetch(`${API_URL}`, { method: "GET" });
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
};






/* Metodo Post para registrar un usuario */
export const registrarUsuario = async (data: IUser) => {

    /* modifico la url, apunta a /login  pero aca estamos registrando*/
  const response = await fetch(`${API_URL}/usuario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  const result = await response.json();
  console.log(result);
  return result;
};


/* Fetch Login Validación metodo para logearse*/
export const logearUsuario = async(data:IUserLogin)=>{
  const response = await fetch(`${API_URL}/usuario/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  // Modifique esta linea!!! cambie response.text a .json
  const result = await response.json();
  console.log(result);
  return result;
}


//-------------------------------------------------------------------------------------------------------------------------
//        ENPOINTS CATEGORIAS
//-------------------------------------------------------------------------------------------------------------------------

export const crearCategoria = async(data:ICategoria)=>{
  const response = await fetch(`${API_URL}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    // Obtenemos el cuerpo del error para ver el mensaje real
      const errorText = await response.text();
      console.error("Error HTTP:", response.status, errorText);
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    
  }
  
  const result = await response.text();
  console.log(result);
  return result;
}


// GET para categorias


export const obtenerCategorias = async () =>{
  try {
    const res = await fetch(`${API_URL}/categorias`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const datos = await res.json();
    return datos;
  } catch (err) {
    console.error('Error al obtener las categorias mediante el fetch: ', err);
    throw err;
  }
}




// PUT para categorias

export const editarCategoria = async (id: number, data: ICategoria) => {
  const response = await fetch(`${API_URL}/categorias/${id}`, {
    method: "PUT", // o PATCH, según tu backend
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
};

// DELETE para eliminar categorias

export const eliminarCategoria = async (id: number) => {
  const response = await fetch(`${API_URL}/categorias/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.text();
  console.log("Categoria eliminada con exito: ", result);
  return result;

}



//-------------------------------------------------------------------------------------------------------------------------
// ENDPOINTS PARA PRODUCTOS
//-------------------------------------------------------------------------------------------------------------------------

//POST para productos

export const crearProducto = async(data:ICategoria)=>{
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    // Obtenemos el cuerpo del error para ver el mensaje real
      const errorText = await response.text();
      console.error("Error HTTP:", response.status, errorText);
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    
  }
  
  const result = await response.text();
  console.log(result);
  return result;
}



// GET para Productos


export const obtenerProductos = async () =>{
  try {
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const datos = await res.json();
    return datos;
  } catch (err) {
    console.error('Error al obtener las categorias mediante el fetch: ', err);
    throw err;
  }
}

// PUT para categorias

export const editarProductos = async (id: number, data: ICategoria) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT", // o PATCH, según tu backend
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
};
