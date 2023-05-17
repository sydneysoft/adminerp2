

//- Variables

let table = null;
let action = '';

$(document).ready(function () {
    table = $('#tabla-drivers').DataTable({
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
$('#tabla-drivers .btn.btn-danger').click(deleteRegister);

//- NEW
$('button[data-action="new"]').click(function (e) {
    action = 'new';
    
    $('#guardarChoferAdmin form input, #guardarChoferAdmin form select, #guardarChoferAdmin form textarea').val('')
});

//- //- EDIT
$('button[data-action="edit"]').click(edit);

//- SUBMIT
$('#guardarChoferAdmin form').submit(async (e) => {
    e.preventDefault();

    if (action === 'new') {

        const requiredInputs = Array.from(e.target.querySelectorAll('select, input, textarea')).filter(input => !['foto_de_documento_cara_frontal', 'foto_de_documento_cara_trasera', 'foto_de_licencia_cara_frontal', 'foto_de_licencia_cara_trasera', 'fecha_de_despido', 'observaciones', 'segundo_nombre'].includes(input.getAttribute('name')));

        for (let i = 0; i < requiredInputs.length; i++) {
            const element = requiredInputs[i];
            if (element.value === '') {
                Swal.fire('Hay campos vacios', '', 'warning');
                return;
            }
        }
    }

    const formData = new FormData(e.target);

    try {

        const ENDPOINT = action === 'new'
            ? `/admin-choferes/new`
            : `/admin-choferes/${$('.modal#guardarChoferAdmin').attr('data-id')}`

        const res = await fetch(ENDPOINT, { method: action === 'new' ? 'POST' : 'PUT', body: formData });

        const obj = await res.json()


        if (obj.ok) {
            Swal.fire('El registro se ha guardado correctamente', '', 'success');

            const id = action === 'new'
                ? obj.result.insertId
                : $('.modal#guardarChoferAdmin').attr('data-id');

            updateTable(id);

            e.target.reset();

        } else {
        
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

    const res = await fetch(`/admin-choferes/${id}`);
    const { driver } = await res.json()

    const data = {
        id: id,
        primer_nombre: driver.primer_nombre,
        segundo_nombre: driver.segundo_nombre,
        apellido_paterno: driver.apellido_paterno,
        apellido_materno: driver.apellido_materno,
        tipo_de_documento: driver.tipo_de_documento,
        numero_de_documento: driver.numero_de_documento,
        foto_de_documento_cara_frontal: /* driver.foto_de_documento_cara_frontal */`<a target="_blank" href="admin-choferes/files/${driver.foto_de_documento_cara_frontal}">${driver.foto_de_documento_cara_frontal}</a>`,
        foto_de_documento_cara_trasera: /* driver.foto_de_documento_cara_trasera */`<a target="_blank" href="admin-choferes/files/${driver.foto_de_documento_cara_trasera}">${driver.foto_de_documento_cara_trasera}</a>`,
        tipo_de_licencia: driver.tipo_de_licencia,
        numero_de_licencia: driver.numero_de_licencia,
        foto_de_licencia_cara_frontal: /* driver.foto_de_licencia_cara_frontal */`<a target="_blank" href="admin-choferes/files/${driver.foto_de_licencia_cara_frontal}">${driver.foto_de_licencia_cara_frontal}</a>`,
        foto_de_licencia_cara_trasera: /* driver.foto_de_licencia_cara_trasera */`<a target="_blank" href="admin-choferes/files/${driver.foto_de_licencia_cara_trasera}">${driver.foto_de_licencia_cara_trasera}</a>`,
        fecha_de_contratacion: driver.fecha_de_contratacion,
        estado: driver.estado,
        fecha_de_despido: driver.fecha_de_despido,
        observaciones: driver.observaciones,
        tipo_de_vehiculo: driver.tipo_de_vehiculo,
        '': `<td>
        <button class="btn btn-info" data-action="duplicate" data-id="${driver.id}"><i class="fa fa-camera"></i></button>
        <button class="btn btn-warning" type="button" data-toggle="modal" data-target="#guardarChoferAdmin" data-action="edit" data-id="${driver.id}"><i class="fa fa-edit"></i></button>
        <button class="btn btn-danger" type="button" style="margin-left:8px" data-id="${driver.id}"><i class="fa fa-trash"> </i></button></td>`
    };

    if (action === 'new') {
        table.row.add(Object.values(data)).draw(false);


    } else {

        const dataValues = Object.values(data);

        $('button[data-id="' + id + '"]').parents('tr')[0].querySelectorAll('td').forEach((td, index) => {
            td.innerHTML = dataValues[index]
        });

    }

    $('#tabla-drivers .btn.btn-danger').click(deleteRegister);
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

                    const { ok } = await fetch(`/admin-choferes/${$(currentTarget).attr('data-id')}`, { method: 'DELETE' })

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

        const res = await fetch(`/admin-choferes/${e.currentTarget.getAttribute('data-id')}`);

        const { driver } = await res.json()


        $('.modal#guardarChoferAdmin').modal('show')

        if (action == 'edit' && driver) {

            document.querySelectorAll('#guardarChoferAdmin form input, #guardarChoferAdmin form select, #guardarChoferAdmin form textarea').forEach(element => {


                $(element).attr('type') !== 'file' && $(element).val(driver[$(element).attr('name')])

                if (element.nodeName === 'SELECT') {

                    $(element).change();
                }


            })

            $('.modal#guardarChoferAdmin').attr('data-id', e.currentTarget.getAttribute('data-id'));
        }

    } catch (error) {
        console.log(error)
    }
}

async function duplicate({ currentTarget }) {
    const param = $(currentTarget).attr('data-id');

    try {
        const res = await fetch(`/admin-choferes/${param}`);
        const { driver } = await res.json();
        const { id, ...resto } = driver;
        const formData = new FormData();

        Object.keys(resto).forEach(key => formData.append(key, resto[key]));

        const response = await fetch(`/admin-choferes/new`, {
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