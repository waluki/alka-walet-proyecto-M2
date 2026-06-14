// JavaScript: Estructura de datos estricta para validación de credenciales (Lección 5)
const CREDENCIALES_VALIDAS = {
    email: "usuario@bootcamp.com",
    password: "password123"
};

$(document).ready(function() {
    // jQuery: Transición de entrada suave para la interfaz (Lección 6)
    $('#login-container').fadeIn(800);

    // jQuery: Manejo optimizado del evento submit del formulario
    $('#loginForm').submit(function(event) {
        event.preventDefault();

        // Deshabilitar temporalmente el botón para prevenir doble envío involuntario
        const btnSubmit = $('#btn-submit-login');
        btnSubmit.prop('disabled', true);

        // jQuery: Selectores dinámicos para capturar los valores de los inputs
        const emailIngresado = $('#email').val().trim();
        const passwordIngresada = $('#password').val();

        // JavaScript: Lógica de validación condicional de identidad (Lección 5)
        if (emailIngresado === CREDENCIALES_VALIDAS.email && passwordIngresada === CREDENCIALES_VALIDAS.password) {
            
            // jQuery: Inyección de alertas dinámicas con diseño exitoso de Bootstrap
            $('#mensaje').html(`
                <div class="alert alert-success d-flex align-items-center gap-2 text-start border-0 shadow-sm" style="background-color: rgba(40, 167, 69, 0.15); color: #2cd46e;">
                    <i class="bi bi-check-circle-fill fs-5"></i>
                    <div><strong>Acceso concedido.</strong> Iniciando pasarela segura...</div>
                </div>
            `);
            
            // jQuery: Efecto visual de desvanecimiento hacia afuera de la tarjeta antes de la redirección (Lección 6)
            setTimeout(() => {
                $('#login-container').fadeOut(400, function() {
                    window.location.href = 'menu.html';
                });
            }, 1600);

        } else {
            // jQuery: Inyección dinámica de alerta de error con diseño Bootstrap
            $('#mensaje').html(`
                <div class="alert alert-danger d-flex align-items-center gap-2 text-start border-0 shadow-sm animate-shake" style="background-color: rgba(220, 53, 69, 0.15); color: #ff6b6b;">
                    <i class="bi bi-exclamation-triangle-fill fs-5"></i>
                    <div><strong>Error de autenticación.</strong> Email o contraseña incorrectos.</div>
                </div>
            `);

            // Reactivar el botón para permitirle al usuario intentar de nuevo
            btnSubmit.prop('disabled', false);
        }
    });
});