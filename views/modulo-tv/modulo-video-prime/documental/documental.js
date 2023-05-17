const nombre = document.getElementById('nombre');
const estracto = document.getElementById('estracto');
const externalDocumental = document.getElementById('external');
const trailer = document.getElementById('trailer');
const urlDocumental = document.getElementById('url');


const clearForm = () => {
  nombre.value = ''
  estracto.value = ''
  trailer.value = ''
  externalDocumental.checked = false
  urlDocumental.value = ''
};