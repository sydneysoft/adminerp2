//- Variables
const API_URL = '';

let table = null;
let action = '';

$(document).ready(function () {
    table = $('#tabla-trabajadores').DataTable({
        "language": { "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json" }
    });
});


/**EventListeners*/



//- CHANGE STEP 
$('button[data-action="change-step"]').click(function (e) {

    const steps = Array.from(document.querySelectorAll('.step'));

    const [stepActive] = steps.filter(step => step.classList.contains('step-active'));
    const [stepHidden] = steps.filter(step => step.classList.contains('hidden'));

    stepActive.classList.remove('step-active');
    stepActive.classList.add('hidden');

    stepHidden.classList.remove('hidden');
    stepHidden.classList.add('step-active');
})

//- DELETE
$('#tabla-trabajadores .btn.btn-danger').click(deleteRegister);

//- NEW
$('button[data-action="new"]').click(function (e) {
    action = 'new';
    $('#guardarTrabajadorAdmin form input, #guardarTrabajadorAdmin form select, #guardarTrabajadorAdmin form textarea').val('')
});

//- //- EDIT
$('button[data-action="edit"]').click(edit);

//- SUBMIT
$('#guardarTrabajadorAdmin form').submit(async (e) => {
    e.preventDefault();

    if (action === 'new') {

        const requiredInputs = Array.from(e.target.querySelectorAll('select, input, textarea'))
            .filter(input => !['fecha_de_despido', 'numero_de_persona_de_contacto', 'segundo_nombre', 'observaciones']
                .includes(input.getAttribute('name')));


        for (let i = 0; i < requiredInputs.length; i++) {
            const element = requiredInputs[i];
            if (element.value === '') {
                Swal.fire('Hay campos vacios', '', 'warning');
                return;
            }
            // console.log({value: element.value, name: element.getAttribute('name')})
        }


    }

    const formData = new FormData(e.target);

    try {

        const ENDPOINT = action === 'new'
            ? `${API_URL}/admin-trabajadores/new`
            : `${API_URL}/admin-trabajadores/${$('.modal#guardarTrabajadorAdmin').attr('data-id')}`

        const res = await fetch(ENDPOINT, { method: action === 'new' ? 'POST' : 'PUT', body: formData });

        const obj = await res.json()


        if (obj.ok) {
            Swal.fire('El registro se ha guardado correctamente', '', 'success');

            const id = action === 'new'
                ? obj.result.insertId
                : $('.modal#guardarTrabajadorAdmin').attr('data-id');

            updateTable(id);

            e.target.reset();

        } else {
            console.log(obj)
            Swal.fire('Oops!', 'Ha ocurrido un error al guardar los datos', 'error');
        }

    } catch (error) {
        console.log(error)
        Swal.fire('Oops!', 'Ha ocurrido un error al guardar los datos', 'error');
    }
})


// DUPLICATE 
$('button[data-action="duplicate"]').click(duplicate)

//- Functions
async function updateTable(id) {

    const res = await fetch(`${API_URL}/admin-trabajadores/${id}`);
    const { worker } = await res.json()
    const data = {
        id: id,
        primer_nombre: worker.primer_nombre,
        segundo_nombre: worker.segundo_nombre,
        apellido_paterno: worker.apellido_paterno,
        apellido_materno: worker.apellido_materno,
        celular: worker.celular,
        telefono: worker.telefono,
        correo: worker.correo,
        direccion: worker.direccion,
        tipo_de_documento: worker.tipo_de_documento,
        numero_de_documento: worker.numero_de_documento,
        foto_de_documento_cara_frontal: `<a target="_blank" href="admin-trabajadores/files/${worker.foto_de_documento_cara_frontal}">${worker.foto_de_documento_cara_frontal}</a>`,
        foto_de_documento_cara_trasera: `<a target="_blank" href="admin-trabajadores/files/${worker.foto_de_documento_cara_trasera}">${worker.foto_de_documento_cara_trasera}</a>`,
        entidad_bancaria: worker.entidad_bancaria,
        numero_de_cuenta: worker.numero_de_cuenta,
        AFP: worker.AFP,
        CTS: worker.CTS,
        observaciones: worker.observaciones,
        fecha_de_contratacion: worker.fecha_de_contratacion,
        estado: worker.estado,
        fecha_de_despido: worker.fecha_de_despido,
        CV: `<a target="_blank" href="admin-trabajadores/files/${worker.CV}">${worker.CV}</a>`,
        contrato: `<a target="_blank" href="admin-trabajadores/files/${worker.contrato}">${worker.contrato}</a>`,
        nombres_de_persona_de_contacto: worker.nombres_de_persona_de_contacto,
        celular_de_persona_de_contacto: worker.celular_de_persona_de_contacto,
        tipo_de_documento_de_persona_de_contacto: worker.tipo_de_documento_de_persona_de_contacto,
        numero_de_documento_de_persona_de_contacto: worker.numero_de_documento_de_persona_de_contacto,
        '': `<td>
        <button class="btn btn-info" data-action="duplicate" data-id="${worker.id}"><i class="fa fa-camera"></i></button>
        <button class="btn btn-warning" type="button" data-toggle="modal" data-target="#guardarTrabajadorAdmin" data-action="edit" data-id="${worker.id}"><i class="fa fa-edit"></i></button>
        <button class="btn btn-danger" type="button" style="margin-left:8px" data-id="${worker.id}"><i class="fa fa-trash"> </i></button></td>`
    };

    if (action === 'new') {
        table.row.add(Object.values(data)).draw(false);


    } else {

        const dataValues = Object.values(data);

        $('button[data-id="' + id + '"]').parents('tr')[0].querySelectorAll('td').forEach((td, index) => {
            td.innerHTML = dataValues[index]
        });

    }

    $('#tabla-trabajadores .btn.btn-danger').click(deleteRegister);
    $('button[data-action="edit"]').click(edit);
    $('button[data-action="duplicate"]').click(duplicate);

    action = ''

}

function deleteRegister({ currentTarget }) {

    const rowIndex = currentTarget.parentElement.parentElement._DT_RowIndex

    try {
        Swal.fire({
            title: '¿Estas seguro de que quieres eliminar este registro?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
        })
            .then(async (result) => {

                if (result.isConfirmed) {

                    const { ok } = await fetch(`${API_URL}/admin-trabajadores/${$(currentTarget).attr('data-id')}`, { method: 'DELETE' })

                    if (ok) {
                        table.row(':eq(' + rowIndex + ')').remove().draw();
                        Swal.fire('Exito!', 'El registro ha sido eliminado correctamente', 'success')
                    }
                } else if (result.isDenied) {
                    Swal.fire('Accion detenida', '', 'info')
                }
            })


    } catch (error) {
        console.log(error)
        Swal.fire('Oops!', error.msg ? error.msg : 'Error', 'error')
    }
}

async function edit(e) {
    action = 'edit';

    try {

        const res = await fetch(`${API_URL}/admin-trabajadores/${e.currentTarget.getAttribute('data-id')}`);

        const { worker } = await res.json()


        $('.modal#guardarTrabajadorAdmin').modal('show')

        if (action == 'edit' && worker) {

            document.querySelectorAll('#guardarTrabajadorAdmin form input, #guardarTrabajadorAdmin form select, #guardarTrabajadorAdmin form textarea').forEach(element => {
                console.log(worker[$(element).attr('name')])

                $(element).attr('type') !== 'file' && $(element).val(worker[$(element).attr('name')])

                if (element.nodeName === 'SELECT') {

                    $(element).change();
                }


            })

            $('.modal#guardarTrabajadorAdmin').attr('data-id', e.currentTarget.getAttribute('data-id'));
        }

    } catch (error) {
        console.log(error)
    }
}

async function duplicate({ currentTarget }) {
    const param = $(currentTarget).attr('data-id');

    try {
        const res = await fetch(`${API_URL}/admin-trabajadores/${param}`);
        const { worker } = await res.json();
        const { id, ...resto } = worker;
        const formData = new FormData();

        Object.keys(resto).forEach(key => formData.append(key, resto[key]));

        const response = await fetch(`${API_URL}/admin-trabajadores/new`, {
            method: 'POST',
            body: formData
        });

        const obj = await response.json();

        if (obj.ok) {
            Swal.fire('Registro duplicado', '', 'success');

            action = 'new';

            updateTable(obj.result.insertId);
        }

    } catch (error) {
        console.log(error)
        Swal.fire('Oops!', 'Ha ocurrido un error duplicando el registro', 'error');
    }
}