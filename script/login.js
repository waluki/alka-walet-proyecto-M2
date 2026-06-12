const CREDENCIALES_VALIDAS = {
    email: "usuario@bootcamp.com",
    password: "password123"
};

$(document).ready(function() {
    // Manejo del envío del formulario con jQuery
    $('#loginForm').submit(function(event) {
        event.preventDefault();

        // Obtener valores usando selectores de jQuery
        const emailIngresado = $('#email').val().trim();
        const passwordIngresada = $('#password').val();

        if (emailIngresado === CREDENCIALES_VALIDAS.email && passwordIngresada === CREDENCIALES_VALIDAS.password) {
            // Alerta de éxito de Bootstrap inyectada con jQuery
            $('#mensaje').html(`<div class="alert alert-success text-center">¡Inicio de sesión correcto! Redirigiendo...</div>`);
            
            setTimeout(() => {
                // Redirección requerida por la consigna
                window.location.href = 'menu.html';
            }, 1500);
        } else {
            // Alerta de error de Bootstrap
            $('#mensaje').html(`<div class="alert alert-danger text-center">Credenciales incorrectas. Inténtalo de nuevo.</div>`);
        }
    });
});