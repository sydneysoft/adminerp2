const idServicio = document.getElementById('idServicio')
const actualizarServicio = () => {
  const bodyData = {
    nombre: nombreServicio.value,
    estracto: editor.getData(),
    thumbnail: thumbnailServicio.value,
    icono: iconoServicio.value
  }
  $.ajax({
    method: 'PUT',
    url: `/admin-tv/services/${idServicio.value}`,
    data: bodyData,
    success: (data) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        html: `<b>${data.msg}</b>`,
        timer: 2000,
        showConfirmButton: false
      })
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