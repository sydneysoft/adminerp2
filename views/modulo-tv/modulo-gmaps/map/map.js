// const formMap = (empresa_id) => {
//   let preHtml = '';
//   preHtml += titulo('Agregar Google Maps')
//   preHtml += formField('nombre', 'text', 'Nombre', '');
//   preHtml += alerta('warning', 'Por favor asegurese de incluir exactamente el embed code de google maps.');
//   preHtml += textareaField('embed', 'Embed code', '');
//   preHtml += checkboxField('activo', 'Activar', '1');
//   preHtml += `<div class="mt-3 text-right">
//     <button class="btn btn-primary btn-block" onclick="beforeSave(${empresa_id})">Guardar</button>
//   </div>`
//   return preHtml
// };

// const beforeCreateMap = (empresa_id = 0) => {
//   Swal.fire({
//     html: `<div class="text-left">${formMap(empresa_id)}</div>`,
//     showConfirmButton: false
//   });
//   document.getElementById('embed').style.height = '300px';
// };

// const beforeSave = (empresa_id = 0) => {
//   let isChecked = false;
//   if(document.getElementById('activo').checked) {
//     isChecked = true;
//   }
//   save('/admin-gmaps', {
//     nombre: document.getElementById('nombre').value,
//     embed: document.getElementById('embed').value,
//     activo: isChecked ? 1 : 0,
//     empresa_id
//   });
//   setTimeout(() => window.location.reload(true), 1000)
// };

// const mostrarMap = (data) => {
//   const map = JSON.parse(JSON.stringify(data));
//   let preHtml = '';
//   preHtml += titulo(`Ver Google Maps ${map.nombre}`)
//   preHtml += formField('mostrarnombre', 'text', 'Nombre', map.nombre, true);
//   preHtml += textareaField('mostrarembed', 'Embed code', `${map.embed}`, true);
//   preHtml += checkboxField('activo', 'Activar', '1', 'activo', map.activo, true);
//   Swal.fire({
//     html: `<div class="text-left">${preHtml}</div>`,
//     showConfirmButton: true
//   });
//   document.getElementById('mostrarembed').style.height = '300px'; 
// };

// const beforeEditMap = (data, empresa_id = 0) => {
//   const map = JSON.parse(JSON.stringify(data));
//   let preHtml = '';
//   preHtml += titulo(`Editar Google Maps ${map.nombre}`);
//   preHtml += formField('updatenombre', 'text', 'Nombre', map.nombre);
//   preHtml += alerta('warning', 'Por favor asegurese de incluir exactamente el embed code de google maps.');
//   preHtml += textareaField('updateembed', 'Embed code', `${map.embed}`);
//   preHtml += checkboxField('updateactivo', 'Activar', '1', 'activo', map.activo);
//   preHtml +=  `<div class="mt-3 text-right">
//     <button class="btn btn-primary btn-block" onclick="beforeUpdateMap(${map.id}, ${empresa_id})">Guardar</button>
//   </div>`
//   Swal.fire({
//     html: `<div class="text-left">${preHtml}</div>`,
//     showConfirmButton: false
//   });
//   document.getElementById('updateembed').style.height = '300px';
// };

