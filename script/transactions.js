$(document).ready(function() {
    // Definición de la lista ficticia inicial exigida por la consigna
    const listaFicticia = [
        { tipo: 'deposito', monto: 120000, fecha: '10/06/2026', destinatario: null },
        { tipo: 'transferencia', monto: 45000, fecha: '11/06/2026', destinatario: 'Armando Mochas' },
        { tipo: 'compra', monto: 15000, fecha: '12/06/2026', destinatario: 'Supermercado Lider' }
    ];

    // Obtener la lista real de transacciones desde Local Storage. 
    // Si no existe, usamos la lista ficticia para cumplir la rúbrica.
    const listaTransacciones = JSON.parse(localStorage.getItem('historialMovimientos')) || listaFicticia;

    //  Función requerida para obtener el tipo de transacción en formato legible
    function getTipoTransaccion(tipo) {
        switch(tipo) {
            case 'deposito': 
                return 'Depósito Recibido';
            case 'transferencia': 
                return 'Transferencia Enviada';
            case 'compra': 
                return 'Compra con Tarjeta';
            default: 
                return 'Operación General';
        }
    }

    // Función principal para mostrar los últimos movimientos según el filtro seleccionado
    function mostrarUltimosMovimientos(filtro) {
        const contenedor = $('#lista-movimientos');
        contenedor.empty(); // Limpiar la lista anterior

        // Filtrar elementos según la opción del select
        const movimientosFiltrados = listaTransacciones.filter(mov => {
            if (filtro === 'todas') return true;
            return mov.tipo === filtro;
        });

        // Validar si la lista filtrada quedó vacía
        if (movimientosFiltrados.length === 0) {
            contenedor.append('<li class="list-group-item text-muted text-center py-3">No hay movimientos de este tipo.</li>');
            return;
        }

        // Renderizar dinámicamente recorriendo del más reciente al más antiguo
        movimientosFiltrados.slice().reverse().forEach(mov => {
            // Asignar colores según el tipo de flujo financiero
            const colorClase = mov.tipo === 'deposito' ? 'text-success' : 'text-danger';
            const signo = mov.tipo === 'deposito' ? '+' : '-';
            const nombreTipo = getTipoTransaccion(mov.tipo);
            
            // Si tiene un comercio o persona asociada, lo detallamos
            const detalleExtra = mov.destinatario ? ` a ${mov.destinatario}` : '';

            const item = $(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fw-bold">${nombreTipo}${detalleExtra}</span><br>
                        <small class="text-muted">${mov.fecha}</small>
                    </div>
                    <span class="${colorClase} fw-bold">${signo}$${parseInt(mov.monto).toLocaleString('es-CL')} CLP</span>
                </li>
            `);
            contenedor.append(item);
        });
    }

    // Capturar el evento change del select de filtro usando jQuery
    $('#filtro-tipo').change(function() {
        const filtroSeleccionado = $(this).val();
        mostrarUltimosMovimientos(filtroSeleccionado);
    });

    // Botón para limpiar el historial y resetear a la lista vacía/ficticia
    $('#btn-limpiar').click(function() {
        if (confirm('¿Deseas restablecer el historial de transacciones?')) {
            localStorage.removeItem('historialMovimientos');
            location.reload();
        }
    });

    // Carga inicial mostrando todas las transacciones por defecto
    mostrarUltimosMovimientos('todas');
});