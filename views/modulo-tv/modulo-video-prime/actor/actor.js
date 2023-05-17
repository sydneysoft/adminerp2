const nombre = document.getElementById('nombre');
const nacionalidad = document.getElementById('nacionalidad');
const fecha_nacimiento = document.getElementById('fecha_nacimiento');
const genero = document.getElementById('genero');


const clearForm = () => {
  nombre.value = ''
  nacionalidad.value = ''
  fecha_nacimiento.value = ''
  genero.value = ''
  editor.setData('','')
};