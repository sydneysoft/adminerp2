const editarForm = document.getElementById('editar-genero-forms');
const idEditar = document.getElementById('idGeneroEditar');
const actualizarGenero = () => {
  $.ajax({
    method: "PUT",
    url: `/modulo-video-prime/generos/${idEditar.value}`,
    data: {
      nombre: nombreGenero.value,
      estracto: estractoGenero.value,
    },
    success: (data) => {
      console.log(data)
      if (data.ok) {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          html: "<b>Se Actulizo el programa con exito.</b>",
          showConfirmButton: false,
          timer: 2500,
        });
        clearForm()
      }
    },
    error: (error) => {
      console.log(error)
    }
  })
}

editarForm.addEventListener('submit', (event) => {
  event.preventDefault()
  actualizarGenero()
});