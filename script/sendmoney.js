$(document).ready(function() {
    let contactos = JSON.parse(localStorage.getItem('agendaContactos')) || [];
    let contactoSeleccionado = null;

    // Mostrar/ocultar el formulario emergente (Toggle e Interacción)
    $('#btn-cancelar').click(function() {
        $('#formContactoCollapse').collapse('hide');
    });

    // Guardar nuevo contacto con validación requerida
    $('#formNuevoContacto').submit(function(event) {
        event.preventDefault();

        const nombre = $('#newName').val().trim();
        const cbu = $('#newCbu').val().trim();
        const alias = $('#newAlias').val().trim();
        const banco = $('#newBank').val().trim();

        // Validación: Campos vacíos y formato numérico para CBU
        if (!nombre || !cbu || !alias || !banco) {
            $('#mensaje').html(`<div class="alert alert-warning text-center">Todos los campos son obligatorios.</div>`);
            return;
        }
        if (isNaN(cbu)) {
            $('#mensaje').html(`<div class="alert alert-warning text-center">El CBU debe contener solo números.</div>`);
            return;
        }

        contactos.push({ id: Date.now(), nombre, cbu, alias, banco });
        localStorage.setItem('agendaContactos', JSON.stringify(contactos));
        
        this.reset();
        $('#formContactoCollapse').collapse('hide');
        actualizarLista(contactos);
    });

    // Realizar búsqueda/filtro en tiempo real o por envío
    $('#formBuscar').submit(function(e) { e.preventDefault(); }); // Evitar recarga
    $('#inputBuscar').on('keyup', function() {
        const termino = $(this).val().toLowerCase();
        const filtrados = contactos.filter(c => 
            c.nombre.toLowerCase().includes(termino) || c.alias.toLowerCase().includes(termino)
        );
        actualizarLista(filtrados);
    });

    function actualizarLista(arr) {
        const container = $('#lista-contactos');
        container.empty();
        
        // Escondemos el formulario de envío hasta que vuelvan a seleccionar uno
        $('#contenedor-envio').hide(); 
        contactoSeleccionado = null;

        if (arr.length === 0) {
            container.html('<p class="text-muted text-center small">No se encontraron contactos.</p>');
            return;
        }

        arr.forEach(c => {
            const el = $(`
                <div class="contact-item border p-2 rounded bg-light" style="cursor:pointer;" data-id="${c.id}">
                    <strong>${c.nombre}</strong> <small class="text-muted">(${c.banco})</small>
                </div>
            `);

            // Evento para resaltar y mostrar bloque de envío al seleccionar un contacto
            el.click(function() {
                $('.contact-item').removeClass('bg-primary text-white').addClass('bg-light text-dark'); // Limpiar previos
                $(this).removeClass('bg-light text-dark').addClass('bg-primary text-white'); // Resaltar azul
                
                contactoSeleccionado = c;
                $('#contenedor-envio').fadeIn(); // Desplegar módulo de monto y botón global
            });

            container.append(el);
        });
    }

    // Procesar transferencia con el botón global visible
    $('#btn-enviar-global').click(function() {
        if (!contactoSeleccionado) return;

        const monto = parseInt($('#montoEnviar').val());
        let saldo = parseInt(localStorage.getItem('saldoCuenta')) || 100000;

        if (isNaN(monto) || monto <= 0) {
            $('#mensaje').html(`<div class="alert alert-danger text-center">Ingresa un monto de transferencia válido.</div>`);
            return;
        }

        if (monto > saldo) {
            $('#mensaje').html(`<div class="alert alert-danger text-center">Fondos insuficientes. Tu saldo es de $${saldo.toLocaleString('es-CL')} CLP.</div>`);
            return;
        }

        localStorage.setItem('saldoCuenta', saldo - monto);

        const historial = JSON.parse(localStorage.getItem('historialMovimientos')) || [];
        historial.push({
            tipo: 'transferencia',
            destinatario: contactoSeleccionado.nombre,
            monto: monto,
            fecha: new Date().toLocaleDateString('es-CL')
        });
        localStorage.setItem('historialMovimientos', JSON.stringify(historial));

        // Mensaje de confirmación solicitado por la consigna
        $('#mensaje').html(`<div class="alert alert-success text-center">Envío de $${monto.toLocaleString('es-CL')} a ${contactoSeleccionado.nombre} realizado con éxito.</div>`);

        setTimeout(() => { window.location.href = 'menu.html'; }, 2000);
    });

    actualizarLista(contactos);
});