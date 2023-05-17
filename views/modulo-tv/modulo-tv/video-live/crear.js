const beforeUpdate = (empresa_id = 0) => {
  console.log('beforeUpdate')
  updateVideo(empresa_id);
};


const updateVideo = (empresa_id) => {
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
    empresa_id
  });
  // setTimeout(() => window.location.reload(true), 1000)
};