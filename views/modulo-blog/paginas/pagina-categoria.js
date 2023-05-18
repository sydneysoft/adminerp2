




const categoriasSeleccionadas = document.getElementById('categorySelect');
const categoriasDisponibles = document.getElementById('categoryAvailable');

const formCategoryAvailable = (data) => {
  return `
  <span class="category badge badge-primary" data-item="${data.id}">${data.nombre}</span>
  `
};

const formCategorySelect = (data) => {
  return `
  <span class="category badge badge-success" data-item="${data.id}">${data.nombre}</span>
  `
};

const categorySelect = [];
const categoryAvailable = [];

const activarEventListener = () => {
  const categories = document.getElementsByClassName('category');
  for (let i = 0; i < categories.length; i++) {
    categories[i].addEventListener('click', function () {
      toggleCategory($(this).attr('data-item'), 'donde');
    })
  }
};

/**
 * Funcion recursiva que comprueba donde esta la categoria. 
 */
const toggleCategory = (id, donde, repeat = 0) => {
  if (donde != 'donde') {
    // console.log(categoryAvailable, categorySelect)
    categoriasDisponibles.innerHTML = ''
    categoriasSeleccionadas.innerHTML = ''
    for (let i = 0; i < categoryAvailable.length; i++) {
      categoriasDisponibles.innerHTML += formCategoryAvailable(categoryAvailable[i]);
    }
    for (let i = 0; i < categorySelect.length; i++) {
      categoriasSeleccionadas.innerHTML += formCategorySelect(categorySelect[i]);
    }
    activarEventListener()
  } else {
    for (let i = 0; i < categoryAvailable.length; i++) {
      if (categoryAvailable[i].id == id) {
        donde = 'available'
        categorySelect.push(categoryAvailable[i]);
        categoryAvailable.splice(i, 1);
        continue
      }
    }
    if (donde == 'donde') {
      for (let i = 0; i < categorySelect.length; i++) {
        if (categorySelect[i].id == id) {
          donde = 'select'
          categoryAvailable.push(categorySelect[i]);
          categorySelect.splice(i, 1);
          continue
        }
      }
    }
    if (repeat < 2) {
      toggleCategory(id, donde, ++repeat);
    }
  }
}

const categoriasTach = []
addEventListener('DOMContentLoaded', () => {
  $.ajax({
    method: 'GET',
    url: `/admin-blog/paginas/categoriable/${document.getElementById('guardarItem').getAttribute('data-item')}`,
    dataType: 'json',
    success: (data) => {
      if (data.ok) {
        categoriasTach.push(...data.data)
      }
    },
    error: (error) => {
      console.log(error);
    }
  })

  $.ajax({
    method: "GET",
    dataType: 'json',
    url: `/admin-blog/categorias/get/${document.getElementById('guardarItem').getAttribute('data-empresa')}`,
    success: (data) => {
      if (data.ok) {
        const auxTach = categoriasTach.map(val => val.categoria_id);
        for (let i = 0; i < data.data.length; i++) {
          let disponible = true;
          for (let j = 0; j < auxTach.length; j++) {
            if (auxTach[j] == data.data[i].id) {
              categoriasSeleccionadas.innerHTML += formCategorySelect(data.data[i]);
              categorySelect.push(data.data[i]);
              disponible = false;
            }
          }
          if (disponible) {
            categoriasDisponibles.innerHTML += formCategoryAvailable(data.data[i]);
            categoryAvailable.push(data.data[i]);
          }
        }
        activarEventListener()
      }
    },
    error: (error) => {
      console.log(error);
    }
  });

});
