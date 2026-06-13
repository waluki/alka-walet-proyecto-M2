$(document).ready(function() {
    //Animación de entrada suave para simular la carga de una App nativa
    $('#welcome-content').fadeIn(1000);

    // Evento de clic con animación de transición hacia el login
    $('#btn-iniciar-bienvenida').click(function(e) {
        e.preventDefault();
        
        // Desvanecer la pantalla actual antes de cambiar de página para que se vea fino
        $('#welcome-content').fadeOut(400, function() {
            // Asumiendo la estructura de carpetas estándar del proyecto final
            window.location.href = 'login.html'; 
        });
    });
});