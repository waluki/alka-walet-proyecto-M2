$(document).ready(function() {
    // 1. Mostrar saldo actual al cargar la página usando jQuery
    let saldoActual = parseInt(localStorage.getItem('saldoCuenta')) || 100000;
    $('#depositAmount').attr('placeholder', `Tu saldo actual es $${saldoActual.toLocaleString('es-CL')}`);

    $('#depositForm').submit(function(event) {
        event.preventDefault();

        const montoADepositar = parseInt($('#depositAmount').val());

        if (isNaN(montoADepositar) || montoADepositar <= 0) {
            $('#alert-container').html(`<div class="alert alert-danger text-center">Ingresa un monto válido.</div>`);
            return;
        }

        const nuevoSaldo = saldoActual + montoADepositar;
        localStorage.setItem('saldoCuenta', nuevoSaldo);

        // Registrar movimiento histórico
        const historial = JSON.parse(localStorage.getItem('historialMovimientos')) || [];
        historial.push({
            tipo: 'deposito',
            monto: montoADepositar,
            fecha: new Date().toLocaleDateString('es-CL') + ' ' + new Date().toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'})
        });
        localStorage.setItem('historialMovimientos', JSON.stringify(historial));

        // 2. Alerta de éxito de Bootstrap agregada dinámicamente a #alert-container
        $('#alert-container').html(`<div class="alert alert-success text-center">¡Depósito procesado con éxito!</div>`);

        // 3. Agregar una leyenda debajo del formulario con el monto depositado
        // Si no tienes este elemento en tu HTML, jQuery lo creará al vuelo abajo del form
        if ($('#leyenda-deposito').length === 0) {
            $('#depositForm').after(`<p id="leyenda-deposito" class="text-center text-success mt-3 fw-bold"></p>`);
        }
        $('#leyenda-deposito').text(`Monto depositado con éxito: $${montoADepositar.toLocaleString('es-CL')} CLP`);

        $('button[type="submit"]').prop('disabled', true);

        // 4. Redirigir después de 2 segundos mediante setTimeout
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 2000);
    });
});