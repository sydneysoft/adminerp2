const beforeEliminarService = (id) => {
  Swal.close()
  Swal.fire({
    position: "center",
    icon: "info",
    html: "<b>Esta seguro de eliminar este Servicio</b>",
    showConfirmButton: true
  }).then((result) => {
    if(result.isConfirmed) {
      eliminarPagina(id)
    }
  }).catch((error) => {
    console.log(error)
  });
}

const eliminarPagina = (id) => {
  $.ajax({
    method: "DELETE",
    url: `/admin-tv/services/${id}`,
    success: (data) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        html: `<b>${data.msg}</b>`,
        timer: 1500,
        showConfirmButton: false
      })
      setTimeout(() => {
        window.location.reload(true)
      }, 1500)
    },
    error: (error) => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<b>${error.responseJSON.msg}</b>`,
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}