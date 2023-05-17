/**
 * Las funciones que devuelven un HTMLElement,
 * Para insertarlo en otros elementos con innerHTML, se hace uso de
 * outerHTML
 */


const formField = (id, type="text", placeholder = '', value = '', readonly=false) => {
  return `
    <div class="form-group">
      <label form="${id}">${placeholder}</label>
      <input type="${type}" id="${id}" class="form-control" placeholder="${placeholder}" name="${id}" value="${value}" ${readonly? 'readonly': ''}/>
    </div>
  `
};

const textareaField = (id, placeholder = '', value = '', readonly) => {
  return `
    <div class="form-group">
      <label form="${id}">${placeholder}</label>
      <textarea id="${id}" class="form-control" placeholder="${placeholder}" name="${id}" ${readonly? 'readonly': ''}>${value}</textarea>
    </div>
  `
};

const checkboxField = (id, placeholder = '', value="", nombre = '', selected='', readonly = false) => {
  return `
  <div class="form-check">
    <input class="form-check-input" type="checkbox" name="${nombre}" value="${value}" id="${id}" ${selected == value?'checked': ''} ${readonly ? 'disabled': ''}/>
    <label class="form-check-label" for="${id}">
      ${placeholder}
    </label>
  </div>
  `
}

const alerta = (type = 'info', value='') => {
  return `
  <div class="alert alert-${type}">
    ${value}
  </div>
  `
};

const titulo = (text = '') => {
  return `
    <div class="mb-3">
      <h4 class="text-center">${text}</h4>
    </div>
  `;
};

const selectField = (id, name) => {
  let select = document.createElement('select');
  select.id = id;
  select.name = name;
  select.class = 'form-control';
  return selectField;
};

const optionField = (value, text = '', selected = '') => {
  let option = document.createElement('option');
  option.value = value;
  option.innerHTML = text;
  if (value == selected) {
    option.selected = true;
  }
  return option;
};