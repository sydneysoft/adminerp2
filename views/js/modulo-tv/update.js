const updateItem = (url, data, callback = function (result) {}) => {
  $.ajax({
    method: 'PUT',
    url,
    data,
    success: (result) => {
      if(result) {
        Swal.fire({
          toast: true,
          position: 'top-right',
          showCloseButton: true,
          title: "Notification",
          icon: 'success',
          html: `<b>${result.msg}</b>`,
          timer: 2000,
          showConfirmButton: false
        })
        if (callback instanceof Function) {
          result.data = data;
          callback(result);
        }
        // setTimeout(() => window.location.reload(true), 1000)
      }
    },
    error: (error) => {
      if (error.status === 403) {
        Swal.fire({
          toast: true,
          position: 'top-right',
          showCloseButton: true,
          title: "Notification",
          icon: 'error',
          html: `<b>Unauthenticated</b>`,
          timer: 2000,
          showConfirmButton: false
        });
        return;
      } else {
        if (error.responseJSON) {
          if (error.responseJSON.errors) {
            if (error.responseJSON.errors[0].nestedErrors) {
              let errors = ''
              error.responseJSON.errors[0].nestedErrors.forEach((error) => {
                errors += updateErrorAlertBootstrap(error.msg)
              })
              Swal.fire({
                toast: true,
                position: "top-right",
                showCloseButton: true,
                title: "Notification",
                icon: "error",
                html: errors,
                showConfirmButton: false,
                timer: 2500,
              });
            } else {
              let errors = ''
              error.responseJSON.errors.forEach((error) => {
                errors += updateErrorAlertBootstrap(error.msg)
              })
              Swal.fire({
                toast: true,
                position: "top-right",
                showCloseButton: true,
                title: "Notification",
                icon: "error",
                html: errors,
                showConfirmButton: false,
                timer: 2500,
              });
            }
          } else if(error.responseJSON.msg){
            Swal.fire({
              toast: true,
              position: "top-right",
              showCloseButton: true,
              title: "Notification",
              icon: "error",
              html: `<b>${error.responseJSON.msg}</b>`,
              showConfirmButton: false,
              timer: 2500,
            });
          } else {
            Swal.fire({
              toast: true,
              position: "top-right",
              showCloseButton: true,
              title: "Notification",
              icon: "error",
              html: `<b>${error.responseJSON.msg}</b>`,
              showConfirmButton: false,
              timer: 2500,
            });
          }
        } else {
          Swal.fire({
            toast: true,
            position: 'top-right',
            showCloseButton: true,
            title: "Notification",
            icon: 'error',
            html: error.responseText,
            timer: 2000,
            showConfirmButton: false
          })
        }
      }
    }
  })
};

function updateErrorAlertBootstrap(msg) {
  return `
    <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
      <strong>Error!</strong> ${msg}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `
};