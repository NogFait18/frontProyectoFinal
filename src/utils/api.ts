import type { IUser, IUserLogin } from "../types/IUser";

// importacion de la URL para no repetir codigo, desde .ENV
const API_URL = `${import.meta.env.VITE_API_URL}/usuario`;

//        ENPOINTS USUARIOS
//        ENPOINTS USUARIOS

/* Metodo Get  para mostrar usuarios*/
export const mostrarUsuarios = fetch(`${API_URL}`,{
  method:"GET",
})
.then((res)=> res.json())
.then((data) => console.log(data))


/* Metodo Post para registrar un usuario */
export const registrarUsuario = async (data: IUser) => {
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
  
  const result = await response.text();
  console.log(result);
  return result;
}


//        ENPOINTS CATEGORIAS
//        ENPOINTS CATEGORIAS








