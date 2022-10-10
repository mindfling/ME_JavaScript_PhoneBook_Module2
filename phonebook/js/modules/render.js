'use strict';

const {
  createHeader,
  createLogo,
  createMain,
  createButtonGroup,
  createTable,
  createForm,
  createFooter,
  createRow,
} = require('./createElement');

const renderPhonebook = (app, title) => {
  const header = createHeader();
  const logo = createLogo(title);
  const main = createMain();
  const buttonGroup = createButtonGroup([
    {
      className: 'btn btn-primary mr-3',
      type: 'button',
      text: 'Добавить',
    },
    {
      className: 'btn btn-danger',
      type: 'button',
      text: 'Удалить',
    },
  ]);
  const table = createTable();
  const {form, overlay, closeBtn} = createForm();
  const footer = createFooter();

  header.headerContainer.append(logo);
  main.mainContainer.append(buttonGroup.btnWrapper, table, overlay);
  main.append(overlay);
  footer.footerContainer.innerHTML = `Все права защищены &copy; ${title}`;
  app.append(header, main, footer);
  return {
    logo,
    head: table.thead,
    list: table.tbody,
    btnAdd: buttonGroup.btns[0],
    btnDel: buttonGroup.btns[1],
    closeBtn,
    formOverlay: overlay,
    form,
  };
};

const renderContacts = (list, data) => {
  // удаляем строки из DOM
  while (list.lastChild) {
    list.lastChild.remove();
  }
  if (data) {
    const allRows = data.map(createRow);
    list.append(...allRows);
    return allRows;
  } else {
    return [];
  }
};


module.exports = {
  renderPhonebook,
  renderContacts,
};
