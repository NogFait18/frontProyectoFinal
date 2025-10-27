import type { IUser, IUserLogin } from "../types/IUser";


/* Metodo Get */

const fetchUrl: string = "http://localhost:8080/usuario"

/* Metodo Get */
export const fetchGet = async () => {
  const response = await fetch(fetchUrl, { method: "GET" });
  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  const data = await response.json();
  console.log(data);
  return data;
};


/* Metodo Post */
export const fetchPost = async (data: IUser) => {
  const response = await fetch(fetchUrl, {
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

/* Fetch Login Validación */

const urlLogin: string = "http://localhost:8080/usuario/login"

export const fetchPostLogin = async(data:IUserLogin)=>{
  const response = await fetch(urlLogin, {
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