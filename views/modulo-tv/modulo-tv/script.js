const actualizarTV = () => {
  console.log("CLICK")
  let state = document.getElementById("toggleTV").checked;
  const idModulo = document.getElementById('idModulo').value;


  if (!state) {
    state = 1;
  } else {
    state = 0;
  }
  Swal.showLoading();
  $.ajax({
    method: "POST",
    url: "/admin-configuraciones",
    dataType: "json",
    data: {
      activo: state,
      id: idModulo
    },
    success: function (data) {

      if (data.ok == true) {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          html: "<b>Se actualizó el módulo.</b>",
          showConfirmButton: false,
          timer: 2500,
        });
        // window.location.reload(true);
      } else {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Ocurrió un error interno inténtalo más tarde.",
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
        title: "Ocurrió un error interno inténtalo más tarde.",
        showConfirmButton: false,
        timer: 2500,
      });
    },
  });
};



const initializeTV = () => {
  $.ajax({
    method: "GET",
    url: "/admin-configuraciones/data",
    dataType: "json",

    success: function (data) {
      if (parseInt(data.activo) != 0) {
        $("#toggleTV").bootstrapToggle("on");
      }
    },
    error: function (e) {

    },
  });
};

initializeTV()

const resume = document.getElementById('resume')

$.ajax({
  method: "GET",
  url: '/admin-configuraciones/programas/index',
  dataType: 'json',
  success: (val) => {
    console.log(val)
    resume.innerHTML += `<div class="col-12 col-sm-3">
      <div class="card border-primary m-1">
        <div class="card-body text-primary">
          <h5 class="card-title text-center">Programas</h5>
          <p class="card-text text-center"><span class="h2">${val.count}</span></p>
        </div>
      </div>`
  },
  error: (error) => {
    console.log(error)
  }
})

$.ajax({
  method: "GET",
  url: '/admin-configuraciones/generos/index',
  dataType: 'json',
  success: (val) => {
    console.log(val)
    resume.innerHTML += `<div class="col-12 col-sm-3">
      <div class="card border-primary m-1">
        <div class="card-body text-primary">
          <h5 class="card-title text-center">Generos</h5>
          <p class="card-text text-center"><span class="h2">${val.count}</span></p>
        </div>
      </div>`
  },
  error: (error) => {
    console.log(error)
  }
})

$.ajax({
  method: "GET",
  url: '/admin-configuraciones/productores/index',
  dataType: 'json',
  success: (val) => {
    console.log(val)
    resume.innerHTML += `<div class="col-12 col-sm-3">
      <div class="card border-primary m-1">
        <div class="card-body text-primary">
          <h5 class="card-title text-center">Productores</h5>
          <p class="card-text text-center"><span class="h2">${val.count}</span></p>
        </div>
      </div>`
  },
  error: (error) => {
    console.log(error)
  }
})

$.ajax({
  method: "GET",
  url: '/admin-configuraciones/directores/index',
  dataType: 'json',
  success: (val) => {
    console.log(val)
    resume.innerHTML += `<div class="col-12 col-sm-3">
      <div class="card border-primary m-1">
        <div class="card-body text-primary">
          <h5 class="card-title text-center">Directores</h5>
          <p class="card-text text-center"><span class="h2">${val.count}</span></p>
        </div>
      </div>`
  },
  error: (error) => {
    console.log(error)
  }
})

$.ajax({
  method: "GET",
  url: '/admin-configuraciones/actores/index',
  dataType: 'json',
  success: (val) => {
    console.log(val)
    resume.innerHTML += `<div class="col-12 col-sm-3">
      <div class="card border-primary m-1">
        <div class="card-body text-primary">
          <h5 class="card-title text-center">actores</h5>
          <p class="card-text text-center"><span class="h2">${val.count}</span></p>
        </div>
      </div>`
  },
  error: (error) => {
    console.log(error)
  }
})

$.ajax({
  method: "GET",
  url: '/admin-configuraciones/pages/index',
  dataType: 'json',
  success: (val) => {
    console.log(val)
    resume.innerHTML += `<div class="col-12 col-sm-3">
      <div class="card border-primary m-1">
        <div class="card-body text-primary">
          <h5 class="card-title text-center">Páginas</h5>
          <p class="card-text text-center"><span class="h2">${val.count}</span></p>
        </div>
      </div>`
  },
  error: (error) => {
    console.log(error)
  }
})

$.ajax({
  method: "GET",
  url: '/admin-configuraciones/services/index',
  dataType: 'json',
  success: (val) => {
    console.log(val)
    resume.innerHTML += `<div class="col-12 col-sm-3">
      <div class="card border-primary m-1">
        <div class="card-body text-primary">
          <h5 class="card-title text-center">Servicios</h5>
          <p class="card-text text-center"><span class="h2">${val.count}</span></p>
        </div>
      </div>`
  },
  error: (error) => {
    console.log(error)
  }
})

$.ajax({
  method: "GET",
  url: '/admin-configuraciones/peliculas/index',
  dataType: 'json',
  success: (val) => {
    console.log(val)
    resume.innerHTML += `<div class="col-12 col-sm-3">
      <div class="card border-primary m-1">
        <div class="card-body text-primary">
          <h5 class="card-title text-center">Peliculas</h5>
          <p class="card-text text-center"><span class="h2">${val.count}</span></p>
        </div>
      </div>`
  },
  error: (error) => {
    console.log(error)
  }
})

$.ajax({
  method: "GET",
  url: '/admin-configuraciones/series/index',
  dataType: 'json',
  success: (val) => {
    console.log(val)
    resume.innerHTML += `<div class="col-12 col-sm-3">
      <div class="card border-primary m-1">
        <div class="card-body text-primary">
          <h5 class="card-title text-center">Series</h5>
          <p class="card-text text-center"><span class="h2">${val.count}</span></p>
        </div>
      </div>`
  },
  error: (error) => {
    console.log(error)
  }
})

$.ajax({
  method: "GET",
  url: '/admin-configuraciones/documentales/index',
  dataType: 'json',
  success: (val) => {
    console.log(val)
    resume.innerHTML += `<div class="col-12 col-sm-3">
      <div class="card border-primary m-1">
        <div class="card-body text-primary">
          <h5 class="card-title text-center">Documentales</h5>
          <p class="card-text text-center"><span class="h2">${val.count}</span></p>
        </div>
      </div>`
  },
  error: (error) => {
    console.log(error)
  }
})


