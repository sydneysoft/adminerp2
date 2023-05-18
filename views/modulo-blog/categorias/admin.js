
const clearForm = () => {
  nombre.value = '';
  descripcion.value = '';
};

const dataForm = (empresa_id) => {
  return `
  <div class="text-left">
    <h2 class="text-center">#{translation.NEW_CATEGORY}</h2>
    <div id="alerta"></div>
    <div class="form-group">
      <label for="nombre">Nombre de la categoria</label>
      <input id="nombre" class="form-control" placeholder="#{translation.CATEGORY_NAME}" />
    </div>
    <div class="form-group">
      <label for="image">Imagen</label>
      <input id="image" class="form-control" placeholder="Imagen" value="" />
    </div>
    <div class="form-group">
      <label for="descripcion">Descripción de la categoria</label>
      <textarea id="descripcion" class="form-control" placeholder="#{translation.CATEGORY_DESCRIPTION}"></textarea>
    </div>
    <div class="mt-3">
      <button class="btn btn-primary btn-block" onclick="createItem(${empresa_id})">#{translation.SAVE}</button>
    </div>
  </div>
  `;
};

const updateData = (data) => {
  return `
  <div class="text-left">
    <h2 class="text-center">Nueva categoria</h2>
    <div id="alerta"></div>
    <div class="form-group">
      <label for="nombre">Nombre de la categoria</label>
      <input id="nombre" class="form-control" placeholder="#{translation.CATEGORY_NAME}" value="${data.nombre}" />
    </div>
    <div class="form-group">
      <label for="image">Imagen</label>
      <input id="image" class="form-control" placeholder="Imagen" value="${data.imagen}" />
    </div>
    <div class="form-group">
      <label for="descripcion">Descripción de la categoria</label>
      <textarea id="descripcion" class="form-control" placeholder="#{translation.CATEGORY_DESCRIPTION}">${data.descripcion}</textarea>
    </div>
    <div class="mt-3">
      <button class="btn btn-primary btn-block" onclick="updateCategory(${data.id}, ${data.empresa_id})">#{translation.SAVE}</button>
    </div>
  </div>
  `;
};

const showData = (data) => {
  return `
  <div class="text-left">
    <h2 class="text-center">#{translation.NEW_CATEGORY}</h2>
    <div id="alerta"></div>
    <div class="form-group">
      <label for="nombre">Nombre de la categoria</label>
      <input id="nombre" class="form-control" placeholder="Nombre de la categoria" value="${data.nombre}" readonly />
    </div>
    <div class="form-group">
      <label for="image">Imagen</label>
      <input id="image" class="form-control" placeholder="Imagen" value="${data.imagen}" readonly />
    </div>
    <div class="form-group">
      <label for="descripcion">Descripción de la categoria</label>
      <textarea id="descripcion" class="form-control" placeholder="Descripción de la categoria" readonly>${data.descripcion}</textarea>
    </div>
  </div>
  `;
};


const beforeShow = (data) => {
  const dataParse = JSON.parse(JSON.stringify(data));
  Swal.fire({
    html: showData(dataParse)
  })
};

const beforeUpdate = (data) => {
  const dataParse = JSON.parse(JSON.stringify(data));
  Swal.fire({
    html: updateData(dataParse),
    showConfirmButton: false
  })
};

const beforeCreate = (empresa_id) => {
  Swal.fire({
    html: dataForm(empresa_id),
    showConfirmButton: false
  })
};

const updateCategory = (id, empresa_id) => {
  const alerta = document.getElementById('alerta');
  $.ajax({
    method: 'PUT',
    url: `/admin-blog/categorias/${id}`,
    data: {
      nombre: document.getElementById('nombre').value,
      descripcion: document.getElementById('descripcion').value,
      imagen: document.getElementById('image').value,
      empresa_id
    },
    success: (data) => {
      if (data.ok) {
        alerta.innerHTML = `<div class="alert alert-success">${data.msg}</div>`
      }
    },
    error: (error) => {
      if (error.responseJSON) {
        if (error.responseJSON.errors) {
          alerta.innerHTML = '';
          for (let i = 0; i < error.responseJSON.errors.length; i++) {
            alerta.innerHTML += `<div class="alert alert-danger">${error.responseJSON.errors[i].msg}</div>`;
          }
        } else {
          alerta.innerHTML = `<div class="alert alert-danger">${error.responseJSON.msg}</div>`;
        }
      }
    }
  });
};

const createItem = (empresa_id) => {
  const nombre = document.getElementById('nombre');
  const descripcion = document.getElementById('descripcion');
  const alerta = document.getElementById('alerta');
  $.ajax({
    method: 'POST',
    url: '/admin-blog/categorias',
    data: {
      nombre: nombre.value,
      descripcion: descripcion.value,
      imagen: document.getElementById('image').value,
      empresa_id
    },
    success: (data) => {
      if(data.ok) {
        alerta.innerHTML = `<div class="alert alert-success">${data.msg}</div>`
        clearForm()
      }
    },
    error: (error) => {
      if (error.responseJSON) {
        if(error.responseJSON.errors) {
          alerta.innerHTML = '';
          for (let i = 0; i < error.responseJSON.errors.length; i++) {
            alerta.innerHTML += `<div class="alert alert-danger">${error.responseJSON.errors[i].msg}</div>`;
          }
        } else {
          alerta.innerHTML = `<div class="alert alert-danger">${error.responseJSON.msg}</div>`;
        }
      }
    }
  });
};