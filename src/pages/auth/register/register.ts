import { fetchGet } from "../../../utils/api";
import { fetchPost } from "../../../utils/api";

const nombre = document.getElementById('nombre') as HTMLInputElement
const apellido = document.getElementById('apellido') as HTMLInputElement
const email = document.getElementById('email') as HTMLInputElement
const celular = document.getElementById('celular') as HTMLInputElement
const contrasenia = document.getElementById('contrasenia') as HTMLInputElement
const btn = document.getElementById('button_register')



btn?.addEventListener("click", async () => {
  // Evita que se recargue el formulario

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
    // Llamada al fetchPost exportado
    const response = await fetchPost(data); // ✅ ya exportado y configurado
    console.log("Usuario registrado:", response);

    // Redirigir solo si todo salió bien
    window.location.href = "./src/pages/auth/login/login.html";
  } catch (error) {
    console.error("Error al registrar:", error);
    alert("Ocurrió un error al registrar el usuario.");
  }
});



fetchGet