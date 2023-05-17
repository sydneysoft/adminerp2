const beforeCreate = () => {
  $.ajax({
    method: "POST",
    url: '/admin-blog/paginas/create',
    data: {},
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

