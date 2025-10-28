//import { fetchGet } from "../../../utils/api";
import { registrarUsuario } from "../../../utils/api";

const nombre = document.getElementById('nombre') as HTMLInputElement
const apellido = document.getElementById('apellido') as HTMLInputElement
const email = document.getElementById('email') as HTMLInputElement
const celular = document.getElementById('celular') as HTMLInputElement
const contrasenia = document.getElementById('contrasenia') as HTMLInputElement
//const btn = document.getElementById('button_register')
const form = document.querySelector(".form") as HTMLFormElement;





form?.addEventListener("submit", async (e) => {
  // Evita que se recargue el formulario

    e.preventDefault();

  // Crear el objeto con los valores de los inputs
  const data = {
    nombre: nombre.value.trim(),
    apellido: apellido.value.trim(),
    email: email.value.trim(),
    celular: celular.value.trim(),
    contrasenia: contrasenia.value.trim(),
  };

  // Validación: si falta algún dato, mostrar alerta y salir
  if (!data.nombre || !data.apellido || !data.email || !data.celular || !data.contrasenia) {
    return; // ⚠️ No continúa ni hace fetch ni redirección
  }

  try {
    // Llamada al registrarUsuario exportado
    const response = await registrarUsuario(data); // ✅ ya exportado y configurado
    console.log("Usuario registrado:", response);

    // Redirigir solo si todo salió bien
    window.location.href = "./src/pages/auth/login/login.html";
  } catch (error) {
    console.error("Error al registrar:", error);
    alert("Ocurrió un error al registrar el usuario.");
  }
});

