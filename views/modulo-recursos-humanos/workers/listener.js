function initializeListener () {
  // Duplicate
  $('button[data-action="duplicate"]').click(duplicate);
  // EDIT
  $('button[data-action="edit"]').click(edit);
  //- DELETE
  $('#tabla-trabajadores .btn.btn-danger').click(deleteRegister);
}