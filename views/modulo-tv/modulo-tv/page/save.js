
const guardarPagina = () => {
  $.ajax({
    method: "POST",
    url: '/admin-tv/pages/index',
    data: {
      nombre: nombre.value,
      estracto: estracto.value,
      tipo: tipo.value,
      thumbnail: thumbnail.value,
      identificador: identificador.value,
      body: editor.getData()
    },
    success: (data) =>{ 
      if (data.ok) {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          html: "<b>Se creó la Página con exito.</b>",
          showConfirmButton: false,
          timer: 2500,
        });
        clearForm()
      }
    },
    error: (error) =>{
      Swal.close();
        Swal.fire({
          position: "center",
          icon: "error",
          html: `<b>${error.responseJSON.msg}</b>`,
          showConfirmButton: false,
          timer: 2500,
        });
    }
  })
}

const clearForm = () => {
  nombreGenero.value = '';
  estractoGenero.value = '';
}