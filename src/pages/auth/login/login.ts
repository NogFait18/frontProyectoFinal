import {logearUsuario} from "../../../utils/api";

const email = document.getElementById("mail") as HTMLInputElement;
const contrasenia = document.getElementById("pass") as HTMLInputElement;
// const btn = document.querySelector(".form_button") as HTMLButtonElement;
const form = document.querySelector(".form") as HTMLFormElement;

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

        // Redirigir solo si todo salió bien
        window.location.href = "../../home.html";
    } catch (error) {
        console.error("Error al registrar:", error);
        alert("Ocurrió un error al registrar el usuario.");
    }
});
