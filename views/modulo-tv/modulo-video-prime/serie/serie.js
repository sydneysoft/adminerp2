const nombre = document.getElementById('nombre');
const estracto = document.getElementById('estracto');
const externalSerie = document.getElementById('external');
const trailer = document.getElementById('trailer');
const urlSerie = document.getElementById('url');

const clearForm = () => {
  nombre.value = ''
  estracto.value = ''
  trailer.value = ''
  externalSerie.checked = false
  urlSerie.value = ''
};