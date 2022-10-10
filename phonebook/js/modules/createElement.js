'use strict';


const createContainer = () => {
  const container = document.createElement('div');
  container.classList.add('container');
  return container;
};

const createHeader = () => {
  const header = document.createElement('header');
  header.classList.add('header');
  const headerContainer = createContainer();
  header.append(headerContainer);
  header.headerContainer = headerContainer;
  return header;
};

const createLogo = title => {
  const h1 = document.createElement('h1');
  h1.classList.add('logo');
  h1.textContent = `Телефонный справочник. ${title}`;
  return h1;
};

const createMain = () => {
  const main = document.createElement('main');
  const mainContainer = createContainer();
  main.append(mainContainer);
  main.mainContainer = mainContainer;
  return main;
};

const createButtonGroup = params => {
  const btnWrapper = document.createElement('div');
  btnWrapper.classList.add('btn-wrapper');

  const btns = params.map(({className, type, text, title}) => {
    const button = document.createElement('button');
    button.type = type;
    button.textContent = text;
    button.className = className;
    button.title = title ? title : '';
    return button;
  });

  btnWrapper.append(...btns);
  return {
    btnWrapper,
    btns,
  };
};

const createTable = (data) => {
  const table = document.createElement('table');
  table.classList.add('table', 'table-striped');
  // генерим заголовок таблицы
  const thead = document.createElement('thead');
  /*
  thead.insertAdjacentHTML('beforeend', `
    <tr>
      <th class="delete">Удалить</th>
      <th>Имя</th>
      <th>Фамилия</th>
      <th>Телефон</th>
    </tr>
  `);
  */
  /*
  thead.insertAdjacentHTML('beforeend', `
    <tr class="table__row_head">
      <th class="delete">Удалить</th>
      <th class="table__cell_head by-name"
            data-sortby="by-name"
            title="Сортировать по Имени">Имя</th>
            <th class="table__cell_head"
            data-sortby="by-surname"
            title="Сортировать по Фамилии">Фамилия</th>
            <th class="table__cell_head by-phone descending"
            data-sortby="by-phone"
            title="Сортировать по номеру телефона">Телефон</th>
    </tr>
  `);
  */

  thead.insertAdjacentHTML('beforeend', `
    <tr class="table__row_head">
      <th class="delete">Удалить</th>
      <th class="table__cell_head by-name"
            data-sortby="by-name"
            data-sortorder=""
            title="Сортировать по Имени">Имя</th>
            <th class="table__cell_head by-surname"
            data-sortby="by-surname"
            data-sortorder=""
            title="Сортировать по Фамилии">Фамилия</th>
            <th class="table__cell_head by-phone"
            data-sortby="by-phone"
            data-sortorder=""
            title="Сортировать по номеру телефона">Телефон</th>
    </tr>
  `);

  // генерим и возращаем ссылку на тело таблицы
  const tbody = document.createElement('tbody');
  table.append(thead, tbody);
  table.thead = thead;
  table.tbody = tbody;
  return table;
};

const createForm = () => {
  const overlay = document.createElement('div');
  overlay.classList.add('form-overlay');
  const form = document.createElement('form');
  form.classList.add('form');
  form.insertAdjacentHTML('afterbegin', `
    <h2 class="form-title">Добавить Контакт</h2>
  `);
  const closeBtn = createButtonGroup([
    {
      className: 'close',
      type: 'button',
      title: 'Закрыть форму',
    },
  ]).btns[0];
  form.prepend(closeBtn);
  // сама форма в модальном окне
  form.insertAdjacentHTML('beforeend', `
    <div class="form-group">
      <label class="form-lable col-12" for="name">Имя</label>
      <input class="form-input col-12 form-control" name="name"
          id="name" type="text" required>
    </div>
    <div class="form-group">
      <label class="form-lable col-12" for="surname">Фамилия</label>
      <input class="form-input col-10 form-control" name="surname"
          id="surname" type="text" required>
    </div>
    <div class="form-group">
      <label class="form-lable col-12" for="phone">Телефон</label>
      <input class="form-input col-8 form-control" name="phone"
          id="phone" type="text" required>
    </div>
    <div class="form-group">
      <label class="col-12"></label>
    </div>
  `);
  const buttonGroup = createButtonGroup([
    {
      className: 'btn btn-primary mr-3',
      type: 'submit',
      text: 'Добавить',
    },
    {
      className: 'btn btn-danger',
      type: 'reset',
      text: 'Отмена',
    },
  ]);
  form.append(buttonGroup.btnWrapper);
  overlay.append(form);
  return {
    overlay,
    form,
    closeBtn,
  };
};

const createFooter = () => {
  const footer = document.createElement('footer');
  footer.classList.add('footer');
  const footerContainer = createContainer();
  footer.append(footerContainer);
  footer.footerContainer = footerContainer;
  footerContainer.textContent = 'Футер копирайт';
  return footer;
};


const createRow = ({name: firstname, surname, phone, id}) => {
  const tr = document.createElement('tr');
  // проверка на undefined на существование поля
  if (id) {
    tr.id = id;
    // этот id ряда конткта для идентификации
  } else {
    tr.id = 'tr' + hashCode(firstname) + hashCode(surname) + hashCode(phone);
    // такой id не существует
  }
  tr.classList.add('contact');
  tr.title = `Контакт ${surname} ${firstname}`;

  const tdDel = document.createElement('td');
  tdDel.classList.add('delete');
  const buttonDel = document.createElement('button');
  buttonDel.classList.add('del-icon');
  tdDel.append(buttonDel);

  const tdName = document.createElement('td');
  tdName.textContent = firstname;

  const tdSurname = document.createElement('td');
  tdSurname.textContent = surname;

  const tdPhone = document.createElement('td');
  const phoneLink = document.createElement('a');
  phoneLink.href = 'tel:' + phone;
  phoneLink.textContent = phone;
  tr.phoneLink = phoneLink;
  tdPhone.append(phoneLink);

  tr.append(tdDel, tdName, tdSurname, tdPhone);
  return tr;
};


module.exports = {
  // createContainer,
  createHeader,
  createLogo,
  createMain,
  createButtonGroup,
  createTable,
  createForm,
  createFooter,
  createRow,
};
