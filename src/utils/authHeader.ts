export function cargarHeaderUsuario(): void {
    const liNombre = document.getElementById("user-name");
    const btnCerrar = document.getElementById("btn-logout") as HTMLButtonElement | null;

    // Botones para admin
    const liAdmin = document.getElementById("btn-admin") as HTMLElement | null;
    const btnAdmin = document.getElementById("go-admin") as HTMLButtonElement | null;

    if (!liNombre || !btnCerrar) return;

    const userData = localStorage.getItem("usuario");

    if (userData) {
        const usuario = JSON.parse(userData);

        liNombre.textContent = `${usuario.nombre} ${usuario.apellido}`;
        btnCerrar.style.display = "block";

        if (usuario.rol?.toUpperCase() === "ADMIN") {
            if (liAdmin) liAdmin.style.display = "block";
        } else {
            if (liAdmin) liAdmin.style.display = "none";
        }

    } else {
        liNombre.textContent = "Invitado";
        btnCerrar.style.display = "none";
        if (liAdmin) liAdmin.style.display = "none";
    }

    btnAdmin?.addEventListener("click", () => {
        window.location.href = "/src/pages/admin/adminHome/adminHome.html";
    });
}

export function cerrarSesion(): void {
    localStorage.removeItem("usuario");
    window.location.href = "/src/pages/login/login.html";
}
