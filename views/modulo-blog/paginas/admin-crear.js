const beforeCreate = (empresa_id) => {
  $.ajax({
    method: "POST",
    url: '/admin-blog/paginas/create',
    data: {
      empresa_id
    },
    success: (data) => {
      if (data.ok) {
        window.location.replace(data.redirect)
      }
    },
    error: (error) => {
      console.log(error)
    }
  })
};

