const id = document.getElementById('idPagina')
const actualizarPagina = () => {
  const bodyData = {
    nombre: nombre.value,
    estracto: estracto.value,
    thumbnail: thumbnail.value,
    tipo: tipo.value,
    identificador: identificador.value,
    body: editor.getData()
  }
  $.ajax({
    method: 'PUT',
    url: `/admin-tv/pages/${id.value}`,
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