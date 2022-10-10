(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const {
  // createContainer,
  // createHeader,
  // createLogo,
  // createMain,
  // createButtonGroup,
  // createTable,
  // createForm,
  // createFooter,
  createRow,
} = require('./createElement');

// let {data} = require('./serviceStorage');
// const {data} = require('./serviceStorage');

const {
  KEY,
  // getStorage,
  setStorage,
  // makeDataContactsHashes,
  removeStorage,
  getStorage,
} = require('./serviceStorage');

let {data} = require('./serviceStorage');

const {
  renderContacts,
} = require('./render');

// добавляем на каждый ряд слушателей
const hoverRow = (allRow, logo) => {
  const text = logo.textContent;
  allRow.forEach(contact => {
    contact.addEventListener('mouseenter', () => {
      logo.textContent = contact.phoneLink?.textContent;
    });
    contact.addEventListener('mouseleave', () => {
      logo.textContent = text;
    });
  });
  return;
};

// функционал работы с модальной формой
const modalControl = ({btnAdd, formOverlay, closeBtn, objEvent}) => {
  // открыть модалку
  const openModal = () => {
    formOverlay.classList.add('is-visible');
  };

  // закрыть модалку
  const closeModal = () => {
    formOverlay.classList.remove('is-visible');
  };

  // кнопка Добавить открывает модалку
  btnAdd.addEventListener('click', objEvent);
  // btnAdd.addEventListener('click', openModal);

  formOverlay.addEventListener('click', e => {
    const target = e.target;
    // отрабатываем клик по кнокпе CLOSE и по оверлею
    if (target === closeBtn ||
        target === formOverlay) {
      closeModal();
    }
  });

  return {
    openModal,
    closeModal,
  };
};

const deleteControl = ({data, btnDel, list, objEvent}) => {
  // handleEvent obj клики по кнопкам Добавить и Удалить
  btnDel.addEventListener('click', objEvent);

  list.addEventListener('click', (e) => {
    const target = e.target;
    // клик по клетке del
    if (target.closest('.del-icon')) {
      // ряд по которому кликнули
      const targetRow = target.closest('.contact');
      // id контакта из ряда
      const dataID = targetRow.id;
      // deteleDataContact(dataID);
      data = removeStorage(KEY, dataID); // удаляем из хранилища
      // targetRow.remove(); // удаляем строку из DOM
      // выводим в консоль то что у нас вышло
      console.log('del row from data: ', data);

      // todo скрываем .delete в заголовке таблицы
      if (objEvent.isShown) {
        const head = list.parentElement.firstElementChild;
        head.querySelector('.delete').classList.remove('is-visible');
        objEvent.isShown = false;
      }

      renderContacts(list, data);
      return;
    }
  });
};

// добавляем новую строку с контактом в тело таблицы table.tbody
const addContactPage = (contact, list) => {
  list.append(createRow(contact));
};

const formControl = ({form, list, closeModal}) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // данные из формы
    // формируем объект контакт из значений полей формы
    const newContact = Object.fromEntries(formData);
    // записываем в локальное хранилище
    setStorage(KEY, newContact);
    // добавляем в DOM на страницу
    // addContactPage(newContact, list);
    data = getStorage(KEY);
    renderContacts(list, data);

    form.reset();
    closeModal();
  });
};


module.exports = {
  hoverRow,
  modalControl,
  deleteControl,
  formControl,
};

},{"./createElement":2,"./render":4,"./serviceStorage":5}],2:[function(require,module,exports){
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
  tr.id = id; // ? нужна ли проверка ?
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

},{}],3:[function(require,module,exports){
'use strict';

// * js module using CJS for hash
//  возвращает hashCode по строке str
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// возвращает сгенерированый hash id для контакта
// учитывая имя поля id
const getContactHash = (contact = {}) => {
  const hashID = Object.entries(contact)
      .reduce((accum, curr, index, arr) => {
        const currName = curr[0];
        const currVal = curr[1];
        if (currName === 'id') {
          // поле с именем id не учитывается!
          return accum;
        } else {
          return `${accum}x${hashCode(currVal).toString(32)}`;
        }
      },
      'id');
  return hashID;
};

// * экспортируем в составе модуля
module.exports = {
  getContactHash,
};

},{}],4:[function(require,module,exports){
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

},{"./createElement":2}],5:[function(require,module,exports){
'use strict';

// GLOBAL KEYS and DATA
let data = [];
const KEY = 'phone-test';
// const KEY = 'phone-test2';
// const SORT_KEY = 'phone-sort3';

const {
  getContactHash,
} = require('./hash');

// читает и возвращает данные data из Хранилища
const getStorage = (storageKey) => {
  let result = JSON.parse(localStorage.getItem(KEY));
  if (!Array.isArray(result)) {
    result = [];
  }
  return result;
};

// читает данные из хранилища добавляет к ним контакт
const setStorage = (storageKey, contact = {}) => {
  // читаем текущие данные
  data = getStorage(KEY);
  // проверяем пустой ли и масив ли вообще
  if (!Array.isArray(data)) {
    data = [];
  }
  // проверка на имя полей name, surname, phone
  if (contact.name === undefined) {
    contact.name = '';
  }
  if (contact.surname === undefined) {
    contact.surname = '';
  }
  if (contact.phone === undefined) {
    contact.phone = '';
  }
  // дабавляем хэш
  if (contact.id === undefined) {
    contact.id = getContactHash(contact);
  }
  // дабавляем контакт в data
  data.push(contact);
  // и снова перезависывает данные в хранилище
  // обновляем данные в хранилище
  localStorage.setItem(storageKey, JSON.stringify(data));
};

// читаем данные удаляем обновляем и перезаписываем
const removeStorage = (storageKey, id) => {
  // читаем текущие данные
  data = getStorage(KEY);
  // удаляем из массива контакт с этим id
  data.forEach((contact, index, arr) => {
    if (contact.id === id) {
      data.splice(index, 1);
    }
  });
  // сохраняем обратно в хранилище
  localStorage.setItem(storageKey, JSON.stringify(data));
  return data;
};

//  генерирует добавляет .id для каждого контакта объкта в массиве data
// добавляет хэши в массив возвращает и перезаписывает в хранилище
const makeDataContactsHashes = (data) => {
  let result;
  if (Array.isArray(data) && data.length > 0) {
    result = data.map((contact, index) => {
      contact.id = getContactHash(contact);
      return contact;
    });
  } else {
    result = [];
  }
  // также сохраняем в хранилище
  localStorage.setItem(KEY, JSON.stringify(result));
  return result;
};


// * exports
module.exports = {
  data,
  KEY,
  getStorage,
  setStorage,
  removeStorage,
  makeDataContactsHashes,
};

},{"./hash":3}],6:[function(require,module,exports){
'use strict';


// * sortDataBy
const sortDataBy = (sortby = '', sortorder = '', data) => {
  console.log('before sorted data: ', data);
  let sorted = [];
  switch (sortby) {
    case 'by-name':
      // сортировка по имени
      sorted = data.sort((prev, next) => {
        // ascending a, b, c, .. z order
        let namePrev = prev?.name;
        let nameNext = next?.name;
        if (sortorder === 'descending') {
          // descending z, y, x, .. a order
          namePrev = next?.name;
          nameNext = prev?.name;
        }
        if (namePrev > nameNext) {
          return 1;
        } else if (namePrev < nameNext) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case 'by-surname':
      // сортировка по фамилии
      sorted = data.sort((prev, next) => {
        // eslint-disable-next-line max-len
        const surnamePrev = (sortorder === 'ascending') ? prev.surname : next.surname;
        // eslint-disable-next-line max-len
        const surnameNext = (sortorder === 'ascending') ? next.surname : prev.surname;
        if (surnamePrev > surnameNext) {
          return 1;
        } else if (surnamePrev < surnameNext) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case 'by-phone':
      // сортировка по номеру телефона
      sorted = data.sort((prev, next) => {
        let prevPhone = '';
        let nextPhone = '';
        if (sortorder === 'ascending') {
          prevPhone = prev.phone;
          nextPhone = next.phone;
        } else {
          prevPhone = next.phone;
          nextPhone = prev.phone;
        }
        if (prevPhone > nextPhone) {
          return 1;
        } else if (prevPhone < nextPhone) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    default:
      console.log('по умолчанию');
      break;
  }
  // return data;
  return sorted;
};

module.exports = {
  sortDataBy,
};

},{}],7:[function(require,module,exports){
'use strict';

// // GLOBAL KEYS and DATA
// let data = [];
// const KEY = 'phone-test2';
const SORT_KEY = 'phone-sort3';

let {data} = require('./modules/serviceStorage');

{
  console.log('data: ', data);
  // let data = [];
  const {
    KEY,
    getStorage,
    // setStorage,
    makeDataContactsHashes,
    // removeStorage,
  } = require('./modules/serviceStorage');

  const {sortDataBy} = require('./modules/sort');

  const {
    hoverRow,
    modalControl,
    deleteControl,
    formControl,
  } = require('./modules/control');

  const {
    renderPhonebook,
    renderContacts,
  } = require('./modules/render');


  // * MAIN INIT *
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);

    console.log('begin data: ', data);
    // читаем данные контактов из Хранилища
    data = getStorage(KEY);
    console.log('getStorage data: ', data);
    // обновляем хэши id контактов
    data = makeDataContactsHashes(data);

    // перенести в makeDataContactsHashes

    // читаем данные о сортировке
    let sortInfo = {};
    // let sortInfo = JSON.parse(localStorage.getItem(SORT_KEY)); // todo

    const {
      head, // table thead
      list, // table tbody
      logo,
      btnAdd,
      btnDel,
      formOverlay,
      closeBtn,
      form,
    } = renderPhonebook(app, title);

    // objEvent обработчик событий кликов на btnAdd и btnDel
    const objEventBtns = {
      isShown: false, // в начале закрыты все ячейки с кнопками .delete
      handleEvent(event) {
        const target = event.target;
        const cellDeleteAll = list.parentElement.querySelectorAll('.delete');
        // при нажатии на кнопку Добавить btnAdd
        if (target === btnAdd) {
        // здесь делаем видимым оверлай и модалку
          formOverlay.classList.add('is-visible');
          // здесь скрываем все кнопки .delete
          // const cellDeleteAll = table.querySelectorAll('.delete');
          this.isShown = false;
          cellDeleteAll.forEach(cellDelete => {
            cellDelete.classList.remove('is-visible');
          });
        // при нажатии на кнопку Удалить btnDel
        } else if (target === btnDel) {
        // здесь показываем все кнопки .delete
          if (this.isShown) {
          // если видимые то скрываем
            this.isShown = false;
            cellDeleteAll.forEach(cellDelete => {
              cellDelete.classList.remove('is-visible');
            });
          } else {
          // если были скрытые то показываем
            this.isShown = true;
            cellDeleteAll.forEach(cellDelete => {
              cellDelete.classList.add('is-visible');
            });
          }
        }
      },
    };

    // ФУНКЦИОНАЛ ЗДЕСЬ
    // init sort params: sortorder sortby
    if (!(sortInfo = JSON.parse(localStorage.getItem(SORT_KEY)))) {
      // если sortInfo неТ в хранилище
      // заполняем значением по умолчанию
      sortInfo = {
        sortby: 'by-name',
        sortorder: 'ascending',
      };
      // сохраняем в хранилище
      localStorage.setItem(SORT_KEY, JSON.stringify(sortInfo));
    } else {
      // если сохранено в хранилище
      console.log('начальные значения в хранилище sortInfo:', sortInfo);
    }

    // initial rows sorting
    for (const child of head.firstElementChild.children) {
      //   child.classList.remove('ascending');
      //   child.classList.remove('descending');
      //   child.dataset.sortorder = '';
      if (child.dataset.sortby === sortInfo.sortby) {
        child.classList.add(sortInfo.sortorder);
        child.dataset.sortorder = sortInfo.sortorder; // flag
      }
    }

    data = sortDataBy(sortInfo.sortby, sortInfo.sortorder, data);
    // потом перерендериваем
    const allRow = renderContacts(list, data);

    head.addEventListener('click', e => {
      const target = e.target;

      // click по клеткам заголовка таблицы для сортировки
      if (target.classList.contains('table__cell_head')) {
        // перебираем все дочерние клетки ряда заголовка таблицы
        for (const child of head.firstElementChild.children) {
          if (target === child) {
            // ПУСТАЯ ВКЛАДКА ""
            if (child.dataset.sortorder === '') {
              child.dataset.sortorder = 'descending';
              child.classList.remove('ascending');
              child.classList.add('descending');
              console.log('empty to ascending');
            }

            if (child.dataset.sortorder === 'ascending') {
              child.dataset.sortorder = 'descending';
              child.classList.remove('ascending');
              child.classList.add('descending');
              console.log('ascending to descending');
            } else if (child.dataset.sortorder === 'descending') {
              child.dataset.sortorder = 'ascending';
              child.classList.remove('descending');
              child.classList.add('ascending');
              console.log('descending to ascending');
            }
          } else {
            child.classList.remove('ascending');
            child.classList.remove('descending');
            child.dataset.sortorder = '';
          }
        }

        sortInfo.sortby = target.dataset?.sortby;
        sortInfo.sortorder = target.dataset?.sortorder;
        // обновляем данные о сортировке в хранилище
        localStorage.setItem(SORT_KEY, JSON.stringify(sortInfo));


        if (objEventBtns.isShown) {
          console.log('delete скрываем');
          head.querySelector('.delete').classList.remove('is-visible');
          objEventBtns.isShown = false;
        }
        // осктльные в таблице просто перерендерятся
        data = getStorage(KEY);
        // сортируем
        const sortData = sortDataBy(sortInfo.sortby, sortInfo.sortorder, data);
        // перерисовка обновленного списка контактов
        renderContacts(list, sortData);
      }
    });

    hoverRow(allRow, logo); // навешиваем слушателей hover при инициализации
    // навешивать слушателей еще и при добавлении нового ряда
    const {closeModal} = modalControl({
      formOverlay,
      btnAdd,
      closeBtn,
      objEvent: objEventBtns,
    });
    deleteControl({data, btnDel, list, objEvent: objEventBtns});
    formControl({form, list, closeModal});
  };


  window.phonebookInit = init;
}

},{"./modules/control":1,"./modules/render":4,"./modules/serviceStorage":5,"./modules/sort":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVqcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvY29udHJvbC5qcyIsInBob25lYm9vay9qcy9tb2R1bGVzL2NyZWF0ZUVsZW1lbnQuanMiLCJwaG9uZWJvb2svanMvbW9kdWxlcy9oYXNoLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvcmVuZGVyLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvc2VydmljZVN0b3JhZ2UuanMiLCJwaG9uZWJvb2svanMvbW9kdWxlcy9zb3J0LmpzIiwicGhvbmVib29rL2pzL3NjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCB7XHJcbiAgLy8gY3JlYXRlQ29udGFpbmVyLFxyXG4gIC8vIGNyZWF0ZUhlYWRlcixcclxuICAvLyBjcmVhdGVMb2dvLFxyXG4gIC8vIGNyZWF0ZU1haW4sXHJcbiAgLy8gY3JlYXRlQnV0dG9uR3JvdXAsXHJcbiAgLy8gY3JlYXRlVGFibGUsXHJcbiAgLy8gY3JlYXRlRm9ybSxcclxuICAvLyBjcmVhdGVGb290ZXIsXHJcbiAgY3JlYXRlUm93LFxyXG59ID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50Jyk7XHJcblxyXG4vLyBsZXQge2RhdGF9ID0gcmVxdWlyZSgnLi9zZXJ2aWNlU3RvcmFnZScpO1xyXG4vLyBjb25zdCB7ZGF0YX0gPSByZXF1aXJlKCcuL3NlcnZpY2VTdG9yYWdlJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgS0VZLFxyXG4gIC8vIGdldFN0b3JhZ2UsXHJcbiAgc2V0U3RvcmFnZSxcclxuICAvLyBtYWtlRGF0YUNvbnRhY3RzSGFzaGVzLFxyXG4gIHJlbW92ZVN0b3JhZ2UsXHJcbiAgZ2V0U3RvcmFnZSxcclxufSA9IHJlcXVpcmUoJy4vc2VydmljZVN0b3JhZ2UnKTtcclxuXHJcbmxldCB7ZGF0YX0gPSByZXF1aXJlKCcuL3NlcnZpY2VTdG9yYWdlJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgcmVuZGVyQ29udGFjdHMsXHJcbn0gPSByZXF1aXJlKCcuL3JlbmRlcicpO1xyXG5cclxuLy8g0LTQvtCx0LDQstC70Y/QtdC8INC90LAg0LrQsNC20LTRi9C5INGA0Y/QtCDRgdC70YPRiNCw0YLQtdC70LXQuVxyXG5jb25zdCBob3ZlclJvdyA9IChhbGxSb3csIGxvZ28pID0+IHtcclxuICBjb25zdCB0ZXh0ID0gbG9nby50ZXh0Q29udGVudDtcclxuICBhbGxSb3cuZm9yRWFjaChjb250YWN0ID0+IHtcclxuICAgIGNvbnRhY3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcclxuICAgICAgbG9nby50ZXh0Q29udGVudCA9IGNvbnRhY3QucGhvbmVMaW5rPy50ZXh0Q29udGVudDtcclxuICAgIH0pO1xyXG4gICAgY29udGFjdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xyXG4gICAgICBsb2dvLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybjtcclxufTtcclxuXHJcbi8vINGE0YPQvdC60YbQuNC+0L3QsNC7INGA0LDQsdC+0YLRiyDRgSDQvNC+0LTQsNC70YzQvdC+0Lkg0YTQvtGA0LzQvtC5XHJcbmNvbnN0IG1vZGFsQ29udHJvbCA9ICh7YnRuQWRkLCBmb3JtT3ZlcmxheSwgY2xvc2VCdG4sIG9iakV2ZW50fSkgPT4ge1xyXG4gIC8vINC+0YLQutGA0YvRgtGMINC80L7QtNCw0LvQutGDXHJcbiAgY29uc3Qgb3Blbk1vZGFsID0gKCkgPT4ge1xyXG4gICAgZm9ybU92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xyXG4gIH07XHJcblxyXG4gIC8vINC30LDQutGA0YvRgtGMINC80L7QtNCw0LvQutGDXHJcbiAgY29uc3QgY2xvc2VNb2RhbCA9ICgpID0+IHtcclxuICAgIGZvcm1PdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICB9O1xyXG5cclxuICAvLyDQutC90L7Qv9C60LAg0JTQvtCx0LDQstC40YLRjCDQvtGC0LrRgNGL0LLQsNC10YIg0LzQvtC00LDQu9C60YNcclxuICBidG5BZGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvYmpFdmVudCk7XHJcbiAgLy8gYnRuQWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3Blbk1vZGFsKTtcclxuXHJcbiAgZm9ybU92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgLy8g0L7RgtGA0LDQsdCw0YLRi9Cy0LDQtdC8INC60LvQuNC6INC/0L4g0LrQvdC+0LrQv9C1IENMT1NFINC4INC/0L4g0L7QstC10YDQu9C10Y5cclxuICAgIGlmICh0YXJnZXQgPT09IGNsb3NlQnRuIHx8XHJcbiAgICAgICAgdGFyZ2V0ID09PSBmb3JtT3ZlcmxheSkge1xyXG4gICAgICBjbG9zZU1vZGFsKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBvcGVuTW9kYWwsXHJcbiAgICBjbG9zZU1vZGFsLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBkZWxldGVDb250cm9sID0gKHtkYXRhLCBidG5EZWwsIGxpc3QsIG9iakV2ZW50fSkgPT4ge1xyXG4gIC8vIGhhbmRsZUV2ZW50IG9iaiDQutC70LjQutC4INC/0L4g0LrQvdC+0L/QutCw0Lwg0JTQvtCx0LDQstC40YLRjCDQuCDQo9C00LDQu9C40YLRjFxyXG4gIGJ0bkRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9iakV2ZW50KTtcclxuXHJcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgIC8vINC60LvQuNC6INC/0L4g0LrQu9C10YLQutC1IGRlbFxyXG4gICAgaWYgKHRhcmdldC5jbG9zZXN0KCcuZGVsLWljb24nKSkge1xyXG4gICAgICAvLyDRgNGP0LQg0L/QviDQutC+0YLQvtGA0L7QvNGDINC60LvQuNC60L3Rg9C70LhcclxuICAgICAgY29uc3QgdGFyZ2V0Um93ID0gdGFyZ2V0LmNsb3Nlc3QoJy5jb250YWN0Jyk7XHJcbiAgICAgIC8vIGlkINC60L7QvdGC0LDQutGC0LAg0LjQtyDRgNGP0LTQsFxyXG4gICAgICBjb25zdCBkYXRhSUQgPSB0YXJnZXRSb3cuaWQ7XHJcbiAgICAgIC8vIGRldGVsZURhdGFDb250YWN0KGRhdGFJRCk7XHJcbiAgICAgIGRhdGEgPSByZW1vdmVTdG9yYWdlKEtFWSwgZGF0YUlEKTsgLy8g0YPQtNCw0LvRj9C10Lwg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LBcclxuICAgICAgLy8gdGFyZ2V0Um93LnJlbW92ZSgpOyAvLyDRg9C00LDQu9GP0LXQvCDRgdGC0YDQvtC60YMg0LjQtyBET01cclxuICAgICAgLy8g0LLRi9Cy0L7QtNC40Lwg0LIg0LrQvtC90YHQvtC70Ywg0YLQviDRh9GC0L4g0YMg0L3QsNGBINCy0YvRiNC70L5cclxuICAgICAgY29uc29sZS5sb2coJ2RlbCByb3cgZnJvbSBkYXRhOiAnLCBkYXRhKTtcclxuXHJcbiAgICAgIC8vIHRvZG8g0YHQutGA0YvQstCw0LXQvCAuZGVsZXRlINCyINC30LDQs9C+0LvQvtCy0LrQtSDRgtCw0LHQu9C40YbRi1xyXG4gICAgICBpZiAob2JqRXZlbnQuaXNTaG93bikge1xyXG4gICAgICAgIGNvbnN0IGhlYWQgPSBsaXN0LnBhcmVudEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICAgICAgaGVhZC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgIG9iakV2ZW50LmlzU2hvd24gPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVuZGVyQ29udGFjdHMobGlzdCwgZGF0YSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbi8vINC00L7QsdCw0LLQu9GP0LXQvCDQvdC+0LLRg9GOINGB0YLRgNC+0LrRgyDRgSDQutC+0L3RgtCw0LrRgtC+0Lwg0LIg0YLQtdC70L4g0YLQsNCx0LvQuNGG0YsgdGFibGUudGJvZHlcclxuY29uc3QgYWRkQ29udGFjdFBhZ2UgPSAoY29udGFjdCwgbGlzdCkgPT4ge1xyXG4gIGxpc3QuYXBwZW5kKGNyZWF0ZVJvdyhjb250YWN0KSk7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtQ29udHJvbCA9ICh7Zm9ybSwgbGlzdCwgY2xvc2VNb2RhbH0pID0+IHtcclxuICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7IC8vINC00LDQvdC90YvQtSDQuNC3INGE0L7RgNC80YtcclxuICAgIC8vINGE0L7RgNC80LjRgNGD0LXQvCDQvtCx0YrQtdC60YIg0LrQvtC90YLQsNC60YIg0LjQtyDQt9C90LDRh9C10L3QuNC5INC/0L7Qu9C10Lkg0YTQvtGA0LzRi1xyXG4gICAgY29uc3QgbmV3Q29udGFjdCA9IE9iamVjdC5mcm9tRW50cmllcyhmb3JtRGF0YSk7XHJcbiAgICAvLyDQt9Cw0L/QuNGB0YvQstCw0LXQvCDQsiDQu9C+0LrQsNC70YzQvdC+0LUg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgICBzZXRTdG9yYWdlKEtFWSwgbmV3Q29udGFjdCk7XHJcbiAgICAvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0LIgRE9NINC90LAg0YHRgtGA0LDQvdC40YbRg1xyXG4gICAgLy8gYWRkQ29udGFjdFBhZ2UobmV3Q29udGFjdCwgbGlzdCk7XHJcbiAgICBkYXRhID0gZ2V0U3RvcmFnZShLRVkpO1xyXG4gICAgcmVuZGVyQ29udGFjdHMobGlzdCwgZGF0YSk7XHJcblxyXG4gICAgZm9ybS5yZXNldCgpO1xyXG4gICAgY2xvc2VNb2RhbCgpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGhvdmVyUm93LFxyXG4gIG1vZGFsQ29udHJvbCxcclxuICBkZWxldGVDb250cm9sLFxyXG4gIGZvcm1Db250cm9sLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuY29uc3QgY3JlYXRlQ29udGFpbmVyID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjb250YWluZXInKTtcclxuICByZXR1cm4gY29udGFpbmVyO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlSGVhZGVyID0gKCkgPT4ge1xyXG4gIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hlYWRlcicpO1xyXG4gIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXInKTtcclxuICBjb25zdCBoZWFkZXJDb250YWluZXIgPSBjcmVhdGVDb250YWluZXIoKTtcclxuICBoZWFkZXIuYXBwZW5kKGhlYWRlckNvbnRhaW5lcik7XHJcbiAgaGVhZGVyLmhlYWRlckNvbnRhaW5lciA9IGhlYWRlckNvbnRhaW5lcjtcclxuICByZXR1cm4gaGVhZGVyO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlTG9nbyA9IHRpdGxlID0+IHtcclxuICBjb25zdCBoMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XHJcbiAgaDEuY2xhc3NMaXN0LmFkZCgnbG9nbycpO1xyXG4gIGgxLnRleHRDb250ZW50ID0gYNCi0LXQu9C10YTQvtC90L3Ri9C5INGB0L/RgNCw0LLQvtGH0L3QuNC6LiAke3RpdGxlfWA7XHJcbiAgcmV0dXJuIGgxO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlTWFpbiA9ICgpID0+IHtcclxuICBjb25zdCBtYWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWFpbicpO1xyXG4gIGNvbnN0IG1haW5Db250YWluZXIgPSBjcmVhdGVDb250YWluZXIoKTtcclxuICBtYWluLmFwcGVuZChtYWluQ29udGFpbmVyKTtcclxuICBtYWluLm1haW5Db250YWluZXIgPSBtYWluQ29udGFpbmVyO1xyXG4gIHJldHVybiBtYWluO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlQnV0dG9uR3JvdXAgPSBwYXJhbXMgPT4ge1xyXG4gIGNvbnN0IGJ0bldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBidG5XcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2J0bi13cmFwcGVyJyk7XHJcblxyXG4gIGNvbnN0IGJ0bnMgPSBwYXJhbXMubWFwKCh7Y2xhc3NOYW1lLCB0eXBlLCB0ZXh0LCB0aXRsZX0pID0+IHtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgYnV0dG9uLnR5cGUgPSB0eXBlO1xyXG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgICBidXR0b24udGl0bGUgPSB0aXRsZSA/IHRpdGxlIDogJyc7XHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG4gIH0pO1xyXG5cclxuICBidG5XcmFwcGVyLmFwcGVuZCguLi5idG5zKTtcclxuICByZXR1cm4ge1xyXG4gICAgYnRuV3JhcHBlcixcclxuICAgIGJ0bnMsXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZVRhYmxlID0gKGRhdGEpID0+IHtcclxuICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJyk7XHJcbiAgdGFibGUuY2xhc3NMaXN0LmFkZCgndGFibGUnLCAndGFibGUtc3RyaXBlZCcpO1xyXG4gIC8vINCz0LXQvdC10YDQuNC8INC30LDQs9C+0LvQvtCy0L7QuiDRgtCw0LHQu9C40YbRi1xyXG4gIGNvbnN0IHRoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGhlYWQnKTtcclxuICAvKlxyXG4gIHRoZWFkLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYFxyXG4gICAgPHRyPlxyXG4gICAgICA8dGggY2xhc3M9XCJkZWxldGVcIj7Qo9C00LDQu9C40YLRjDwvdGg+XHJcbiAgICAgIDx0aD7QmNC80Y88L3RoPlxyXG4gICAgICA8dGg+0KTQsNC80LjQu9C40Y88L3RoPlxyXG4gICAgICA8dGg+0KLQtdC70LXRhNC+0L08L3RoPlxyXG4gICAgPC90cj5cclxuICBgKTtcclxuICAqL1xyXG4gIHRoZWFkLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYFxyXG4gICAgPHRyIGNsYXNzPVwidGFibGVfX3Jvd19oZWFkXCI+XHJcbiAgICAgIDx0aCBjbGFzcz1cImRlbGV0ZVwiPtCj0LTQsNC70LjRgtGMPC90aD5cclxuICAgICAgPHRoIGNsYXNzPVwidGFibGVfX2NlbGxfaGVhZCBieS1uYW1lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0Ynk9XCJieS1uYW1lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0b3JkZXI9XCJcIlxyXG4gICAgICAgICAgICB0aXRsZT1cItCh0L7RgNGC0LjRgNC+0LLQsNGC0Ywg0L/QviDQmNC80LXQvdC4XCI+0JjQvNGPPC90aD5cclxuICAgICAgICAgICAgPHRoIGNsYXNzPVwidGFibGVfX2NlbGxfaGVhZCBieS1zdXJuYW1lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0Ynk9XCJieS1zdXJuYW1lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0b3JkZXI9XCJcIlxyXG4gICAgICAgICAgICB0aXRsZT1cItCh0L7RgNGC0LjRgNC+0LLQsNGC0Ywg0L/QviDQpNCw0LzQuNC70LjQuFwiPtCk0LDQvNC40LvQuNGPPC90aD5cclxuICAgICAgICAgICAgPHRoIGNsYXNzPVwidGFibGVfX2NlbGxfaGVhZCBieS1waG9uZVwiXHJcbiAgICAgICAgICAgIGRhdGEtc29ydGJ5PVwiYnktcGhvbmVcIlxyXG4gICAgICAgICAgICBkYXRhLXNvcnRvcmRlcj1cIlwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwi0KHQvtGA0YLQuNGA0L7QstCw0YLRjCDQv9C+INC90L7QvNC10YDRgyDRgtC10LvQtdGE0L7QvdCwXCI+0KLQtdC70LXRhNC+0L08L3RoPlxyXG4gICAgPC90cj5cclxuICBgKTtcclxuXHJcbiAgLy8g0LPQtdC90LXRgNC40Lwg0Lgg0LLQvtC30YDQsNGJ0LDQtdC8INGB0YHRi9C70LrRgyDQvdCwINGC0LXQu9C+INGC0LDQsdC70LjRhtGLXHJcbiAgY29uc3QgdGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0Ym9keScpO1xyXG4gIHRhYmxlLmFwcGVuZCh0aGVhZCwgdGJvZHkpO1xyXG4gIHRhYmxlLnRoZWFkID0gdGhlYWQ7XHJcbiAgdGFibGUudGJvZHkgPSB0Ym9keTtcclxuICByZXR1cm4gdGFibGU7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVGb3JtID0gKCkgPT4ge1xyXG4gIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tb3ZlcmxheScpO1xyXG4gIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XHJcbiAgZm9ybS5jbGFzc0xpc3QuYWRkKCdmb3JtJyk7XHJcbiAgZm9ybS5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBgXHJcbiAgICA8aDIgY2xhc3M9XCJmb3JtLXRpdGxlXCI+0JTQvtCx0LDQstC40YLRjCDQmtC+0L3RgtCw0LrRgjwvaDI+XHJcbiAgYCk7XHJcbiAgY29uc3QgY2xvc2VCdG4gPSBjcmVhdGVCdXR0b25Hcm91cChbXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZTogJ2Nsb3NlJyxcclxuICAgICAgdHlwZTogJ2J1dHRvbicsXHJcbiAgICAgIHRpdGxlOiAn0JfQsNC60YDRi9GC0Ywg0YTQvtGA0LzRgycsXHJcbiAgICB9LFxyXG4gIF0pLmJ0bnNbMF07XHJcbiAgZm9ybS5wcmVwZW5kKGNsb3NlQnRuKTtcclxuICAvLyDRgdCw0LzQsCDRhNC+0YDQvNCwINCyINC80L7QtNCw0LvRjNC90L7QvCDQvtC60L3QtVxyXG4gIGZvcm0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmxlIGNvbC0xMlwiIGZvcj1cIm5hbWVcIj7QmNC80Y88L2xhYmVsPlxyXG4gICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWlucHV0IGNvbC0xMiBmb3JtLWNvbnRyb2xcIiBuYW1lPVwibmFtZVwiXHJcbiAgICAgICAgICBpZD1cIm5hbWVcIiB0eXBlPVwidGV4dFwiIHJlcXVpcmVkPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmxlIGNvbC0xMlwiIGZvcj1cInN1cm5hbWVcIj7QpNCw0LzQuNC70LjRjzwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0taW5wdXQgY29sLTEwIGZvcm0tY29udHJvbFwiIG5hbWU9XCJzdXJuYW1lXCJcclxuICAgICAgICAgIGlkPVwic3VybmFtZVwiIHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFibGUgY29sLTEyXCIgZm9yPVwicGhvbmVcIj7QotC10LvQtdGE0L7QvTwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0taW5wdXQgY29sLTggZm9ybS1jb250cm9sXCIgbmFtZT1cInBob25lXCJcclxuICAgICAgICAgIGlkPVwicGhvbmVcIiB0eXBlPVwidGV4dFwiIHJlcXVpcmVkPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJjb2wtMTJcIj48L2xhYmVsPlxyXG4gICAgPC9kaXY+XHJcbiAgYCk7XHJcbiAgY29uc3QgYnV0dG9uR3JvdXAgPSBjcmVhdGVCdXR0b25Hcm91cChbXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tcHJpbWFyeSBtci0zJyxcclxuICAgICAgdHlwZTogJ3N1Ym1pdCcsXHJcbiAgICAgIHRleHQ6ICfQlNC+0LHQsNCy0LjRgtGMJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tZGFuZ2VyJyxcclxuICAgICAgdHlwZTogJ3Jlc2V0JyxcclxuICAgICAgdGV4dDogJ9Ce0YLQvNC10L3QsCcsXHJcbiAgICB9LFxyXG4gIF0pO1xyXG4gIGZvcm0uYXBwZW5kKGJ1dHRvbkdyb3VwLmJ0bldyYXBwZXIpO1xyXG4gIG92ZXJsYXkuYXBwZW5kKGZvcm0pO1xyXG4gIHJldHVybiB7XHJcbiAgICBvdmVybGF5LFxyXG4gICAgZm9ybSxcclxuICAgIGNsb3NlQnRuLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVGb290ZXIgPSAoKSA9PiB7XHJcbiAgY29uc3QgZm9vdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9vdGVyJyk7XHJcbiAgZm9vdGVyLmNsYXNzTGlzdC5hZGQoJ2Zvb3RlcicpO1xyXG4gIGNvbnN0IGZvb3RlckNvbnRhaW5lciA9IGNyZWF0ZUNvbnRhaW5lcigpO1xyXG4gIGZvb3Rlci5hcHBlbmQoZm9vdGVyQ29udGFpbmVyKTtcclxuICBmb290ZXIuZm9vdGVyQ29udGFpbmVyID0gZm9vdGVyQ29udGFpbmVyO1xyXG4gIGZvb3RlckNvbnRhaW5lci50ZXh0Q29udGVudCA9ICfQpNGD0YLQtdGAINC60L7Qv9C40YDQsNC50YInO1xyXG4gIHJldHVybiBmb290ZXI7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVSb3cgPSAoe25hbWU6IGZpcnN0bmFtZSwgc3VybmFtZSwgcGhvbmUsIGlkfSkgPT4ge1xyXG4gIGNvbnN0IHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuICAvLyDQv9GA0L7QstC10YDQutCwINC90LAgdW5kZWZpbmVkINC90LAg0YHRg9GJ0LXRgdGC0LLQvtCy0LDQvdC40LUg0L/QvtC70Y9cclxuICB0ci5pZCA9IGlkOyAvLyA/INC90YPQttC90LAg0LvQuCDQv9GA0L7QstC10YDQutCwID9cclxuICB0ci5jbGFzc0xpc3QuYWRkKCdjb250YWN0Jyk7XHJcbiAgdHIudGl0bGUgPSBg0JrQvtC90YLQsNC60YIgJHtzdXJuYW1lfSAke2ZpcnN0bmFtZX1gO1xyXG5cclxuICBjb25zdCB0ZERlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgdGREZWwuY2xhc3NMaXN0LmFkZCgnZGVsZXRlJyk7XHJcbiAgY29uc3QgYnV0dG9uRGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgYnV0dG9uRGVsLmNsYXNzTGlzdC5hZGQoJ2RlbC1pY29uJyk7XHJcbiAgdGREZWwuYXBwZW5kKGJ1dHRvbkRlbCk7XHJcblxyXG4gIGNvbnN0IHRkTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgdGROYW1lLnRleHRDb250ZW50ID0gZmlyc3RuYW1lO1xyXG5cclxuICBjb25zdCB0ZFN1cm5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gIHRkU3VybmFtZS50ZXh0Q29udGVudCA9IHN1cm5hbWU7XHJcblxyXG4gIGNvbnN0IHRkUGhvbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gIGNvbnN0IHBob25lTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICBwaG9uZUxpbmsuaHJlZiA9ICd0ZWw6JyArIHBob25lO1xyXG4gIHBob25lTGluay50ZXh0Q29udGVudCA9IHBob25lO1xyXG4gIHRyLnBob25lTGluayA9IHBob25lTGluaztcclxuICB0ZFBob25lLmFwcGVuZChwaG9uZUxpbmspO1xyXG5cclxuICB0ci5hcHBlbmQodGREZWwsIHRkTmFtZSwgdGRTdXJuYW1lLCB0ZFBob25lKTtcclxuICByZXR1cm4gdHI7XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLy8gY3JlYXRlQ29udGFpbmVyLFxyXG4gIGNyZWF0ZUhlYWRlcixcclxuICBjcmVhdGVMb2dvLFxyXG4gIGNyZWF0ZU1haW4sXHJcbiAgY3JlYXRlQnV0dG9uR3JvdXAsXHJcbiAgY3JlYXRlVGFibGUsXHJcbiAgY3JlYXRlRm9ybSxcclxuICBjcmVhdGVGb290ZXIsXHJcbiAgY3JlYXRlUm93LFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyAqIGpzIG1vZHVsZSB1c2luZyBDSlMgZm9yIGhhc2hcclxuLy8gINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCIGhhc2hDb2RlINC/0L4g0YHRgtGA0L7QutC1IHN0clxyXG5jb25zdCBoYXNoQ29kZSA9IChzdHIpID0+IHtcclxuICBsZXQgaGFzaCA9IDA7XHJcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgY29uc3QgY2hyID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICBoYXNoID0gKGhhc2ggPDwgNSkgLSBoYXNoICsgY2hyO1xyXG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcclxuICB9XHJcbiAgcmV0dXJuIE1hdGguYWJzKGhhc2gpO1xyXG59O1xyXG5cclxuLy8g0LLQvtC30LLRgNCw0YnQsNC10YIg0YHQs9C10L3QtdGA0LjRgNC+0LLQsNC90YvQuSBoYXNoIGlkINC00LvRjyDQutC+0L3RgtCw0LrRgtCwXHJcbi8vINGD0YfQuNGC0YvQstCw0Y8g0LjQvNGPINC/0L7Qu9GPIGlkXHJcbmNvbnN0IGdldENvbnRhY3RIYXNoID0gKGNvbnRhY3QgPSB7fSkgPT4ge1xyXG4gIGNvbnN0IGhhc2hJRCA9IE9iamVjdC5lbnRyaWVzKGNvbnRhY3QpXHJcbiAgICAgIC5yZWR1Y2UoKGFjY3VtLCBjdXJyLCBpbmRleCwgYXJyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY3Vyck5hbWUgPSBjdXJyWzBdO1xyXG4gICAgICAgIGNvbnN0IGN1cnJWYWwgPSBjdXJyWzFdO1xyXG4gICAgICAgIGlmIChjdXJyTmFtZSA9PT0gJ2lkJykge1xyXG4gICAgICAgICAgLy8g0L/QvtC70LUg0YEg0LjQvNC10L3QtdC8IGlkINC90LUg0YPRh9C40YLRi9Cy0LDQtdGC0YHRjyFcclxuICAgICAgICAgIHJldHVybiBhY2N1bTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGAke2FjY3VtfXgke2hhc2hDb2RlKGN1cnJWYWwpLnRvU3RyaW5nKDMyKX1gO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgJ2lkJyk7XHJcbiAgcmV0dXJuIGhhc2hJRDtcclxufTtcclxuXHJcbi8vICog0Y3QutGB0L/QvtGA0YLQuNGA0YPQtdC8INCyINGB0L7RgdGC0LDQstC1INC80L7QtNGD0LvRj1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBnZXRDb250YWN0SGFzaCxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qge1xyXG4gIGNyZWF0ZUhlYWRlcixcclxuICBjcmVhdGVMb2dvLFxyXG4gIGNyZWF0ZU1haW4sXHJcbiAgY3JlYXRlQnV0dG9uR3JvdXAsXHJcbiAgY3JlYXRlVGFibGUsXHJcbiAgY3JlYXRlRm9ybSxcclxuICBjcmVhdGVGb290ZXIsXHJcbiAgY3JlYXRlUm93LFxyXG59ID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50Jyk7XHJcblxyXG5jb25zdCByZW5kZXJQaG9uZWJvb2sgPSAoYXBwLCB0aXRsZSkgPT4ge1xyXG4gIGNvbnN0IGhlYWRlciA9IGNyZWF0ZUhlYWRlcigpO1xyXG4gIGNvbnN0IGxvZ28gPSBjcmVhdGVMb2dvKHRpdGxlKTtcclxuICBjb25zdCBtYWluID0gY3JlYXRlTWFpbigpO1xyXG4gIGNvbnN0IGJ1dHRvbkdyb3VwID0gY3JlYXRlQnV0dG9uR3JvdXAoW1xyXG4gICAge1xyXG4gICAgICBjbGFzc05hbWU6ICdidG4gYnRuLXByaW1hcnkgbXItMycsXHJcbiAgICAgIHR5cGU6ICdidXR0b24nLFxyXG4gICAgICB0ZXh0OiAn0JTQvtCx0LDQstC40YLRjCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBjbGFzc05hbWU6ICdidG4gYnRuLWRhbmdlcicsXHJcbiAgICAgIHR5cGU6ICdidXR0b24nLFxyXG4gICAgICB0ZXh0OiAn0KPQtNCw0LvQuNGC0YwnLFxyXG4gICAgfSxcclxuICBdKTtcclxuICBjb25zdCB0YWJsZSA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgY29uc3Qge2Zvcm0sIG92ZXJsYXksIGNsb3NlQnRufSA9IGNyZWF0ZUZvcm0oKTtcclxuICBjb25zdCBmb290ZXIgPSBjcmVhdGVGb290ZXIoKTtcclxuXHJcbiAgaGVhZGVyLmhlYWRlckNvbnRhaW5lci5hcHBlbmQobG9nbyk7XHJcbiAgbWFpbi5tYWluQ29udGFpbmVyLmFwcGVuZChidXR0b25Hcm91cC5idG5XcmFwcGVyLCB0YWJsZSwgb3ZlcmxheSk7XHJcbiAgbWFpbi5hcHBlbmQob3ZlcmxheSk7XHJcbiAgZm9vdGVyLmZvb3RlckNvbnRhaW5lci5pbm5lckhUTUwgPSBg0JLRgdC1INC/0YDQsNCy0LAg0LfQsNGJ0LjRidC10L3RiyAmY29weTsgJHt0aXRsZX1gO1xyXG4gIGFwcC5hcHBlbmQoaGVhZGVyLCBtYWluLCBmb290ZXIpO1xyXG4gIHJldHVybiB7XHJcbiAgICBsb2dvLFxyXG4gICAgaGVhZDogdGFibGUudGhlYWQsXHJcbiAgICBsaXN0OiB0YWJsZS50Ym9keSxcclxuICAgIGJ0bkFkZDogYnV0dG9uR3JvdXAuYnRuc1swXSxcclxuICAgIGJ0bkRlbDogYnV0dG9uR3JvdXAuYnRuc1sxXSxcclxuICAgIGNsb3NlQnRuLFxyXG4gICAgZm9ybU92ZXJsYXk6IG92ZXJsYXksXHJcbiAgICBmb3JtLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCByZW5kZXJDb250YWN0cyA9IChsaXN0LCBkYXRhKSA9PiB7XHJcbiAgLy8g0YPQtNCw0LvRj9C10Lwg0YHRgtGA0L7QutC4INC40LcgRE9NXHJcbiAgd2hpbGUgKGxpc3QubGFzdENoaWxkKSB7XHJcbiAgICBsaXN0Lmxhc3RDaGlsZC5yZW1vdmUoKTtcclxuICB9XHJcbiAgaWYgKGRhdGEpIHtcclxuICAgIGNvbnN0IGFsbFJvd3MgPSBkYXRhLm1hcChjcmVhdGVSb3cpO1xyXG4gICAgbGlzdC5hcHBlbmQoLi4uYWxsUm93cyk7XHJcbiAgICByZXR1cm4gYWxsUm93cztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICByZW5kZXJQaG9uZWJvb2ssXHJcbiAgcmVuZGVyQ29udGFjdHMsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIEdMT0JBTCBLRVlTIGFuZCBEQVRBXHJcbmxldCBkYXRhID0gW107XHJcbmNvbnN0IEtFWSA9ICdwaG9uZS10ZXN0JztcclxuLy8gY29uc3QgS0VZID0gJ3Bob25lLXRlc3QyJztcclxuLy8gY29uc3QgU09SVF9LRVkgPSAncGhvbmUtc29ydDMnO1xyXG5cclxuY29uc3Qge1xyXG4gIGdldENvbnRhY3RIYXNoLFxyXG59ID0gcmVxdWlyZSgnLi9oYXNoJyk7XHJcblxyXG4vLyDRh9C40YLQsNC10YIg0Lgg0LLQvtC30LLRgNCw0YnQsNC10YIg0LTQsNC90L3Ri9C1IGRhdGEg0LjQtyDQpdGA0LDQvdC40LvQuNGJ0LBcclxuY29uc3QgZ2V0U3RvcmFnZSA9IChzdG9yYWdlS2V5KSA9PiB7XHJcbiAgbGV0IHJlc3VsdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oS0VZKSk7XHJcbiAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcclxuICAgIHJlc3VsdCA9IFtdO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLy8g0YfQuNGC0LDQtdGCINC00LDQvdC90YvQtSDQuNC3INGF0YDQsNC90LjQu9C40YnQsCDQtNC+0LHQsNCy0LvRj9C10YIg0Log0L3QuNC8INC60L7QvdGC0LDQutGCXHJcbmNvbnN0IHNldFN0b3JhZ2UgPSAoc3RvcmFnZUtleSwgY29udGFjdCA9IHt9KSA9PiB7XHJcbiAgLy8g0YfQuNGC0LDQtdC8INGC0LXQutGD0YnQuNC1INC00LDQvdC90YvQtVxyXG4gIGRhdGEgPSBnZXRTdG9yYWdlKEtFWSk7XHJcbiAgLy8g0L/RgNC+0LLQtdGA0Y/QtdC8INC/0YPRgdGC0L7QuSDQu9C4INC4INC80LDRgdC40LIg0LvQuCDQstC+0L7QsdGJ0LVcclxuICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuICAgIGRhdGEgPSBbXTtcclxuICB9XHJcbiAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQvdCwINC40LzRjyDQv9C+0LvQtdC5IG5hbWUsIHN1cm5hbWUsIHBob25lXHJcbiAgaWYgKGNvbnRhY3QubmFtZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb250YWN0Lm5hbWUgPSAnJztcclxuICB9XHJcbiAgaWYgKGNvbnRhY3Quc3VybmFtZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb250YWN0LnN1cm5hbWUgPSAnJztcclxuICB9XHJcbiAgaWYgKGNvbnRhY3QucGhvbmUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgY29udGFjdC5waG9uZSA9ICcnO1xyXG4gIH1cclxuICAvLyDQtNCw0LHQsNCy0LvRj9C10Lwg0YXRjdGIXHJcbiAgaWYgKGNvbnRhY3QuaWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgY29udGFjdC5pZCA9IGdldENvbnRhY3RIYXNoKGNvbnRhY3QpO1xyXG4gIH1cclxuICAvLyDQtNCw0LHQsNCy0LvRj9C10Lwg0LrQvtC90YLQsNC60YIg0LIgZGF0YVxyXG4gIGRhdGEucHVzaChjb250YWN0KTtcclxuICAvLyDQuCDRgdC90L7QstCwINC/0LXRgNC10LfQsNCy0LjRgdGL0LLQsNC10YIg0LTQsNC90L3Ri9C1INCyINGF0YDQsNC90LjQu9C40YnQtVxyXG4gIC8vINC+0LHQvdC+0LLQu9GP0LXQvCDQtNCw0L3QvdGL0LUg0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc3RvcmFnZUtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG59O1xyXG5cclxuLy8g0YfQuNGC0LDQtdC8INC00LDQvdC90YvQtSDRg9C00LDQu9GP0LXQvCDQvtCx0L3QvtCy0LvRj9C10Lwg0Lgg0L/QtdGA0LXQt9Cw0L/QuNGB0YvQstCw0LXQvFxyXG5jb25zdCByZW1vdmVTdG9yYWdlID0gKHN0b3JhZ2VLZXksIGlkKSA9PiB7XHJcbiAgLy8g0YfQuNGC0LDQtdC8INGC0LXQutGD0YnQuNC1INC00LDQvdC90YvQtVxyXG4gIGRhdGEgPSBnZXRTdG9yYWdlKEtFWSk7XHJcbiAgLy8g0YPQtNCw0LvRj9C10Lwg0LjQtyDQvNCw0YHRgdC40LLQsCDQutC+0L3RgtCw0LrRgiDRgSDRjdGC0LjQvCBpZFxyXG4gIGRhdGEuZm9yRWFjaCgoY29udGFjdCwgaW5kZXgsIGFycikgPT4ge1xyXG4gICAgaWYgKGNvbnRhY3QuaWQgPT09IGlkKSB7XHJcbiAgICAgIGRhdGEuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICB9KTtcclxuICAvLyDRgdC+0YXRgNCw0L3Rj9C10Lwg0L7QsdGA0LDRgtC90L4g0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc3RvcmFnZUtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gIHJldHVybiBkYXRhO1xyXG59O1xyXG5cclxuLy8gINCz0LXQvdC10YDQuNGA0YPQtdGCINC00L7QsdCw0LLQu9GP0LXRgiAuaWQg0LTQu9GPINC60LDQttC00L7Qs9C+INC60L7QvdGC0LDQutGC0LAg0L7QsdGK0LrRgtCwINCyINC80LDRgdGB0LjQstC1IGRhdGFcclxuLy8g0LTQvtCx0LDQstC70Y/QtdGCINGF0Y3RiNC4INCyINC80LDRgdGB0LjQsiDQstC+0LfQstGA0LDRidCw0LXRgiDQuCDQv9C10YDQtdC30LDQv9C40YHRi9Cy0LDQtdGCINCyINGF0YDQsNC90LjQu9C40YnQtVxyXG5jb25zdCBtYWtlRGF0YUNvbnRhY3RzSGFzaGVzID0gKGRhdGEpID0+IHtcclxuICBsZXQgcmVzdWx0O1xyXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIGRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgcmVzdWx0ID0gZGF0YS5tYXAoKGNvbnRhY3QsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnRhY3QuaWQgPSBnZXRDb250YWN0SGFzaChjb250YWN0KTtcclxuICAgICAgcmV0dXJuIGNvbnRhY3Q7XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmVzdWx0ID0gW107XHJcbiAgfVxyXG4gIC8vINGC0LDQutC20LUg0YHQvtGF0YDQsNC90Y/QtdC8INCyINGF0YDQsNC90LjQu9C40YnQtVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEtFWSwgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcblxyXG4vLyAqIGV4cG9ydHNcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZGF0YSxcclxuICBLRVksXHJcbiAgZ2V0U3RvcmFnZSxcclxuICBzZXRTdG9yYWdlLFxyXG4gIHJlbW92ZVN0b3JhZ2UsXHJcbiAgbWFrZURhdGFDb250YWN0c0hhc2hlcyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbi8vICogc29ydERhdGFCeVxyXG5jb25zdCBzb3J0RGF0YUJ5ID0gKHNvcnRieSA9ICcnLCBzb3J0b3JkZXIgPSAnJywgZGF0YSkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdiZWZvcmUgc29ydGVkIGRhdGE6ICcsIGRhdGEpO1xyXG4gIGxldCBzb3J0ZWQgPSBbXTtcclxuICBzd2l0Y2ggKHNvcnRieSkge1xyXG4gICAgY2FzZSAnYnktbmFtZSc6XHJcbiAgICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L4g0LjQvNC10L3QuFxyXG4gICAgICBzb3J0ZWQgPSBkYXRhLnNvcnQoKHByZXYsIG5leHQpID0+IHtcclxuICAgICAgICAvLyBhc2NlbmRpbmcgYSwgYiwgYywgLi4geiBvcmRlclxyXG4gICAgICAgIGxldCBuYW1lUHJldiA9IHByZXY/Lm5hbWU7XHJcbiAgICAgICAgbGV0IG5hbWVOZXh0ID0gbmV4dD8ubmFtZTtcclxuICAgICAgICBpZiAoc29ydG9yZGVyID09PSAnZGVzY2VuZGluZycpIHtcclxuICAgICAgICAgIC8vIGRlc2NlbmRpbmcgeiwgeSwgeCwgLi4gYSBvcmRlclxyXG4gICAgICAgICAgbmFtZVByZXYgPSBuZXh0Py5uYW1lO1xyXG4gICAgICAgICAgbmFtZU5leHQgPSBwcmV2Py5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmFtZVByZXYgPiBuYW1lTmV4dCkge1xyXG4gICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuYW1lUHJldiA8IG5hbWVOZXh0KSB7XHJcbiAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnYnktc3VybmFtZSc6XHJcbiAgICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L4g0YTQsNC80LjQu9C40LhcclxuICAgICAgc29ydGVkID0gZGF0YS5zb3J0KChwcmV2LCBuZXh0KSA9PiB7XHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cclxuICAgICAgICBjb25zdCBzdXJuYW1lUHJldiA9IChzb3J0b3JkZXIgPT09ICdhc2NlbmRpbmcnKSA/IHByZXYuc3VybmFtZSA6IG5leHQuc3VybmFtZTtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxyXG4gICAgICAgIGNvbnN0IHN1cm5hbWVOZXh0ID0gKHNvcnRvcmRlciA9PT0gJ2FzY2VuZGluZycpID8gbmV4dC5zdXJuYW1lIDogcHJldi5zdXJuYW1lO1xyXG4gICAgICAgIGlmIChzdXJuYW1lUHJldiA+IHN1cm5hbWVOZXh0KSB7XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN1cm5hbWVQcmV2IDwgc3VybmFtZU5leHQpIHtcclxuICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdieS1waG9uZSc6XHJcbiAgICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L4g0L3QvtC80LXRgNGDINGC0LXQu9C10YTQvtC90LBcclxuICAgICAgc29ydGVkID0gZGF0YS5zb3J0KChwcmV2LCBuZXh0KSA9PiB7XHJcbiAgICAgICAgbGV0IHByZXZQaG9uZSA9ICcnO1xyXG4gICAgICAgIGxldCBuZXh0UGhvbmUgPSAnJztcclxuICAgICAgICBpZiAoc29ydG9yZGVyID09PSAnYXNjZW5kaW5nJykge1xyXG4gICAgICAgICAgcHJldlBob25lID0gcHJldi5waG9uZTtcclxuICAgICAgICAgIG5leHRQaG9uZSA9IG5leHQucGhvbmU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHByZXZQaG9uZSA9IG5leHQucGhvbmU7XHJcbiAgICAgICAgICBuZXh0UGhvbmUgPSBwcmV2LnBob25lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocHJldlBob25lID4gbmV4dFBob25lKSB7XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHByZXZQaG9uZSA8IG5leHRQaG9uZSkge1xyXG4gICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGNvbnNvbGUubG9nKCfQv9C+INGD0LzQvtC70YfQsNC90LjRjicpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbiAgLy8gcmV0dXJuIGRhdGE7XHJcbiAgcmV0dXJuIHNvcnRlZDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHNvcnREYXRhQnksXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIC8vIEdMT0JBTCBLRVlTIGFuZCBEQVRBXHJcbi8vIGxldCBkYXRhID0gW107XHJcbi8vIGNvbnN0IEtFWSA9ICdwaG9uZS10ZXN0Mic7XHJcbmNvbnN0IFNPUlRfS0VZID0gJ3Bob25lLXNvcnQzJztcclxuXHJcbmxldCB7ZGF0YX0gPSByZXF1aXJlKCcuL21vZHVsZXMvc2VydmljZVN0b3JhZ2UnKTtcclxuXHJcbntcclxuICBjb25zb2xlLmxvZygnZGF0YTogJywgZGF0YSk7XHJcbiAgLy8gbGV0IGRhdGEgPSBbXTtcclxuICBjb25zdCB7XHJcbiAgICBLRVksXHJcbiAgICBnZXRTdG9yYWdlLFxyXG4gICAgLy8gc2V0U3RvcmFnZSxcclxuICAgIG1ha2VEYXRhQ29udGFjdHNIYXNoZXMsXHJcbiAgICAvLyByZW1vdmVTdG9yYWdlLFxyXG4gIH0gPSByZXF1aXJlKCcuL21vZHVsZXMvc2VydmljZVN0b3JhZ2UnKTtcclxuXHJcbiAgY29uc3Qge3NvcnREYXRhQnl9ID0gcmVxdWlyZSgnLi9tb2R1bGVzL3NvcnQnKTtcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgaG92ZXJSb3csXHJcbiAgICBtb2RhbENvbnRyb2wsXHJcbiAgICBkZWxldGVDb250cm9sLFxyXG4gICAgZm9ybUNvbnRyb2wsXHJcbiAgfSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9jb250cm9sJyk7XHJcblxyXG4gIGNvbnN0IHtcclxuICAgIHJlbmRlclBob25lYm9vayxcclxuICAgIHJlbmRlckNvbnRhY3RzLFxyXG4gIH0gPSByZXF1aXJlKCcuL21vZHVsZXMvcmVuZGVyJyk7XHJcblxyXG5cclxuICAvLyAqIE1BSU4gSU5JVCAqXHJcbiAgY29uc3QgaW5pdCA9IChzZWxlY3RvckFwcCwgdGl0bGUpID0+IHtcclxuICAgIGNvbnN0IGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JBcHApO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdiZWdpbiBkYXRhOiAnLCBkYXRhKTtcclxuICAgIC8vINGH0LjRgtCw0LXQvCDQtNCw0L3QvdGL0LUg0LrQvtC90YLQsNC60YLQvtCyINC40Lcg0KXRgNCw0L3QuNC70LjRidCwXHJcbiAgICBkYXRhID0gZ2V0U3RvcmFnZShLRVkpO1xyXG4gICAgY29uc29sZS5sb2coJ2dldFN0b3JhZ2UgZGF0YTogJywgZGF0YSk7XHJcbiAgICAvLyDQvtCx0L3QvtCy0LvRj9C10Lwg0YXRjdGI0LggaWQg0LrQvtC90YLQsNC60YLQvtCyXHJcbiAgICBkYXRhID0gbWFrZURhdGFDb250YWN0c0hhc2hlcyhkYXRhKTtcclxuXHJcbiAgICAvLyDQv9C10YDQtdC90LXRgdGC0Lgg0LIgbWFrZURhdGFDb250YWN0c0hhc2hlc1xyXG5cclxuICAgIC8vINGH0LjRgtCw0LXQvCDQtNCw0L3QvdGL0LUg0L4g0YHQvtGA0YLQuNGA0L7QstC60LVcclxuICAgIGxldCBzb3J0SW5mbyA9IHt9O1xyXG4gICAgLy8gbGV0IHNvcnRJbmZvID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTT1JUX0tFWSkpOyAvLyB0b2RvXHJcblxyXG4gICAgY29uc3Qge1xyXG4gICAgICBoZWFkLCAvLyB0YWJsZSB0aGVhZFxyXG4gICAgICBsaXN0LCAvLyB0YWJsZSB0Ym9keVxyXG4gICAgICBsb2dvLFxyXG4gICAgICBidG5BZGQsXHJcbiAgICAgIGJ0bkRlbCxcclxuICAgICAgZm9ybU92ZXJsYXksXHJcbiAgICAgIGNsb3NlQnRuLFxyXG4gICAgICBmb3JtLFxyXG4gICAgfSA9IHJlbmRlclBob25lYm9vayhhcHAsIHRpdGxlKTtcclxuXHJcbiAgICAvLyBvYmpFdmVudCDQvtCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjQuSDQutC70LjQutC+0LIg0L3QsCBidG5BZGQg0LggYnRuRGVsXHJcbiAgICBjb25zdCBvYmpFdmVudEJ0bnMgPSB7XHJcbiAgICAgIGlzU2hvd246IGZhbHNlLCAvLyDQsiDQvdCw0YfQsNC70LUg0LfQsNC60YDRi9GC0Ysg0LLRgdC1INGP0YfQtdC50LrQuCDRgSDQutC90L7Qv9C60LDQvNC4IC5kZWxldGVcclxuICAgICAgaGFuZGxlRXZlbnQoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgY29uc3QgY2VsbERlbGV0ZUFsbCA9IGxpc3QucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGVsZXRlJyk7XHJcbiAgICAgICAgLy8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrQvdC+0L/QutGDINCU0L7QsdCw0LLQuNGC0YwgYnRuQWRkXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gYnRuQWRkKSB7XHJcbiAgICAgICAgLy8g0LfQtNC10YHRjCDQtNC10LvQsNC10Lwg0LLQuNC00LjQvNGL0Lwg0L7QstC10YDQu9Cw0Lkg0Lgg0LzQvtC00LDQu9C60YNcclxuICAgICAgICAgIGZvcm1PdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXZpc2libGUnKTtcclxuICAgICAgICAgIC8vINC30LTQtdGB0Ywg0YHQutGA0YvQstCw0LXQvCDQstGB0LUg0LrQvdC+0L/QutC4IC5kZWxldGVcclxuICAgICAgICAgIC8vIGNvbnN0IGNlbGxEZWxldGVBbGwgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKCcuZGVsZXRlJyk7XHJcbiAgICAgICAgICB0aGlzLmlzU2hvd24gPSBmYWxzZTtcclxuICAgICAgICAgIGNlbGxEZWxldGVBbGwuZm9yRWFjaChjZWxsRGVsZXRlID0+IHtcclxuICAgICAgICAgICAgY2VsbERlbGV0ZS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAvLyDQv9GA0Lgg0L3QsNC20LDRgtC40Lgg0L3QsCDQutC90L7Qv9C60YMg0KPQtNCw0LvQuNGC0YwgYnRuRGVsXHJcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IGJ0bkRlbCkge1xyXG4gICAgICAgIC8vINC30LTQtdGB0Ywg0L/QvtC60LDQt9GL0LLQsNC10Lwg0LLRgdC1INC60L3QvtC/0LrQuCAuZGVsZXRlXHJcbiAgICAgICAgICBpZiAodGhpcy5pc1Nob3duKSB7XHJcbiAgICAgICAgICAvLyDQtdGB0LvQuCDQstC40LTQuNC80YvQtSDRgtC+INGB0LrRgNGL0LLQsNC10LxcclxuICAgICAgICAgICAgdGhpcy5pc1Nob3duID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNlbGxEZWxldGVBbGwuZm9yRWFjaChjZWxsRGVsZXRlID0+IHtcclxuICAgICAgICAgICAgICBjZWxsRGVsZXRlLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8g0LXRgdC70Lgg0LHRi9C70Lgg0YHQutGA0YvRgtGL0LUg0YLQviDQv9C+0LrQsNC30YvQstCw0LXQvFxyXG4gICAgICAgICAgICB0aGlzLmlzU2hvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICBjZWxsRGVsZXRlQWxsLmZvckVhY2goY2VsbERlbGV0ZSA9PiB7XHJcbiAgICAgICAgICAgICAgY2VsbERlbGV0ZS5jbGFzc0xpc3QuYWRkKCdpcy12aXNpYmxlJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgLy8g0KTQo9Cd0JrQptCY0J7QndCQ0Jsg0JfQlNCV0KHQrFxyXG4gICAgLy8gaW5pdCBzb3J0IHBhcmFtczogc29ydG9yZGVyIHNvcnRieVxyXG4gICAgaWYgKCEoc29ydEluZm8gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNPUlRfS0VZKSkpKSB7XHJcbiAgICAgIC8vINC10YHQu9C4IHNvcnRJbmZvINC90LXQoiDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICAgICAgLy8g0LfQsNC/0L7Qu9C90Y/QtdC8INC30L3QsNGH0LXQvdC40LXQvCDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgICBzb3J0SW5mbyA9IHtcclxuICAgICAgICBzb3J0Ynk6ICdieS1uYW1lJyxcclxuICAgICAgICBzb3J0b3JkZXI6ICdhc2NlbmRpbmcnLFxyXG4gICAgICB9O1xyXG4gICAgICAvLyDRgdC+0YXRgNCw0L3Rj9C10Lwg0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNPUlRfS0VZLCBKU09OLnN0cmluZ2lmeShzb3J0SW5mbykpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8g0LXRgdC70Lgg0YHQvtGF0YDQsNC90LXQvdC+INCyINGF0YDQsNC90LjQu9C40YnQtVxyXG4gICAgICBjb25zb2xlLmxvZygn0L3QsNGH0LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LIg0YXRgNCw0L3QuNC70LjRidC1IHNvcnRJbmZvOicsIHNvcnRJbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpbml0aWFsIHJvd3Mgc29ydGluZ1xyXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBoZWFkLmZpcnN0RWxlbWVudENoaWxkLmNoaWxkcmVuKSB7XHJcbiAgICAgIC8vICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnYXNjZW5kaW5nJyk7XHJcbiAgICAgIC8vICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnZGVzY2VuZGluZycpO1xyXG4gICAgICAvLyAgIGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID0gJyc7XHJcbiAgICAgIGlmIChjaGlsZC5kYXRhc2V0LnNvcnRieSA9PT0gc29ydEluZm8uc29ydGJ5KSB7XHJcbiAgICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZChzb3J0SW5mby5zb3J0b3JkZXIpO1xyXG4gICAgICAgIGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID0gc29ydEluZm8uc29ydG9yZGVyOyAvLyBmbGFnXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkYXRhID0gc29ydERhdGFCeShzb3J0SW5mby5zb3J0YnksIHNvcnRJbmZvLnNvcnRvcmRlciwgZGF0YSk7XHJcbiAgICAvLyDQv9C+0YLQvtC8INC/0LXRgNC10YDQtdC90LTQtdGA0LjQstCw0LXQvFxyXG4gICAgY29uc3QgYWxsUm93ID0gcmVuZGVyQ29udGFjdHMobGlzdCwgZGF0YSk7XHJcblxyXG4gICAgaGVhZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgIC8vIGNsaWNrINC/0L4g0LrQu9C10YLQutCw0Lwg0LfQsNCz0L7Qu9C+0LLQutCwINGC0LDQsdC70LjRhtGLINC00LvRjyDRgdC+0YDRgtC40YDQvtCy0LrQuFxyXG4gICAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndGFibGVfX2NlbGxfaGVhZCcpKSB7XHJcbiAgICAgICAgLy8g0L/QtdGA0LXQsdC40YDQsNC10Lwg0LLRgdC1INC00L7Rh9C10YDQvdC40LUg0LrQu9C10YLQutC4INGA0Y/QtNCwINC30LDQs9C+0LvQvtCy0LrQsCDRgtCw0LHQu9C40YbRi1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgaGVhZC5maXJzdEVsZW1lbnRDaGlsZC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgaWYgKHRhcmdldCA9PT0gY2hpbGQpIHtcclxuICAgICAgICAgICAgLy8g0J/Qo9Ch0KLQkNCvINCS0JrQm9CQ0JTQmtCQIFwiXCJcclxuICAgICAgICAgICAgaWYgKGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID09PSAnJykge1xyXG4gICAgICAgICAgICAgIGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID0gJ2Rlc2NlbmRpbmcnO1xyXG4gICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2FzY2VuZGluZycpO1xyXG4gICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoJ2Rlc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZW1wdHkgdG8gYXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9PT0gJ2FzY2VuZGluZycpIHtcclxuICAgICAgICAgICAgICBjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9ICdkZXNjZW5kaW5nJztcclxuICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKCdkZXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FzY2VuZGluZyB0byBkZXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQuZGF0YXNldC5zb3J0b3JkZXIgPT09ICdkZXNjZW5kaW5nJykge1xyXG4gICAgICAgICAgICAgIGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID0gJ2FzY2VuZGluZyc7XHJcbiAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnZGVzY2VuZGluZycpO1xyXG4gICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoJ2FzY2VuZGluZycpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXNjZW5kaW5nIHRvIGFzY2VuZGluZycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnZGVzY2VuZGluZycpO1xyXG4gICAgICAgICAgICBjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc29ydEluZm8uc29ydGJ5ID0gdGFyZ2V0LmRhdGFzZXQ/LnNvcnRieTtcclxuICAgICAgICBzb3J0SW5mby5zb3J0b3JkZXIgPSB0YXJnZXQuZGF0YXNldD8uc29ydG9yZGVyO1xyXG4gICAgICAgIC8vINC+0LHQvdC+0LLQu9GP0LXQvCDQtNCw0L3QvdGL0LUg0L4g0YHQvtGA0YLQuNGA0L7QstC60LUg0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU09SVF9LRVksIEpTT04uc3RyaW5naWZ5KHNvcnRJbmZvKSk7XHJcblxyXG5cclxuICAgICAgICBpZiAob2JqRXZlbnRCdG5zLmlzU2hvd24pIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWxldGUg0YHQutGA0YvQstCw0LXQvCcpO1xyXG4gICAgICAgICAgaGVhZC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgICAgb2JqRXZlbnRCdG5zLmlzU2hvd24gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g0L7RgdC60YLQu9GM0L3Ri9C1INCyINGC0LDQsdC70LjRhtC1INC/0YDQvtGB0YLQviDQv9C10YDQtdGA0LXQvdC00LXRgNGP0YLRgdGPXHJcbiAgICAgICAgZGF0YSA9IGdldFN0b3JhZ2UoS0VZKTtcclxuICAgICAgICAvLyDRgdC+0YDRgtC40YDRg9C10LxcclxuICAgICAgICBjb25zdCBzb3J0RGF0YSA9IHNvcnREYXRhQnkoc29ydEluZm8uc29ydGJ5LCBzb3J0SW5mby5zb3J0b3JkZXIsIGRhdGEpO1xyXG4gICAgICAgIC8vINC/0LXRgNC10YDQuNGB0L7QstC60LAg0L7QsdC90L7QstC70LXQvdC90L7Qs9C+INGB0L/QuNGB0LrQsCDQutC+0L3RgtCw0LrRgtC+0LJcclxuICAgICAgICByZW5kZXJDb250YWN0cyhsaXN0LCBzb3J0RGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGhvdmVyUm93KGFsbFJvdywgbG9nbyk7IC8vINC90LDQstC10YjQuNCy0LDQtdC8INGB0LvRg9GI0LDRgtC10LvQtdC5IGhvdmVyINC/0YDQuCDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuFxyXG4gICAgLy8g0L3QsNCy0LXRiNC40LLQsNGC0Ywg0YHQu9GD0YjQsNGC0LXQu9C10Lkg0LXRidC1INC4INC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQvdC+0LLQvtCz0L4g0YDRj9C00LBcclxuICAgIGNvbnN0IHtjbG9zZU1vZGFsfSA9IG1vZGFsQ29udHJvbCh7XHJcbiAgICAgIGZvcm1PdmVybGF5LFxyXG4gICAgICBidG5BZGQsXHJcbiAgICAgIGNsb3NlQnRuLFxyXG4gICAgICBvYmpFdmVudDogb2JqRXZlbnRCdG5zLFxyXG4gICAgfSk7XHJcbiAgICBkZWxldGVDb250cm9sKHtkYXRhLCBidG5EZWwsIGxpc3QsIG9iakV2ZW50OiBvYmpFdmVudEJ0bnN9KTtcclxuICAgIGZvcm1Db250cm9sKHtmb3JtLCBsaXN0LCBjbG9zZU1vZGFsfSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIHdpbmRvdy5waG9uZWJvb2tJbml0ID0gaW5pdDtcclxufVxyXG4iXX0=
