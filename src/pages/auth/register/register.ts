import { registrarUsuario } from "../../../utils/api";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const nombre = document.getElementById('nombre') as HTMLInputElement
const apellido = document.getElementById('apellido') as HTMLInputElement
const email = document.getElementById('email') as HTMLInputElement
const celular = document.getElementById('celular') as HTMLInputElement
const contrasenia = document.getElementById('contrasenia') as HTMLInputElement
//const btn = document.getElementById('button_register')
const form = document.querySelector(".form") as HTMLFormElement;

// Función para mostrar toast
const showToast = (mensaje: string, color: string = "#333") => {
  Toastify({
  text: mensaje,
  duration: 2500,
  gravity: "top",
  position: "right",
  close: true,
  style: {
    background: color,
    height: "40px",      // altura fija
    minHeight: "40px",   // evita que se estire
    padding: "0 10px",   // reduce espacio vertical
    fontSize: "14px",    // tamaño de texto más pequeño
    display: "flex",
    alignItems: "center",
    color:"black" // centra el texto verticalmente
  },
}).showToast();
};

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: nombre.value.trim(),
    apellido: apellido.value.trim(),
    email: email.value.trim(),
    celular: celular.value.trim(),
    contrasenia: contrasenia.value.trim(),
  };

  // Validación de campos
  if (!data.nombre || !data.apellido || !data.email || !data.celular || !data.contrasenia) {
    return;
  }

  try {
    // Llamada al fetchPost exportado
    const response = await registrarUsuario(data); // ✅ ya exportado y configurado
    console.log("Usuario registrado:", response);

    showToast("Usuario registrado correctamente", "#f7f7f7f7");

    // Redirigir después de mostrar el toast
    setTimeout(() => {
      window.location.href = "./src/pages/auth/login/login.html";
    }, 1500);
  } catch (error) {
    console.error("Error al registrar:", error);
    showToast("Error al registrar usuario", "#bf4c49");
  }
});
