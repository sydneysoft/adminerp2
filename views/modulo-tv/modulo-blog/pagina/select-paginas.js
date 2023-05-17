let publishCheck = [];
let draftCheck = [];
/**
 * El siguiente bloque de codigo agrega un EventListener a los input[type="checkbox"]
 */
$(window).ready(function () {
  // Publish
  const inputCheck = document.getElementsByClassName('publishCheck');
  for (let i = 0; i < inputCheck.length; i++) {
    inputCheck[i].addEventListener('change', () => {
      publishLoop();
    });
  }
  // Draft
  const inputDraft = document.getElementsByClassName('draftCheck');
  for(let i = 0; i < inputDraft.length; i++) {
    inputDraft[i].addEventListener('change', () => {
      draftLoop();
    });
  }
});

const publishLoop = () => {
  publishCheck = []
  const inputCheck = document.getElementsByClassName('publishCheck');
  for (let i = 0; i < inputCheck.length; i++) {
    if (inputCheck[i].checked) {
      publishCheck.push({ id: inputCheck[i].value });
    }
  }
  publishDraftButton()
};

const draftLoop = () => {
  draftCheck = [];
  const inputDraft = document.getElementsByClassName('draftCheck');
  for(let i = 0; i < inputDraft.length; i++) {
    if (inputDraft[i].checked) {
      draftCheck.push({ id: inputDraft[i].value });
    }
  }
  draftPublishButton();
};

const draftPublishButton = () => {
  if (draftCheck.length > 0) {
    document.getElementById('draftPublishButton').disabled = false
  } else {
    document.getElementById('draftPublishButton').disabled = true
  }
}

const publishDraftButton = () => {
  if(publishCheck.length > 0) {
    document.getElementById('publishDraftButton').disabled = false
  } else {
    document.getElementById('publishDraftButton').disabled = true
  }
};

const draftPaginas = () => {
  console.log(publishCheck)
  $.ajax({
    method: 'PUT',
    url: '/admin-blog/paginas/autodraft',
    data: {
      paginas: [...publishCheck]
    },
    success: (data) => {
      console.log(data)
      if (data.ok) {
        Swal.fire({
          icon: 'success',
          html: `<b>${data.msg}</b>`
        })
        setTimeout(() => window.location.reload(true), 1000);
      }
    },
    error: (error) => {
      console.log(error);
      if(error.responseJSON) {
        Swal.fire({
          icon: 'error',
          html: `<b>${error.responseJSON.msg}</b>`
        })
      } else {
        Swal.fire({
          icon: 'error',
          html: `<b>${error.responseTEXT}</b>`
        })
      }
    }
  })
};
const publishPaginas = () => {
  console.log(draftCheck);
  $.ajax({
    method: 'PUT',
    url: '/admin-blog/paginas/autopublish',
    data: {
      paginas: [...draftCheck]
    },
    success: (data) => {
      console.log(data)
      if (data.ok) {
        Swal.fire({
          icon: 'success',
          html: `<b>${data.msg}</b>`
        })
        setTimeout(() => window.location.reload(true), 1000);
      }
    },
    error: (error) => {
      console.log(error);
      if(error.responseJSON) {
        Swal.fire({
          icon: 'error',
          html: `<b>${error.responseJSON.msg}</b>`
        })
      } else {
        Swal.fire({
          icon: 'error',
          html: `<b>${error.responseTEXT}</b>`
        })
      }
    }
  })
};