function printPage(id) {
  var myWindow = window.open(`/cotizaciones/${id}`);

  myWindow.focus();
  myWindow.print();
  setTimeout(function () {
    myWindow.close();
  }, 200);
 
}
