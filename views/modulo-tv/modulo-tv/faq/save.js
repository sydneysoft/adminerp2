
const guardarFAQ = () => {
  $.ajax({
    method: "POST",
    url: '/admin-tv/faqs/index',
    data: {
      pregunta: pregunta.value,
      icono: icono.value,
      respuesta: editor.getData()
    },
    success: (data) =>{ 
      if (data.ok) {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          html: "<b>Se creó la pregunta correctamente.</b>",
          showConfirmButton: false,
          timer: 2500,
        });
        clearForm()
      }
    },
    error: (error) =>{
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
  pregunta.value = ''
  icono.value = ''
  editor.setData('','')
}