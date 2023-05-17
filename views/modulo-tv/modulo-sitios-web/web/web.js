const nombre = document.getElementById('nombre');
// const logo = document.getElementById('logo');
const imagen = document.getElementById('imagen');
const eslogan = document.getElementById('eslogan');
const telefono = document.getElementById('telefono');
const link_telefono = document.getElementById('link_telefono');
const tipo_telefono = document.getElementById('tipo');
const descripcion_telefono = document.getElementById('descripcion_telefono');


const clearForm = () => {
}
const beforeSave = (empresa_id = 0) => {
  let data  = {
    nombre: nombre.value,
    logo: imagen.value,
    eslogan: eslogan.value,
    telefono: telefono.value,
    tipo_telefono: tipo_telefono.value,
    descripcion_telefono: descripcion_telefono.value,
    empresa_id
  }
  if (favicon) {
    data.favicon = favicon.value;
  }
  save('/admin-sitios-web', data);
  setTimeout(() => window.location.reload(true), 1000)
};


const beforeUpdate = (id, empresa_id = 0) => {
  let data  = {
    nombre: nombre.value,
    logo: imagen.value,
    eslogan: eslogan.value,
    telefono: telefono.value,
    link_telefono: link_telefono.value,
    tipo_telefono: tipo_telefono.value,
    descripcion_telefono: descripcion_telefono.value,
    empresa_id
  }
  if (favicon) {
    data.favicon = favicon.value;
  }
  updateItem(`/admin-sitios-web/web/${id}`, data);
};

const userBeforeUpdate = (id) => {
  let data  =  {
    nombre: nombre.value,
    logo: imagen.value,
    eslogan: eslogan.value,
    link_telefono: link_telefono.value,
    telefono: telefono.value,
    tipo_telefono: tipo_telefono.value,
    descripcion_telefono: descripcion_telefono.value
  }
  if (favicon) {
    data.favicon = favicon.value;
  }
  updateItem(`/admin-sitios-web/web/${id}`, data);
};