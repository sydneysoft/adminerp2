const footerMenuList = document.getElementById('footerMenuList');


// FETCH
const dataFooter = () => {
  $.ajax({
    method: 'GET',
    url: '/admin-footer/menus',
    dataType: 'json',
    success: (data) => {
      if (data.length) {

        for (let i = 0; i < data.length; i++) {
          let almostInner = '';
          almostInner += startWith(); // Comienza
          almostInner += list(data[i].id, data[i].nombre, data[i].descripcion);
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
};


// Necesita Swal
const beforeCreateItem = (menu_id) => {
  let preHtml = '';
  preHtml += formItem('', '', '');
  preHtml += `<button class="btn btn-primary btn-block" onclick="createItem(${menu_id})">Guardar</button>`;
  Swal.fire({
    position: "center",
    html: preHtml
  });
};


const beforeUpdateItem = (id, nombre, url, icono) => {
  let preHtml = ''
  preHtml += formItem(nombre, url, icono)
  preHtml += `<button class="btn btn-primary btn-block" onclick="updateItem(${id})">Guardar</button>`;
  Swal.fire({
    position: "center",
    html: preHtml
  });
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
    if(result.isConfirmed) {
      deleteItem(id)
    }
  })
};

dataFooter();