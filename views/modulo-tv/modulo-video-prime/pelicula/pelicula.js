const nombre = document.getElementById('nombre');
const estracto = document.getElementById('estracto');
const externalPelicula = document.getElementById('external');
const trailer = document.getElementById('trailer');
const urlPelicula = document.getElementById('url');

const clearForm = () => {
  nombre.value = ''
  estracto.value = ''
  trailer.value = ''
  externalPelicula.checked = false
  urlPelicula.value = ''
};