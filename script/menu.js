$(document).ready(function() {
    // jQuery: Efecto visual de entrada suave para refrescar la UX del Panel Principal (Lección 6)
    $('#menu-container').fadeIn(500);

    // JavaScript / LocalStorage: Obtención y parseo de balances de cuenta (Lección 5)
    const saldoGuardado = localStorage.getItem('saldoCuenta') || 100000;
    const historialMovimientos = JSON.parse(localStorage.getItem('historialMovimientos')) || [];

    // jQuery: Pintar dinámicamente el saldo mayor en el componente destacado
    $('#saldo-display').text(`$${parseInt(saldoGuardado).toLocaleString('es-CL')} CLP`);

    // JavaScript: Algoritmo acumulador para las Tarjetas de Resumen Financiero (Lección 5)
    let totalIngresos = 0;
    let totalEgresos = 0;

    historialMovimientos.forEach(movimiento => {
        if (movimiento.tipo === 'deposito') {
            totalIngresos += parseInt(movimiento.monto);
        } else if (movimiento.tipo === 'envio' || movimiento.tipo === 'transferencia') {
            totalEgresos += parseInt(movimiento.monto);
        }
    });

    // jQuery: Actualizar los textos de los resúmenes financieros dinámicamente en el DOM (Lección 6)
    $('#resumen-ingresos').text(`+$${totalIngresos.toLocaleString('es-CL')} CLP`);
    $('#resumen-egresos').text(`-$${totalEgresos.toLocaleString('es-CL')} CLP`);

    // jQuery: Manejo optimizado y unificado de eventos de redirección de clics
    $('.btn-menu').click(function(e) {
        e.preventDefault();
        
        const nombrePantalla = $(this).attr('data-pantalla');
        const urlDestino = $(this).attr('data-url');

        // jQuery: Inyección dinámica del mensaje de estado del sistema (Mensajes Dinámicos)
        $('#mensaje-redireccion').html(`
            <span class="animate-pulse"><i class="bi bi-cpu-fill me-1"></i> Conectando con la vista de ${nombrePantalla.toLowerCase()}...</span>
        `);

        // Desactivar botones de manera temporal para asegurar control total del flujo de eventos
        $('.btn-menu').prop('disabled', true);

        // jQuery: Animación y transición gradual de salida antes del cambio de locación
        setTimeout(() => {
            $('#menu-container').fadeOut(300, function() {
                window.location.href = urlDestino;
            });
        }, 1100);
    });
});