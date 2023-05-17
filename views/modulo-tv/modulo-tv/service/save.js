
const guardarServicio = () => {
  $.ajax({
    method: "POST",
    url: '/admin-tv/services/index',
    data: {
      nombre: nombreServicio.value,
      estracto: editor.getData(),
      thumbnail: thumbnailServicio.value,
      icono: iconoServicio.value
    },
    success: (data) => {
      if (data.ok) {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          html: "<b>Se creó el Servicio con exito.</b>",
          showConfirmButton: false,
          timer: 2500,
        });
        clearForm()
      }
    },
    error: (error) => {
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
  nombre.value = ''
  icono.value = ''
  thumbnail.value = ''
  editor.setData('', '')
}