import {logearUsuario} from "../../../utils/api";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";


const email = document.getElementById("mail") as HTMLInputElement;
const contrasenia = document.getElementById("pass") as HTMLInputElement;
// const btn = document.querySelector(".form_button") as HTMLButtonElement;
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
    alignItems: "center", // centra el texto verticalmente
    color:"black"
  },
}).showToast();
};

form?.addEventListener("submit", async (e) => {
    // Evita que se recargue el formulario
    e.preventDefault();
    // Crear el objeto con los valores de los inputs
    const data = {
        email: email.value.trim(),
        contrasenia: contrasenia.value.trim(),
    };
    console.log(data);
    // Validación: si falta algún dato, mostrar alerta y salir
    if (!data.email || !data.contrasenia) {
        return; // ⚠️ No continúa ni hace fetch ni redirección
    }
    console.log(data);

    try {
        // Llamada al fetchPost exportado
        const response = await logearUsuario(data); // ✅ ya exportado y configurado
        console.log("Usuario inicio sesion correctamente:", response);

        // Guardamos el usuario en el localStorage
        localStorage.setItem("usuario", JSON.stringify(response));

        showToast("Inicio de sesión exitoso", "#f7f7f7f7");

        // Redirigir solo si todo salió bien
        setTimeout(()=>{
           // Redirigir después de mostrar el toast
          // window.location.href = "../../store/home.html";
          //window.location.href = "../../admin/adminHome/adminHome.html";
          
          const rol = response.rol?.toUpperCase()
          console.log(rol)
          if (rol === "ADMIN") {
            window.location.href = "../../admin/adminHome/adminHome.html";
          } else {
            window.location.href = "../../store/home.html";
          }

        },1500)
    } catch (error) {
        console.error("Error al iniciar sesion:", error);
        showToast("Error al iniciar sesión", "#bf4c49");
    }
});
