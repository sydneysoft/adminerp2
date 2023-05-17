const empresa_id = document.getElementById('empresa_id');

const nombre = document.getElementById('nombre');
const horarios = document.getElementById('horarios');
const direccion = document.getElementById('direccion');
const ubicacion = document.getElementById('ubicacion');
const correo = document.getElementById('correo');
const telefono = document.getElementById('telefono');

let horarios_selected = [];
let h_insertador = document.getElementById('horarios_insertados');

function editeHorarioSelected () {
  const hs = document.getElementById('edite_horarios_selected').getAttribute('data-target');
  if (typeof hs === 'string') {
    horarios_selected = JSON.parse(hs);
  } else if (Array.isArray(hs)) {
    horarios_selected = hs;
  }
  horarios_loop();
}

const clearForm = () => {
  nombre.value = '';
  horarios.value = 0;
  direccion.value = '';
  ubicacion.value = '';
  correo.value = '';
  telefono.value = ''
  editor.setData('', '');
}

const getHorarios = () => {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: `/admin-horarios/for/${empresa_id.value}`,
    success: (result) => {
      if(result.data.length > 0) {
        const  data  = result.data;
        for(let i = 0; i < data.length; i++) {
          horarios.appendChild(horarioOption(data[i], horarios.getAttribute('data-selected')));
        }
      }
    },
    error: (err) => {
      console.log(err);
    }
  })
};

getHorarios();


const horarioOption = (data, selected = 0) => {
  const newOption = document.createElement('option');
  newOption.value = data.id
  newOption.innerHTML = `${data.dia_de} a ${data.dia_a} de ${data.hora_de} a ${data.hora_a}`
  if(selected == data.id) {
    newOption.selected = true
  }
  return newOption
};

function horarios_loop () {
  h_insertador.innerHTML = '';
  for(let i = 0; i < horarios_selected.length; i++) {
    h_insertador.innerHTML += `
    <div class="alert alert-info row justify-content-between" data-target="${horarios_selected[i].id}">
      <div>
        ${horarios_selected[i].text}
      </div>
      <button id="horario${horarios_selected[i].id}" class="close">x</button>
    </div>
    `;
    document.getElementById(`horario${horarios_selected[i].id}`).addEventListener('click', (event) => {
      console.log( event.target.parentNode.getAttribute('data-target'), event.target.parentNode)
      for (let j = 0; j < horarios_selected.length; j++) {
        if (horarios_selected[j].id == event.target.parentNode.getAttribute('data-target')) {
          horarios_selected.splice(j, 1);
        }
      }
      horarios_loop();
    });
  }
}

function insertar_horario () {
  if(horarios.value != 0) {
    for (let i = 0; i < horarios_selected.length; i++) {
      if (horarios_selected[i].id == horarios.value) return false;
    }
    horarios_selected.push({id: horarios.value, text: horarios.options[horarios.selectedIndex].text});
    horarios_loop();
  }
  horarios.selectedIndex = 0;
}