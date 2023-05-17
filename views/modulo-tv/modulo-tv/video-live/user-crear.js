const beforeUpdate = () => {
  console.log('beforeUpdate')
  updateVideo(empresa_id);
};


const updateVideo = () => {
  let selected = 0;
  let src = ''
  console.log('updateVideo')
  if(seleccionado.checked) {
    selected = 1;
  }
  if(recurso.value == '') {
    src = 'local';
  }else {
    src = recurso.value
  }
  save('/admin-tv/video-live', {
    url: urlVideo.value,
    recurso: src,
    embed: embed.value,
    seleccionado: selected,
  });
  // setTimeout(() => window.location.reload(true), 1000)
};