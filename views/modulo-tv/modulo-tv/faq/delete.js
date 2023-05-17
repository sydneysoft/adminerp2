const beforeEliminarFAQ = (id) => {
  Swal.fire({
    position: "center",
    icon: "info",
    html: "<b>¿Esta seguro de eliminar esta pregunta?</b>",
    showConfirmButton: true
  }).then((result) => {
    if(result.isConfirmed) {
      eliminarFAQ(id)
    }
  }).catch((error) => {
    console.log(error)
  });
}

const eliminarFAQ = (id) => {
  $.ajax({
    method: "DELETE",
    url: `/admin-tv/faqs/${id}`,
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