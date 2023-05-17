function toastSweet(title, text, icon, position = 'top-end') {
  Swal.fire({
    toast: true,
    position: 'top-end',
    title: title,
    text: text,
    icon: icon,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
}