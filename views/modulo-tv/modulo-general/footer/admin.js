const dataFooterUser = (id) => {
  $.ajax({
    method: 'GET',
    url: `/admin-footer/menus-admin/${id}`,
    dataType: 'json',
    success: (data) => {
      if (data.length) {
        // const data = result.data
        // console.log(data)
        for (let i = 0; i < data.length; i++) {
          let almostInner = '';
          almostInner += startWith(); // Comienza
          almostInner += list(data[i].id, data[i].nombre, data[i].descripcion);
          if (data[i].items.length) {
            almostInner += listStart();
            // Se inserta el menu
            for (let j = 0; j < data[i].items.length; j++) {
              almostInner += itemList(data[i].items[j]);
            }
            almostInner += listEnd();
          }
          almostInner += nuevoItem(data[i].id);
          almostInner += endWith(); // termina
          footerMenuList.innerHTML += almostInner;
        }
      } else {
        footerMenuList.innerHTML = withoutMenuList()
      }
    },
    error: (error) => {
      if (error.responseJSON) {
        Swal.fire({
          html: error.responseJSON.msg
        })
      } else {
        Swal.fire({
          html: error.responseText
        })
      }
    }
  })
};