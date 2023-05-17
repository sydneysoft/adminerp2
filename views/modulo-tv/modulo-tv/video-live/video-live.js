const recurso = document.getElementById('recurso');
const embedAlert = document.getElementById('embedAlert');
const urlVideo = document.getElementById('url');
const embed = document.getElementById('embed');
const seleccionado = document.getElementById('seleccionado');

recurso.addEventListener('change', (event) => {
  if(event.target.value === 'embed') {
    embedAlert.innerHTML = `
      <div class="alert alert-warning" role="alert">
        <strong>Atención!</strong> Si usa la opción embed, debe copiar el código de embebido y pegarlo en el campo de texto.
      </div>
    `;
    urlVideo.disabled = true;
    embed.disabled = false;
  }else {
    embedAlert.innerHTML = '';
    urlVideo.disabled = false;
    embed.disabled = true;
  }
});

const clearForm = () => {};