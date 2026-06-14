$(document).ready(function() {
    // jQuery: Entrada animada del contenedor de transferencias (Lección 6)
    $('#sendmoney-container').fadeIn(500);

    // JavaScript: Carga del estado y de la base de contactos guardada (Lección 5)
    let contactos = JSON.parse(localStorage.getItem('agendaContactos')) || [
        { id: 1, nombre: "Andrés Silva", cbu: "012345", alias: "andres.silva.wallet", banco: "Banco Estado" },
        { id: 2, nombre: "Bárbara Jara", cbu: "678901", alias: "barbara.jara.pago", banco: "Banco de Chile" }
    ];
    let contactoSeleccionado = null;

    // jQuery: Cerrar panel colapsable del formulario al cancelar
    $('#btn-cancelar').click(function() {
        $('#formContactoCollapse').collapse('hide');
    });

    // JavaScript / jQuery: Procesar guardado de nuevo contacto con validación estricta (Lección 5)
    $('#formNuevoContacto').submit(function(event) {
        event.preventDefault();

        const nombre = $('#newName').val().trim();
        const cbu = $('#newCbu').val().trim();
        const alias = $('#newAlias').val().trim();
        const banco = $('#newBank').val().trim();

        if (!nombre || !cbu || !alias || !banco) {
            $('#mensaje').html(`
                <div class="alert alert-warning border-0 small text-start py-2">
                    <i class="bi bi-exclamation-triangle-fill me-1"></i> Todos los campos de registro son mandatorios.
                </div>
            `);
            return;
        }
        if (isNaN(cbu)) {
            $('#mensaje').html(`
                <div class="alert alert-warning border-0 small text-start py-2">
                    <i class="bi bi-exclamation-circle-fill me-1"></i> El CBU/Cuenta debe estructurarse únicamente con dígitos numéricos.
                </div>
            `);
            return;
        }

        // Guardar nuevo registro
        contactos.push({ id: Date.now(), nombre, cbu, alias, banco });
        localStorage.setItem('agendaContactos', JSON.stringify(contactos));
        
        this.reset();
        $('#formContactoCollapse').collapse('hide');
        
        $('#mensaje').html(`
            <div class="alert alert-success border-0 small text-start py-2">
                <i class="bi bi-check-circle-fill me-1"></i> Contacto guardado con éxito.
            </div>
        `);

        actualizarLista(contactos);
    });

    
    // JQUERY: MOTOR DE AUTOCOMPLETADO (Lección 6)
    
    $('#inputBuscar').on('input', function() {
        const termino = $(this).val().toLowerCase().trim();
        const boxSugerencias = $('#autocomplete-suggestions');
        boxSugerencias.empty();

        if (termino.length === 0) {
            boxSugerencias.addClass('d-none');
            actualizarLista(contactos);
            return;
        }

        // Filtrar coincidencias por nombre o alias (JavaScript - Lección 5)
        const filtrados = contactos.filter(c => 
            c.nombre.toLowerCase().includes(termino) || c.alias.toLowerCase().includes(termino)
        );

        if (filtrados.length > 0) {
            boxSugerencias.removeClass('d-none');
            filtrados.forEach(c => {
                const item = $(`<div class="autocomplete-item"><i class="bi bi-person-fill text-info me-2"></i>${c.nombre} <span class="text-muted small">(${c.alias})</span></div>`);
                
                // Al dar clic en la sugerencia del autocompletado, la selecciona automáticamente
                item.click(function() {
                    $('#inputBuscar').val(c.nombre);
                    boxSugerencias.addClass('d-none');
                    
                    // Filtrar la lista principal para que muestre solo a este contacto y seleccionarlo
                    actualizarLista([c]);
                    $('#lista-contactos .contact-item-premium').first().click();
                });
                boxSugerencias.append(item);
            });
        } else {
            boxSugerencias.html('<div class="p-2 text-muted small text-center">Sin sugerencias exactas</div>').removeClass('d-none');
            actualizarLista([]);
        }
    });

    // Ocultar la caja de autocompletado si el usuario hace clic fuera de ella
    $(document).click(function(e) {
        if (!$(e.target).closest('#inputBuscar, #autocomplete-suggestions').length) {
            $('#autocomplete-suggestions').add('d-none');
        }
    });

    // jQuery: Renderizador dinámico del DOM para la lista de contactos (Lección 6)
    function actualizarLista(arr) {
        const container = $('#lista-contactos');
        container.empty();
        
        $('#contenedor-envio').hide(); 
        contactoSeleccionado = null;

        if (arr.length === 0) {
            container.html('<p class="text-white-50 text-center small my-3"><i class="bi bi-people me-1"></i> Ningún contacto coincide con la búsqueda.</p>');
            return;
        }

        arr.forEach(c => {
            const cardContacto = $(`
                <div class="contact-item-premium p-3 d-flex align-items-center justify-content-between" style="cursor:pointer;" data-id="${c.id}">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle bg-info bg-opacity-10 text-info d-flex align-items-center justify-content-center" style="width: 38px; height: 38px;">
                            <i class="bi bi-person fs-5"></i>
                        </div>
                        <div>
                            <strong class="text-white d-block small">${c.nombre}</strong>
                            <span class="text-white-50" style="font-size: 11px;">${c.banco} | CBU: ${c.cbu}</span>
                        </div>
                    </div>
                    <i class="bi bi-check-circle-fill text-info d-none check-icon"></i>
                </div>
            `);

            // Evento Click con jQuery para la selección activa
            cardContacto.click(function() {
                $('.contact-item-premium').removeClass('contact-item-selected');
                $('.contact-item-premium .check-icon').addClass('d-none');
                
                $(this).addClass('contact-item-selected');
                $(this).find('.check-icon').removeClass('d-none');
                
                contactoSeleccionado = c;
                
                // Animación jQuery para desplegar gradualmente la zona de montos (Lección 6)
                $('#contenedor-envio').fadeIn(400); 
            });

            container.append(cardContacto);
        });
    }

    // JavaScript / jQuery: Ejecución segura del algoritmo de transferencia (Lección 5)
    $('#btn-enviar-global').click(function() {
        if (!contactoSeleccionado) return;

        const btnEnvio = $(this);
        btnEnvio.prop('disabled', true);

        const monto = parseInt($('#montoEnviar').val());
        let saldo = parseInt(localStorage.getItem('saldoCuenta')) || 100000;

        if (isNaN(monto) || monto <= 0) {
            $('#mensaje').html(`
                <div class="alert alert-danger border-0 small text-start py-2">
                    <i class="bi bi-exclamation-triangle-fill me-1"></i> Digita una cantidad numérica válida para realizar el envío.
                </div>
            `);
            btnEnvio.prop('disabled', false);
            return;
        }

        if (monto > saldo) {
            $('#mensaje').html(`
                <div class="alert alert-danger border-0 small text-start py-2">
                    <i class="bi bi-x-circle-fill me-1"></i> Fondos insuficientes. Tu balance disponible es de $${saldo.toLocaleString('es-CL')} CLP.
                </div>
            `);
            btnEnvio.prop('disabled', false);
            return;
        }

        // Actualizar el saldo restando el envío (Simulación de actualización de saldo)
        localStorage.setItem('saldoCuenta', saldo - monto);

        // Registrar la transacción en el historial común de movimientos
        const historial = JSON.parse(localStorage.getItem('historialMovimientos')) || [];
        historial.push({
            tipo: 'transferencia',
            destinatario: contactoSeleccionado.nombre,
            monto: monto,
            fecha: new Date().toLocaleDateString('es-CL') + ' ' + new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
        });
        localStorage.setItem('historialMovimientos', JSON.stringify(historial));

        // Mensaje dinámico de confirmación de éxito de Bootstrap requerido
        $('#mensaje').html(`
            <div class="alert alert-success border-0 text-start d-flex align-items-center gap-2 small" style="background-color: rgba(40, 167, 69, 0.15); color: #2cd46e;">
                <i class="bi bi-check-circle-fill fs-5"></i>
                <div><strong>Transferencia Exitosa.</strong> Has enviado $${monto.toLocaleString('es-CL')} CLP a ${contactoSeleccionado.nombre}.</div>
            </div>
        `);

        // Redirección paulatina hacia el menú usando animaciones de salida jQuery
        setTimeout(() => {
            $('#sendmoney-container').fadeOut(300, function() {
                window.location.href = 'menu.html';
            });
        }, 2200);
    });

    // Carga inicial de la agenda de la app
    actualizarLista(contactos);
});