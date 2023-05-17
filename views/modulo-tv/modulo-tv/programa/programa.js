// const idGeneroForm = document.getElementById('idGenero');
// const idDirectorForm = document.getElementById('idDirector');
// const idProductorForm = document.getElementById('idProductor');

// // Forms

const nombrePrograma = document.getElementById('nombre');
const num_temporadas = document.getElementById('numero_temporadas');
const sloganPrograma = document.getElementById('slogan');
const estractoPrograma = document.getElementById('estracto');
const portadaPrograma = document.getElementById('portada');
const lanzamiento = document.getElementById('lanzamiento');
const genero = document.getElementById('genero');
const director = document.getElementById('director');
const productor = document.getElementById('productor');


const clearForm = () => {
  nombrePrograma.value = ''
  num_temporadas.value = ''
  sloganPrograma.value = ''
  estractoPrograma.value = ''
  portadaPrograma.value = ''
  lanzamiento.value = ''
  genero.value = ''
  director.value = ''
  productor.value = ''
};