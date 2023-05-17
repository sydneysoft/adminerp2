const actualizarMarket = () => {
  let state = document.getElementById("toggleMarket").checked;

  if (state == true) {
    state = 1;
  } else {
    state = 0;
  }
  Swal.showLoading();
  $.ajax({
    method: "POST",
    url: "/admin-marketplace/",
    dataType: "json",
    data: {
      habilitado: state,
    },
    success: function (data) {
 
      if (data.ok == true) {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          html: "<b>#{translation.ALERTS.MODULE_UPDATED}</b>",
          showConfirmButton: false,
          timer: 2500,
        });
        window.location.reload(true);
      } else {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "error",
          title: "#{translation.ALERTS.WRONG}",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    },
    error: function (e) {
 
      Swal.close();
      Swal.fire({
        position: "center",
        icon: "error",
        title: "#{translation.ALERTS.WRONG}",
        showConfirmButton: false,
        timer: 2500,
      });
    },
  });
};
const initializeMaketplace = () => {
  $.ajax({
    method: "GET",
    url: "/admin-marketplace/data",
    dataType: "json",

    success: function (data) {
 
      if (data.result[0].habilitado != 0) {
        $("#toggleMarket").bootstrapToggle("on");
      }
    },
    error: function (e) {
 
    },
  });
};
initializeMaketplace();
