const idGeneroForm = document.getElementById('idGenero');
const idDirectorForm = document.getElementById('idDirector');
const idProductorForm = document.getElementById('idProductor');

// Forms

const nombrePrograma = document.getElementById('nombre');
const num_temporadas = document.getElementById('numero_temporadas');
const sloganPrograma = document.getElementById('slogan');
const estractoPrograma = document.getElementById('estracto');
const portadaPrograma = document.getElementById('portada');
const lanzamiento = document.getElementById('lanzamiento');
const idGeneroPrograma = document.getElementById('idGenero');
const idDirectorPrograma = document.getElementById('idDirector');
const idProductorPrograma = document.getElementById('idProductor');

const getGeneros = () => {
  $.ajax({
    method: "GET",
    url: "/admin-tv/generos/index",
    dataType: "json",

    success: function (data) {
      for (let i = 0; i < data.data.length; i++) {
        let child = `<option value="${data.data[i].id}">${data.data[i].nombre}</option>`
        idGeneroForm.innerHTML += child
      }
    },
    error: function (e) {

    },
  })
}

const getDirector = () => {
  $.ajax({
    method: "GET",
    url: "/admin-tv/directores/index",
    dataType: "json",

    success: function (data) {
      for (let i = 0; i < data.data.length; i++) {
        let child = `<option value="${data.data[i].id}">${data.data[i].nombre}</option>`
        idDirectorForm.innerHTML += child
      }
    },
    error: function (e) {

    }
  })
}

const getProductor = () => {
  $.ajax({
    method: "GET",
    url: "/admin-tv/productores/index",
    dataType: "json",

    success: function (data) {
      for (let i = 0; i < data.data.length; i++) {
        let child = `<option value="${data.data[i].id}">${data.data[i].nombre}</option>`
        idProductorForm.innerHTML += child
      }
    },
    error: function (e) {

    }
  })
}

getGeneros();
getDirector();
getProductor();

const clearForm = () => {
  nombrePrograma.value = ''
  num_temporadas.value = ''
  sloganPrograma.value = ''
  estractoPrograma.value = ''
  portadaPrograma.value = ''
  lanzamiento.value = ''
  idGeneroPrograma.value = ''
  idDirectorPrograma.value = ''
  idProductorPrograma.value = ''
};