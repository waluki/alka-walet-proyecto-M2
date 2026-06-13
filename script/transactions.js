$(document).ready(function() {
    // jQuery: Animación suave de entrada de la interfaz de movimientos (Lección 6)
    $('#transactions-container').fadeIn(550);

    // Definición de la lista inicial requerida por la rúbrica si no hay datos guardados
    const listaFicticia = [
        { tipo: 'deposito', monto: 120000, fecha: '10/06/2026 09:30', destinatario: null },
        { tipo: 'transferencia', monto: 45000, fecha: '11/06/2026 14:15', destinatario: 'Armando Mochas' },
        { tipo: 'compra', monto: 15000, fecha: '12/06/2026 21:00', destinatario: 'Supermercado Lider' }
    ];

    // Cargar transacciones desde Local Storage. 
    // Si es la primera vez que se ingresa, se establece la lista ficticia en caché para asegurar consistencia global.
    let listaTransacciones = JSON.parse(localStorage.getItem('historialMovimientos'));
    if (!listaTransacciones) {
        listaTransacciones = listaFicticia;
        localStorage.setItem('historialMovimientos', JSON.stringify(listaFicticia));
    }

    // Función auxiliar para formatear los nombres de los módulos bancarios
    function getTipoTransaccion(tipo) {
        switch(tipo) {
            case 'deposito': return 'Depósito Recibido';
            case 'transferencia': return 'Transferencia Enviada';
            case 'compra': return 'Compra con Tarjeta';
            default: return 'Operación General';
        }
    }

    // Función principal de renderización dinámica según filtros (Lección 5 y 6)
    function mostrarUltimosMovimientos(filtro) {
        const contenedor = $('#lista-movimientos');
        contenedor.empty(); // Limpiar el DOM usando jQuery

        // Filtrado lógico de los elementos del arreglo por su propiedad (Lección 5)
        const movimientosFiltrados = listaTransacciones.filter(mov => {
            if (filtro === 'todas') return true;
            return mov.tipo === filtro;
        });

        if (movimientosFiltrados.length === 0) {
            contenedor.append(`
                <li class="list-group-item bg-transparent text-white-50 text-center py-4 small">
                    <i class="bi bi-folder-x d-block fs-3 mb-2 text-muted"></i> No hay registros de este tipo.
                </li>
            `);
            return;
        }

        // Renderizar del movimiento más reciente al más antiguo para emular una cartelera bancaria real
        movimientosFiltrados.slice().reverse().forEach(mov => {
            // Configurar estilos y wrappers visuales según la procedencia del flujo
            let colorClase = 'text-danger';
            let signo = '-';
            let iconClase = 'bi-arrow-up-right-circle';
            let wrapperClase = 'bg-icon-out';

            if (mov.tipo === 'deposito') {
                colorClase = 'text-success';
                signo = '+';
                iconClase = 'bi-arrow-down-left-circle';
                wrapperClase = 'bg-icon-in';
            } else if (mov.tipo === 'compra') {
                iconClase = 'bi-credit-card';
                wrapperClase = 'bg-icon-card';
            }
            
            const nombreTipo = getTipoTransaccion(mov.tipo);
            const detalleExtra = mov.destinatario ? ` a ${mov.destinatario}` : '';

            // Construcción del nodo dinámico estructurado mediante selectores literales de jQuery
            const item = $(`
                <li class="list-group-item list-group-item-premium d-flex justify-content-between align-items-center p-3 animate-fade-in">
                    <div class="d-flex align-items-center gap-3">
                        <div class="icon-wrapper ${wrapperClase} shadow-sm">
                            <i class="bi ${iconClase}"></i>
                        </div>
                        <div>
                            <strong class="text-white d-block small mb-0">${nombreTipo}${detalleExtra}</strong>
                            <span class="text-white-50" style="font-size: 11px;"><i class="bi bi-clock me-1"></i>${mov.fecha}</span>
                        </div>
                    </div>
                    <span class="${colorClase} fw-bold small" style="letter-spacing: 0.5px;">
                        ${signo}$${parseInt(mov.monto).toLocaleString('es-CL')}
                    </span>
                </li>
            `);
            contenedor.append(item);
        });
    }

    // Escuchar cambios de estado en el selector usando jQuery
    $('#filtro-tipo').change(function() {
        const filtroSeleccionado = $(this).val();
        mostrarUltimosMovimientos(filtroSeleccionado);
    });

    // Restaurar los parámetros financieros y resetear la aplicación
    $('#btn-limpiar').click(function() {
        if (confirm('¿Estás seguro de que deseas restablecer el historial? Esto cargará los movimientos iniciales por defecto.')) {
            localStorage.removeItem('historialMovimientos');
            
            // Restablecer también el saldo inicial por defecto si se desea limpiar por completo el panel
            localStorage.setItem('saldoCuenta', 100000);
            
            location.reload();
        }
    });

    // Inicialización del despliegue en la primera carga
    mostrarUltimosMovimientos('todas');
});