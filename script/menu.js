$(document).ready(function() {
    // Cargar y formatear saldo desde Local Storage con jQuery
    const saldoGuardado = localStorage.getItem('saldoCuenta') || 100000;
    const saldoFormateado = parseInt(saldoGuardado).toLocaleString('es-CL');
    $('#saldo').val(`$${saldoFormateado} CLP`);

    // Capturar clics en los botones del menú usando su clase común
    $('.btn-menu').click(function() {
        const nombrePantalla = $(this).attr('data-pantalla');
        const urlDestino = $(this).attr('data-url'); // Asegúrate que en tu HTML apunte a '../HTML/archivo.html'

        // Mostrar leyenda exacta solicitada
        $('#mensaje-redireccion').text(`Redirigiendo a "${nombrePantalla.toLowerCase()}"...`);

        $('.btn-menu').prop('disabled', true);

        setTimeout(() => {
            window.location.href = urlDestino;
        }, 1200);
    });
});