const id = document.getElementById('id')
const actualizar = () => {
  const bodyData = {
    nombre: nombre.value,
    esloganEmpresa: esloganEmpresa.value,
    telefonoEmpresa: telefonoEmpresa.value,
    direccionEmpresa: direccionEmpresa.value,
    mensaje1Empresa: mensaje1Empresa.value,
    mensaje2Empresa: mensaje2Empresa.value,
    mensaje3Empresa: mensaje3Empresa.value
    }
  $.ajax({
    method: 'PUT',
    url: `/admin-configuraciones/empresa/${id.value}`,
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