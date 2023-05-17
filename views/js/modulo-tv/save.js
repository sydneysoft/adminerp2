// Se debe crear una funcion clearForm()
const save = (url, data, callback = function (result) {}) => {
  $.ajax({
    method: "POST",
    url: url,
    data,
    success: (result) => {
      if (result.ok) {
        Swal.fire({
          toast: true,
          position: 'top-right',
          position: "center",
          icon: "success",
          html: result.msg,
          showConfirmButton: false,
          timer: 2500,
        });
        if (callback instanceof Function) {
          result.data = data;
          callback(result);
        }
        if (typeof clearForm === "function") {
          clearForm()
        }
      }
    },
    error: (error) => {
      console.log(error);
      if(error.responseJSON) {
        if (error.responseJSON.errors) {
          if (error.responseJSON.errors[0].nestedErrors) {
            let errors = ''
            error.responseJSON.errors[0].nestedErrors.forEach((error) => {
              errors += errorAlertBootstrap(error.msg)
            })
            Swal.fire({
              toast: true,
              position: 'top-right',
              position: "center",
              icon: "error",
              html: errors,
              showConfirmButton: false,
              timer: 2500,
            });
          } else {
            let errors = ''
            error.responseJSON.errors.forEach((error) => {
              errors += errorAlertBootstrap(error.msg)
            })
            Swal.fire({
              toast: true,
              position: 'top-right',
              position: "center",
              icon: "error",
              html: errors,
              showConfirmButton: false,
              timer: 2500,
            });
          }
        } else if(error.responseJSON.msg){
          Swal.fire({
            toast: true,
            position: 'top-right',
            position: "center",
            icon: "error",
            html: `<b>${error.responseJSON.msg}</b>`,
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          Swal.fire({
            toast: true,
            position: 'top-right',
            position: "center",
            icon: "error",
            html: `<b>${error.responseJSON.msg}</b>`,
            showConfirmButton: false,
            timer: 2500,
          });
        }
      }else {
        Swal.fire({
          toast: true,
          position: 'top-right',
          position: "center",
          icon: "error",
          html: `<b>Algo salio mal</b>`,
          showConfirmButton: false,
          timer: 2500,
        });
      }
    }
  })
};

function errorAlertBootstrap(msg) {
  return `
    <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
      <strong>Error!</strong> ${msg}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `
};