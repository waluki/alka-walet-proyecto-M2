$(document).ready(function() {
    // jQuery: Transición de entrada suave para la interfaz de depósitos
    $('#deposit-container').fadeIn(600);

    // JavaScript: Carga inicial y persistencia del estado financiero desde Local Storage (Lección 5)
    let saldoActual = parseInt(localStorage.getItem('saldoCuenta')) || 100000;
    
    // jQuery: Actualización dinámica e instantánea del saldo en pantalla al cargar (Lección 6)
    $('#saldo-dinamico').text(`$${saldoActual.toLocaleString('es-CL')} CLP`);

    // Interceptar evento submit del formulario mediante selectores de jQuery
    $('#depositForm').submit(function(event) {
        event.preventDefault();

        // Deshabilitar botón para prevenir llamadas o pulsaciones duplicadas
        const btnSubmit = $('#btn-ejecutar-deposito');
        btnSubmit.prop('disabled', true);

        // JavaScript: Captura numérica e inspección del valor ingresado (Lección 5)
        const montoADepositar = parseInt($('#depositAmount').val());

        if (isNaN(montoADepositar) || montoADepositar <= 0) {
            // jQuery: Inyección de alerta dinámica ante fallo de validación
            $('#mensaje').html(`
                <div class="alert alert-danger border-0 text-start d-flex align-items-center gap-2 small" style="background-color: rgba(220, 53, 69, 0.15); color: #ff6b6b;">
                    <i class="bi bi-exclamation-circle-fill fs-5"></i>
                    <div><strong>Operación denegada.</strong> Ingresa una cifra numérica superior a cero.</div>
                </div>
            `);
            btnSubmit.prop('disabled', false);
            return;
        }

        // JavaScript: Algoritmo de cálculo de balances financieros (Lección 5)
        const nuevoSaldo = saldoActual + montoADepositar;
        localStorage.setItem('saldoCuenta', nuevoSaldo);

        // JavaScript: Estructuración y registro del movimiento histórico en Local Storage
        const historial = JSON.parse(localStorage.getItem('historialMovimientos')) || [];
        historial.push({
            tipo: 'deposito',
            monto: montoADepositar,
            fecha: new Date().toLocaleDateString('es-CL') + ' ' + new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
            destinatario: null
        });
        localStorage.setItem('historialMovimientos', JSON.stringify(historial));

        // jQuery: Simulación de actualización dinámica e inmediata del saldo en pantalla (Lección 6)
        $('#saldo-dinamico').text(`$${nuevoSaldo.toLocaleString('es-CL')} CLP`);

        // jQuery: Inyección de alerta de éxito con diseño consistente Bootstrap
        $('#mensaje').html(`
            <div class="alert alert-success border-0 text-start d-flex align-items-center gap-2 small" style="background-color: rgba(40, 167, 69, 0.15); color: #2cd46e;">
                <i class="bi bi-check-circle-fill fs-5"></i>
                <div><strong>¡Fondos Acreditados!</strong> Tu transacción ha sido procesada de manera segura.</div>
            </div>
        `);

        // jQuery: Adición de la leyenda informativa debajo del formulario
        $('#wrapper-leyenda').html(`
            <div class="text-center p-2 rounded-3 mt-2" style="background-color: rgba(56, 176, 0, 0.1); border: 1px dashed rgba(56, 176, 0, 0.3);">
                <span class="text-success small fw-bold">
                    <i class="bi bi-receipt me-1"></i> Monto depositado: +$${montoADepositar.toLocaleString('es-CL')} CLP
                </span>
            </div>
        `);

        // Actualizar el saldo en memoria local de la sesión por si acaso
        saldoActual = nuevoSaldo;

        // jQuery / JavaScript: Redirección retardada con efecto fadeOut suave (Lección 6)
        setTimeout(() => {
            $('#deposit-container').fadeOut(400, function() {
                window.location.href = 'menu.html';
            });
        }, 2200);
    });
});