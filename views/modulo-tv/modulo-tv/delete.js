const beforeDeleteItem = (url) => {
  Swal.fire({
    position: "center",
    icon: "info",
    html: "<b>¿Esta seguro de eliminar este Item?</b>",
    showConfirmButton: true
  }).then((result) => {
    if(result.isConfirmed) {
      deleteItem(url)
    }
  }).catch((error) => {
    console.log(error)
  });
}

const deleteItem = (url) => {
  $.ajax({
    method: "DELETE",
    url,
    success: (data) => {
      if(data.msg) {
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
      }
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
};