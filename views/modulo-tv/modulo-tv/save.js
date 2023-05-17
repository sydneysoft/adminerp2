const saveItem = (url, data) => {
  $.ajax({
    method: "POST",
    url,
    data,
    success: (data) => {
      if (data.ok) {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          html: `<b>${data.msg}</b>`,
          showConfirmButton: false,
          timer: 2500,
        });
        clearForm()
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
