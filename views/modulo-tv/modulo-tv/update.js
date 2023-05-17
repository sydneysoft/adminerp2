const updateItem = (url, data) => {
  $.ajax({
    method: 'PUT',
    url,
    data,
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
      if (error.responseJSON) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<b>${error.responseJSON.msg}</b>`,
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: error.responseText,
          timer: 2000,
          showConfirmButton: false
        })
      }
    }
  })
}