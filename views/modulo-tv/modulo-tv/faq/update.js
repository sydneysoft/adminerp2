const id = document.getElementById('idFAQ')
const actualizarFAQ = () => {
  const bodyData = {
    pregunta: pregunta.value,
    icono: icono.value,
    respuesta: editor.getData()
  }
  console.log(bodyData)
  $.ajax({
    method: 'PUT',
    url: `/admin-tv/faqs/${id.value}`,
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