const successResponse = (data) => {
  console.log(data)
  if(data) {
    Swal.fire({
      position: "center",
      icon: "success",
      html: data.msg,
      showConfirmButton: false,
      timer: 2500,
    });
  }
}

const errorResponse  = (error) => {
  if(error.responseJSON) {
    Swal.fire({
      position: "center",
      icon: "error",
      html: `<b>${error.responseJSON.msg}</b>`,
      showConfirmButton: false,
      timer: 2500,
    });
  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      html: `<b>${error.responseText}</b>`,
      showConfirmButton: false,
      timer: 2500,
    });
  }
}



// AJAX
const createItem = (menu_id) => {
  const nombre = document.getElementById('itemNombre');
  const url = document.getElementById('itemUrl');
  const icono = document.getElementById('itemIcono');

  $.ajax({
    method: 'POST',
    url: '/admin-footer/menu/item',
    data: {
      nombre: nombre.value,
      url: url.value,
      icono: icono.value,
      menu_id
    },
    success: (data) => {
      successResponse(data)
      setTimeout(() => window.location.reload(true), 1000)
    },
    error: errorResponse
  })

  
};

const updateItem = (id) => {
  const nombre = document.getElementById('itemNombre');
  const url = document.getElementById('itemUrl');
  const icono = document.getElementById('itemIcono');
  $.ajax({
    method: "PUT",
    url: `/admin-footer/menu/item/${id}`,
    data: {
      nombre: nombre.value,
      url: url.value,
      icono: icono.value
    },
    success: (data) => {
      successResponse(data)
      setTimeout(() => window.location.reload(true), 1000)
    },
    error: errorResponse
  })
};

const deleteItem = (id) => {
  $.ajax({
    method: 'DELETE',
    url: `/admin-footer/menu/item/${id}`,
    data: {},
    success: (data) => {
      successResponse(data)
      document.getElementById(`itemId${id}`).remove()
    },
    error: errorResponse
  })
};


const updateList = (id, nombre, descripcion) => {
  const nombreField = document.getElementById(nombre);
  const descripcionField = document.getElementById(descripcion);
  $.ajax({
    method: 'PUT',
    url: `/admin-footer/menu/${id}`,
    data: {
      id,
      nombre: nombreField.value,
      descripcion: descripcionField.value
    },
    success: successResponse,
    error: errorResponse
  })
};

const withoutMenuList = () => {
  return `
    <div class="col-12">
      <div class="alert alert-info text-center mx-3">
        <p class="w-100 m-0 p-0">Debe solicitar al administrador que le habilite listas para pie de página.</p>
      </div>
    </div>
  `
};

// TEMPLATE

const nuevoItem = (menu_id) => {
  return `<button class="btn btn-primary btn-block text-center" onclick="beforeCreateItem(${menu_id})">Agregar <i class="fas fa-plus"></i></button>`
};


const itemList = (data) => {
  return `
  <li id="itemId${data.id}" class="list-group-item d-flex flex-nowrap justify-content-between align-items-center">
    <div class="flex-shrink-1">${data.nombre}</div>
    <div class="col-5 text-right">
      <button class="btn btn-primary" onclick="beforeUpdateItem(${data.id}, '${data.nombre}','${data.url}','${data.icono}');">
        <i class="fas fa-pen"></i>
      </button>
      <button class="btn btn-danger" onclick="beforeDeleteItem(${data.id});">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </li>
  `
};

const list = (id, nombre, descripcion) => {
  return `
  <div class="p-3">
    <div class="form-group">
      <label class="text-label">Nombre del menú</label>
      <input id="nombreMenu${id}" class="form-control" type="text" placeholder="Nombre del menú" value="${nombre}" />
    </div>
    <div class="form-group">
      <label class="text-label">Descripción</label>
      <textarea id="descripcionMenu${id}" class="form-control" placeholder="Descripción del menu">${descripcion}</textarea>
    </div>
    <div class="text-right">
      <button class="btn btn-primary" onclick="updateList(${id}, 'nombreMenu${id}','descripcionMenu${id}')">Guardar</button>
    </div>
  </div>
  `
};

const formItem = (nombre, url, icono) => {
  return `
    <div class="form-group">
      <label class=""></label>
      <input id="itemNombre" class="form-control" value="${nombre}" placeholder="Nombre del item" required/>
    </div>
    <div class="form-group mt-3">
      <label class=""></label>
      <input id="itemUrl" class="form-control" value="${url}" placeholder="Url del item" required/>
    </div>
    <div class="form-group mt-3">
      <label class=""></label>
      <input id="itemIcono" class="form-control" value="${icono}" placeholder="Icono del item" required/>
    </div>
  `;
};

const startWith = () => '<div class="col-12 col-lg-4">';
const endWith = () => '</div>';
const listStart = () => '<div><ul class="list-group list-group-flush">';
const listEnd = () => '</ul></div>';