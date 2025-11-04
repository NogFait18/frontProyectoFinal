import type { ICategoria } from "../types/ICategoria";
import type { IUser, IUserLogin } from "../types/IUser";

// importacion de la URL para no repetir codigo, desde .ENV
const API_URL = `${import.meta.env.VITE_URL_API}/usuario`;

//        ENPOINTS USUARIOS
//        ENPOINTS USUARIOS

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
  const response = await fetch(`${API_URL}`, {
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
  const response = await fetch(`${API_URL}/login`, {
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


//        ENPOINTS CATEGORIAS
//        ENPOINTS CATEGORIAS

export const crearCategoria = async(data:ICategoria)=>{
  const response = await fetch(`${API_URL}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  const result = await response.text();
  console.log(result);
  return result;
}