addEventListener('DOMContentLoaded', () => {
  const urlImagen = document.getElementById('urlImagen');
  $('.imagen_').empty();
  if(urlImagen.value != '') {
    imagen.value = urlImagen.value;
    imagenEditar.value = urlImagen.value;
    $('.imagen_').append(`
      <img src="${urlImagen.value}" alt="Thumbnail" class="img-fluid">
    `);
  }
});
