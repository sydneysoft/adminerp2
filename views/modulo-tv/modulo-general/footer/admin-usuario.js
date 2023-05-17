
const footerMenuList = document.getElementById('footerMenuList');
const dataFooter = () => {
  const empresa_id = document.getElementById('empresa_id');
  if (empresa_id.value > 0) {
    $.ajax({
      method: 'GET',
      url: `/admin-footer/menus-admin/${empresa_id.value}`,
      dataType: 'json',
      success: (data) => {
        if (data.length) {
          // const data = result.data
          // console.log(data)
          for (let i = 0; i < data.length; i++) {
            let almostInner = '';
            almostInner += startWith(); // Comienza
            almostInner += list(data[i].id, data[i].nombre, data[i].descripcion, true);
            if (data[i].items.length) {
              almostInner += listStart();
              // Se inserta el menu
              for (let j = 0; j < data[i].items.length; j++) {
                almostInner += itemList(data[i].items[j]);
              }
              almostInner += listEnd();
            }
            almostInner += nuevoItem(data[i].id);
            almostInner += endWith(); // termina
            footerMenuList.innerHTML += almostInner;
          }
        } else {
          footerMenuList.innerHTML = withoutMenuList()
        }
      },
      error: (error) => {
        if (error.responseJSON) {
          Swal.fire({
            html: error.responseJSON.msg
          })
        } else {
          Swal.fire({
            html: error.responseText
          })
        }
      }
    })
  } else {
    footerMenuList.innerHTML = withoutMenuList()
  }
};

const beforeCreateItem = (menu_id) => {
  let preHtml = '';
  preHtml += formItem('', '', '');
  preHtml += `<button class="btn btn-primary btn-block" onclick="createItem(${menu_id})">Guardar</button>`;
  Swal.fire({
    position: "center",
    html: preHtml,
    showConfirmButton: false
  });
};


const beforeUpdateItem = (id, nombre, url, icono) => {
  let preHtml = ''
  preHtml += formItem(nombre, url, icono)
  preHtml += `<button class="btn btn-primary btn-block" onclick="updateItem(${id})">Guardar</button>`;
  Swal.fire({
    position: "center",
    html: preHtml,
    showConfirmButton: false
  });
  $('#itemIcono').val(icono)
  document.getElementById('itemIcono').addEventListener('change', () => {
    $('#showIcono').html( `<i class="${$('#itemIcono').val()}"></i>`);
  })
};

const beforeDeleteItem = (id) => {
  let preHtml = `
  <div class="text-center">
    <h5>¿Esta seguro de eliminar este elemento?</h5>
  </div>`
  // preHtml = ``

  Swal.fire({
    position: 'center',
    html: preHtml
  }).then(result => {
    if (result.isConfirmed) {
      deleteItem(id)
    }
  })
};


dataFooter();

const enums = {
  section: ['footer'],
  position: ['uno', 'dos', 'tres', 'cuatro']
};

const formMenuList = (nombre = '', descripcion = '') => {
  return `
    <div>
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" class="form-control" name="Nombre" placeholder="nombre" value="${nombre}"/>
      </div>
      <div class="form-group mt-3">
        <label for="descripcion">Descripción</label>
        <textarea id="descripcion" class="form-control" placeholder="Descrición">${descripcion}</textarea>
      </div>     
    </div>
  `;
};

const optionItem = (data, selected) => {
  const optionItem = document.createElement('option');
  optionItem.value = data;
  optionItem.innerHTML = data;
  if (data === selected) {
    optionItem.selected = true;
  }
  return optionItem;
};

const optionRender = (data, selected) => {
  let preRender = '';
  data.forEach(val => {
    preRender += optionItem(val, val, selected).outerHTML;
  })

  return preRender;
};

const beforeCreateList = (empresa_id) => {
  let preHtml = formMenuList();
  preHtml += buttonSave(empresa_id);
  Swal.fire({
    showConfirmButton: false,
    html: preHtml
  });

};

const buttonSave = (empresa_id) => {
  return `
    <button class="btn btn-primary" onclick="guardarList(${empresa_id})">Guardar</button>
  `;
};

const guardarList = (empresa_id) => {
  save('/admin-footer/menu', {
    nombre: document.getElementById('nombre').value,
    descripcion: document.getElementById('descripcion').value,
    section: 'footer',
    position: 'uno',
    empresa_id
  });
  setTimeout(() => window.location.reload(true), 1000);
};

const clearForm = () => {
  document.getElementById('nombre').value = '';
  document.getElementById('descripcion').value = '';
};

const beforeDeleteList = (id) => {
  Swal.fire({
    position: "center",
    icon: "info",
    html: "<b>¿Esta seguro de eliminar esta Lista?</b>",
    showConfirmButton: true
  }).then((result) => {
    if(result.isConfirmed) {
      deleteList(id);
    }
  }).catch((error) => {
    console.log(error)
  });
}