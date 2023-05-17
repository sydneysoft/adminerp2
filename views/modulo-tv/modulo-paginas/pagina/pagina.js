const nombre = document.getElementById('nombre');
const imagen = document.getElementById('imagen');
const estracto = document.getElementById('estracto');
const identificador = document.getElementById('identificador');

const clearForm = () => {
  nombre.value = '';
  imagen.value = '';
  estracto.value = '';
  identificador.value = 'post';
  editor.setData('', '')// <-- CKEDITOR
};

function clearImage() {
  // imagen.value = document.getElementById('urlImagen').value;
  $(".imagen_").empty();
  clearForm();
};