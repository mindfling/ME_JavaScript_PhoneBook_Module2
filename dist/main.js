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


// * добавляем на каждый ряд слушателей
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

const deleteControl = ({btnDel, list, objEvent}) => {
  // handleEvent obj клики по кнопкам Добавить и Удалить
  btnDel.addEventListener('click', objEvent);

  list.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.del-icon')) {
      // ряд по которому кликнули
      const targetRow = target.closest('.contact');
      // id контакта из ряда
      const dataID = targetRow.id;
      // deteleDataContact(dataID);
      removeStorage(KEY, dataID); // удаляем из хранилища
      // targetRow.remove(); // удаляем строку из DOM
      // выводим в консоль то что у нас вышло
      console.log(data);

      // ? после каждого удаления контакта хорошо бы делать перерендер
      // удаляем ряды контактов
      while (list.firstElementChild) {
        list.firstElementChild.remove();
      }
      // скрываем .delete в заголовке таблицы
      if (objEvent.isShown) {
        const head = list.parentElement.firstElementChild;
        head.querySelector('.delete').classList.remove('is-visible');
        objEvent.isShown = false;
      }
      // осктльные в таблице просто перерендерятся
      // перерендериваем
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
    addContactPage(newContact, list);
    // todo make it сразу после добавления контакта
    // todo сортировать перерендерить список
    // renderContacts(...)
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

},{"./createElement":2}],2:[function(require,module,exports){
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
const KEY = 'phone-test2';
// const SORT_KEY = 'phone-sort3';

const {getContactHash} = require('./hash');

// читает и возвращает данные data из Хранилища
const getStorage = (storageKey) => {
  let result = JSON.parse(localStorage.getItem(KEY));
  if (!Array.isArray(result)) {
    result = [];
  }
  return result;
};

// читает данные из хранилища добавляет к ним контакт
// и снова перезависывает данные в хранилище
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
  // обновляем данные в хранилище
  localStorage.setItem(storageKey, JSON.stringify(data));
};

//  генерирует добавляет .id для каждого контакта объкта в массиве data
const makeDataContactsHashes = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data.map((contact, index) => {
      contact.id = getContactHash(contact);
    });
  } else {
    return [];
  }
};

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
};


// * exports
module.exports = {
  data,
  KEY,
  getStorage,
  setStorage,
  makeDataContactsHashes,
  removeStorage,
};

},{"./hash":3}],6:[function(require,module,exports){
'use strict';


// * sortDataBy
const sortDataBy = (sortby = '', sortorder = '', data) => {
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


{
  // const {getContactHash} = require('./modules/hash');
  // let data = [];
  let {data} = require('./modules/serviceStorage');
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

    // читаем данные контактов из Хранилища
    data = getStorage(KEY);
    // обновляем хэши id контактов
    makeDataContactsHashes(data);
    // сохраняем обратно в хранилище
    localStorage.setItem(KEY, JSON.stringify(data));
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
    // todo init sort params: sortorder sortby

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

    // initial sorting
    for (const child of head.firstElementChild.children) {
      // ? child.classList.remove('ascending');
      // ? child.classList.remove('descending');
      // ? child.dataset.sortorder = '';
      if (child.dataset.sortby === sortInfo.sortby) {
        child.classList.add(sortInfo.sortorder);
        child.dataset.sortorder = sortInfo.sortorder; // flag
      }
    }

    data = sortDataBy(sortInfo.sortby, sortInfo.sortorder, data);
    // сначала удаляем из DOM
    while (list.lastChild) {
      list.lastChild.remove();
    }
    // потом перерендериваем
    // renderContacts(list, data);
    const allRow = renderContacts(list, data);

    head.addEventListener('click', e => {
      const target = e.target;

      // * click по клеткам заголовка таблицы для сортировки
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

        // сортируем
        const sortData = sortDataBy(sortInfo.sortby, sortInfo.sortorder, data);
        // удаляем строки из DOM
        while (list.lastChild) {
          list.lastChild.remove();
        }
        // перерисовка обновленного списка контактов
        renderContacts(list, sortData);
      }
    });

    // console.log('allRow: ', allRow);
    hoverRow(allRow, logo); // навешиваем слушателей hover при инициализации
    // навешивать слушателей еще и при добавлении нового ряда
    const {closeModal} = modalControl({
      formOverlay,
      btnAdd,
      closeBtn,
      objEvent: objEventBtns,
    });
    deleteControl({btnDel, list, objEvent: objEventBtns});
    formControl({form, list, closeModal});
  };


  window.phonebookInit = init;
}

},{"./modules/control":1,"./modules/render":4,"./modules/serviceStorage":5,"./modules/sort":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVqcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvY29udHJvbC5qcyIsInBob25lYm9vay9qcy9tb2R1bGVzL2NyZWF0ZUVsZW1lbnQuanMiLCJwaG9uZWJvb2svanMvbW9kdWxlcy9oYXNoLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvcmVuZGVyLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvc2VydmljZVN0b3JhZ2UuanMiLCJwaG9uZWJvb2svanMvbW9kdWxlcy9zb3J0LmpzIiwicGhvbmVib29rL2pzL3NjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5jb25zdCB7XHJcbiAgLy8gY3JlYXRlQ29udGFpbmVyLFxyXG4gIC8vIGNyZWF0ZUhlYWRlcixcclxuICAvLyBjcmVhdGVMb2dvLFxyXG4gIC8vIGNyZWF0ZU1haW4sXHJcbiAgLy8gY3JlYXRlQnV0dG9uR3JvdXAsXHJcbiAgLy8gY3JlYXRlVGFibGUsXHJcbiAgLy8gY3JlYXRlRm9ybSxcclxuICAvLyBjcmVhdGVGb290ZXIsXHJcbiAgY3JlYXRlUm93LFxyXG59ID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50Jyk7XHJcblxyXG5cclxuLy8gKiDQtNC+0LHQsNCy0LvRj9C10Lwg0L3QsCDQutCw0LbQtNGL0Lkg0YDRj9C0INGB0LvRg9GI0LDRgtC10LvQtdC5XHJcbmNvbnN0IGhvdmVyUm93ID0gKGFsbFJvdywgbG9nbykgPT4ge1xyXG4gIGNvbnN0IHRleHQgPSBsb2dvLnRleHRDb250ZW50O1xyXG4gIGFsbFJvdy5mb3JFYWNoKGNvbnRhY3QgPT4ge1xyXG4gICAgY29udGFjdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xyXG4gICAgICBsb2dvLnRleHRDb250ZW50ID0gY29udGFjdC5waG9uZUxpbms/LnRleHRDb250ZW50O1xyXG4gICAgfSk7XHJcbiAgICBjb250YWN0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XHJcbiAgICAgIGxvZ28udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuO1xyXG59O1xyXG5cclxuXHJcbi8vINGE0YPQvdC60YbQuNC+0L3QsNC7INGA0LDQsdC+0YLRiyDRgSDQvNC+0LTQsNC70YzQvdC+0Lkg0YTQvtGA0LzQvtC5XHJcbmNvbnN0IG1vZGFsQ29udHJvbCA9ICh7YnRuQWRkLCBmb3JtT3ZlcmxheSwgY2xvc2VCdG4sIG9iakV2ZW50fSkgPT4ge1xyXG4gIC8vINC+0YLQutGA0YvRgtGMINC80L7QtNCw0LvQutGDXHJcbiAgY29uc3Qgb3Blbk1vZGFsID0gKCkgPT4ge1xyXG4gICAgZm9ybU92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xyXG4gIH07XHJcblxyXG4gIC8vINC30LDQutGA0YvRgtGMINC80L7QtNCw0LvQutGDXHJcbiAgY29uc3QgY2xvc2VNb2RhbCA9ICgpID0+IHtcclxuICAgIGZvcm1PdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICB9O1xyXG5cclxuICAvLyDQutC90L7Qv9C60LAg0JTQvtCx0LDQstC40YLRjCDQvtGC0LrRgNGL0LLQsNC10YIg0LzQvtC00LDQu9C60YNcclxuICBidG5BZGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvYmpFdmVudCk7XHJcbiAgLy8gYnRuQWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3Blbk1vZGFsKTtcclxuXHJcbiAgZm9ybU92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgLy8g0L7RgtGA0LDQsdCw0YLRi9Cy0LDQtdC8INC60LvQuNC6INC/0L4g0LrQvdC+0LrQv9C1IENMT1NFINC4INC/0L4g0L7QstC10YDQu9C10Y5cclxuICAgIGlmICh0YXJnZXQgPT09IGNsb3NlQnRuIHx8XHJcbiAgICAgICAgdGFyZ2V0ID09PSBmb3JtT3ZlcmxheSkge1xyXG4gICAgICBjbG9zZU1vZGFsKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBvcGVuTW9kYWwsXHJcbiAgICBjbG9zZU1vZGFsLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBkZWxldGVDb250cm9sID0gKHtidG5EZWwsIGxpc3QsIG9iakV2ZW50fSkgPT4ge1xyXG4gIC8vIGhhbmRsZUV2ZW50IG9iaiDQutC70LjQutC4INC/0L4g0LrQvdC+0L/QutCw0Lwg0JTQvtCx0LDQstC40YLRjCDQuCDQo9C00LDQu9C40YLRjFxyXG4gIGJ0bkRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9iakV2ZW50KTtcclxuXHJcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgIGlmICh0YXJnZXQuY2xvc2VzdCgnLmRlbC1pY29uJykpIHtcclxuICAgICAgLy8g0YDRj9C0INC/0L4g0LrQvtGC0L7RgNC+0LzRgyDQutC70LjQutC90YPQu9C4XHJcbiAgICAgIGNvbnN0IHRhcmdldFJvdyA9IHRhcmdldC5jbG9zZXN0KCcuY29udGFjdCcpO1xyXG4gICAgICAvLyBpZCDQutC+0L3RgtCw0LrRgtCwINC40Lcg0YDRj9C00LBcclxuICAgICAgY29uc3QgZGF0YUlEID0gdGFyZ2V0Um93LmlkO1xyXG4gICAgICAvLyBkZXRlbGVEYXRhQ29udGFjdChkYXRhSUQpO1xyXG4gICAgICByZW1vdmVTdG9yYWdlKEtFWSwgZGF0YUlEKTsgLy8g0YPQtNCw0LvRj9C10Lwg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LBcclxuICAgICAgLy8gdGFyZ2V0Um93LnJlbW92ZSgpOyAvLyDRg9C00LDQu9GP0LXQvCDRgdGC0YDQvtC60YMg0LjQtyBET01cclxuICAgICAgLy8g0LLRi9Cy0L7QtNC40Lwg0LIg0LrQvtC90YHQvtC70Ywg0YLQviDRh9GC0L4g0YMg0L3QsNGBINCy0YvRiNC70L5cclxuICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAvLyA/INC/0L7RgdC70LUg0LrQsNC20LTQvtCz0L4g0YPQtNCw0LvQtdC90LjRjyDQutC+0L3RgtCw0LrRgtCwINGF0L7RgNC+0YjQviDQsdGLINC00LXQu9Cw0YLRjCDQv9C10YDQtdGA0LXQvdC00LXRgFxyXG4gICAgICAvLyDRg9C00LDQu9GP0LXQvCDRgNGP0LTRiyDQutC+0L3RgtCw0LrRgtC+0LJcclxuICAgICAgd2hpbGUgKGxpc3QuZmlyc3RFbGVtZW50Q2hpbGQpIHtcclxuICAgICAgICBsaXN0LmZpcnN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vINGB0LrRgNGL0LLQsNC10LwgLmRlbGV0ZSDQsiDQt9Cw0LPQvtC70L7QstC60LUg0YLQsNCx0LvQuNGG0YtcclxuICAgICAgaWYgKG9iakV2ZW50LmlzU2hvd24pIHtcclxuICAgICAgICBjb25zdCBoZWFkID0gbGlzdC5wYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgIGhlYWQucXVlcnlTZWxlY3RvcignLmRlbGV0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICAgICAgICBvYmpFdmVudC5pc1Nob3duID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgLy8g0L7RgdC60YLQu9GM0L3Ri9C1INCyINGC0LDQsdC70LjRhtC1INC/0YDQvtGB0YLQviDQv9C10YDQtdGA0LXQvdC00LXRgNGP0YLRgdGPXHJcbiAgICAgIC8vINC/0LXRgNC10YDQtdC90LTQtdGA0LjQstCw0LXQvFxyXG4gICAgICByZW5kZXJDb250YWN0cyhsaXN0LCBkYXRhKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuLy8g0LTQvtCx0LDQstC70Y/QtdC8INC90L7QstGD0Y4g0YHRgtGA0L7QutGDINGBINC60L7QvdGC0LDQutGC0L7QvCDQsiDRgtC10LvQviDRgtCw0LHQu9C40YbRiyB0YWJsZS50Ym9keVxyXG5jb25zdCBhZGRDb250YWN0UGFnZSA9IChjb250YWN0LCBsaXN0KSA9PiB7XHJcbiAgbGlzdC5hcHBlbmQoY3JlYXRlUm93KGNvbnRhY3QpKTtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1Db250cm9sID0gKHtmb3JtLCBsaXN0LCBjbG9zZU1vZGFsfSkgPT4ge1xyXG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGUudGFyZ2V0KTsgLy8g0LTQsNC90L3Ri9C1INC40Lcg0YTQvtGA0LzRi1xyXG4gICAgLy8g0YTQvtGA0LzQuNGA0YPQtdC8INC+0LHRitC10LrRgiDQutC+0L3RgtCw0LrRgiDQuNC3INC30L3QsNGH0LXQvdC40Lkg0L/QvtC70LXQuSDRhNC+0YDQvNGLXHJcbiAgICBjb25zdCBuZXdDb250YWN0ID0gT2JqZWN0LmZyb21FbnRyaWVzKGZvcm1EYXRhKTtcclxuICAgIC8vINC30LDQv9C40YHRi9Cy0LDQtdC8INCyINC70L7QutCw0LvRjNC90L7QtSDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICAgIHNldFN0b3JhZ2UoS0VZLCBuZXdDb250YWN0KTtcclxuICAgIC8vINC00L7QsdCw0LLQu9GP0LXQvCDQsiBET00g0L3QsCDRgdGC0YDQsNC90LjRhtGDXHJcbiAgICBhZGRDb250YWN0UGFnZShuZXdDb250YWN0LCBsaXN0KTtcclxuICAgIC8vIHRvZG8gbWFrZSBpdCDRgdGA0LDQt9GDINC/0L7RgdC70LUg0LTQvtCx0LDQstC70LXQvdC40Y8g0LrQvtC90YLQsNC60YLQsFxyXG4gICAgLy8gdG9kbyDRgdC+0YDRgtC40YDQvtCy0LDRgtGMINC/0LXRgNC10YDQtdC90LTQtdGA0LjRgtGMINGB0L/QuNGB0L7QulxyXG4gICAgLy8gcmVuZGVyQ29udGFjdHMoLi4uKVxyXG4gICAgZm9ybS5yZXNldCgpO1xyXG4gICAgY2xvc2VNb2RhbCgpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGhvdmVyUm93LFxyXG4gIG1vZGFsQ29udHJvbCxcclxuICBkZWxldGVDb250cm9sLFxyXG4gIGZvcm1Db250cm9sLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuY29uc3QgY3JlYXRlQ29udGFpbmVyID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjb250YWluZXInKTtcclxuICByZXR1cm4gY29udGFpbmVyO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlSGVhZGVyID0gKCkgPT4ge1xyXG4gIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hlYWRlcicpO1xyXG4gIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXInKTtcclxuICBjb25zdCBoZWFkZXJDb250YWluZXIgPSBjcmVhdGVDb250YWluZXIoKTtcclxuICBoZWFkZXIuYXBwZW5kKGhlYWRlckNvbnRhaW5lcik7XHJcbiAgaGVhZGVyLmhlYWRlckNvbnRhaW5lciA9IGhlYWRlckNvbnRhaW5lcjtcclxuICByZXR1cm4gaGVhZGVyO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlTG9nbyA9IHRpdGxlID0+IHtcclxuICBjb25zdCBoMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XHJcbiAgaDEuY2xhc3NMaXN0LmFkZCgnbG9nbycpO1xyXG4gIGgxLnRleHRDb250ZW50ID0gYNCi0LXQu9C10YTQvtC90L3Ri9C5INGB0L/RgNCw0LLQvtGH0L3QuNC6LiAke3RpdGxlfWA7XHJcbiAgcmV0dXJuIGgxO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlTWFpbiA9ICgpID0+IHtcclxuICBjb25zdCBtYWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWFpbicpO1xyXG4gIGNvbnN0IG1haW5Db250YWluZXIgPSBjcmVhdGVDb250YWluZXIoKTtcclxuICBtYWluLmFwcGVuZChtYWluQ29udGFpbmVyKTtcclxuICBtYWluLm1haW5Db250YWluZXIgPSBtYWluQ29udGFpbmVyO1xyXG4gIHJldHVybiBtYWluO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlQnV0dG9uR3JvdXAgPSBwYXJhbXMgPT4ge1xyXG4gIGNvbnN0IGJ0bldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBidG5XcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2J0bi13cmFwcGVyJyk7XHJcblxyXG4gIGNvbnN0IGJ0bnMgPSBwYXJhbXMubWFwKCh7Y2xhc3NOYW1lLCB0eXBlLCB0ZXh0LCB0aXRsZX0pID0+IHtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgYnV0dG9uLnR5cGUgPSB0eXBlO1xyXG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgICBidXR0b24udGl0bGUgPSB0aXRsZSA/IHRpdGxlIDogJyc7XHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG4gIH0pO1xyXG5cclxuICBidG5XcmFwcGVyLmFwcGVuZCguLi5idG5zKTtcclxuICByZXR1cm4ge1xyXG4gICAgYnRuV3JhcHBlcixcclxuICAgIGJ0bnMsXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZVRhYmxlID0gKGRhdGEpID0+IHtcclxuICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJyk7XHJcbiAgdGFibGUuY2xhc3NMaXN0LmFkZCgndGFibGUnLCAndGFibGUtc3RyaXBlZCcpO1xyXG4gIC8vINCz0LXQvdC10YDQuNC8INC30LDQs9C+0LvQvtCy0L7QuiDRgtCw0LHQu9C40YbRi1xyXG4gIGNvbnN0IHRoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGhlYWQnKTtcclxuICAvKlxyXG4gIHRoZWFkLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYFxyXG4gICAgPHRyPlxyXG4gICAgICA8dGggY2xhc3M9XCJkZWxldGVcIj7Qo9C00LDQu9C40YLRjDwvdGg+XHJcbiAgICAgIDx0aD7QmNC80Y88L3RoPlxyXG4gICAgICA8dGg+0KTQsNC80LjQu9C40Y88L3RoPlxyXG4gICAgICA8dGg+0KLQtdC70LXRhNC+0L08L3RoPlxyXG4gICAgPC90cj5cclxuICBgKTtcclxuICAqL1xyXG4gIC8qXHJcbiAgdGhlYWQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgXHJcbiAgICA8dHIgY2xhc3M9XCJ0YWJsZV9fcm93X2hlYWRcIj5cclxuICAgICAgPHRoIGNsYXNzPVwiZGVsZXRlXCI+0KPQtNCw0LvQuNGC0Yw8L3RoPlxyXG4gICAgICA8dGggY2xhc3M9XCJ0YWJsZV9fY2VsbF9oZWFkIGJ5LW5hbWVcIlxyXG4gICAgICAgICAgICBkYXRhLXNvcnRieT1cImJ5LW5hbWVcIlxyXG4gICAgICAgICAgICB0aXRsZT1cItCh0L7RgNGC0LjRgNC+0LLQsNGC0Ywg0L/QviDQmNC80LXQvdC4XCI+0JjQvNGPPC90aD5cclxuICAgICAgICAgICAgPHRoIGNsYXNzPVwidGFibGVfX2NlbGxfaGVhZFwiXHJcbiAgICAgICAgICAgIGRhdGEtc29ydGJ5PVwiYnktc3VybmFtZVwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwi0KHQvtGA0YLQuNGA0L7QstCw0YLRjCDQv9C+INCk0LDQvNC40LvQuNC4XCI+0KTQsNC80LjQu9C40Y88L3RoPlxyXG4gICAgICAgICAgICA8dGggY2xhc3M9XCJ0YWJsZV9fY2VsbF9oZWFkIGJ5LXBob25lIGRlc2NlbmRpbmdcIlxyXG4gICAgICAgICAgICBkYXRhLXNvcnRieT1cImJ5LXBob25lXCJcclxuICAgICAgICAgICAgdGl0bGU9XCLQodC+0YDRgtC40YDQvtCy0LDRgtGMINC/0L4g0L3QvtC80LXRgNGDINGC0LXQu9C10YTQvtC90LBcIj7QotC10LvQtdGE0L7QvTwvdGg+XHJcbiAgICA8L3RyPlxyXG4gIGApO1xyXG4gICovXHJcblxyXG4gIHRoZWFkLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYFxyXG4gICAgPHRyIGNsYXNzPVwidGFibGVfX3Jvd19oZWFkXCI+XHJcbiAgICAgIDx0aCBjbGFzcz1cImRlbGV0ZVwiPtCj0LTQsNC70LjRgtGMPC90aD5cclxuICAgICAgPHRoIGNsYXNzPVwidGFibGVfX2NlbGxfaGVhZCBieS1uYW1lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0Ynk9XCJieS1uYW1lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0b3JkZXI9XCJcIlxyXG4gICAgICAgICAgICB0aXRsZT1cItCh0L7RgNGC0LjRgNC+0LLQsNGC0Ywg0L/QviDQmNC80LXQvdC4XCI+0JjQvNGPPC90aD5cclxuICAgICAgICAgICAgPHRoIGNsYXNzPVwidGFibGVfX2NlbGxfaGVhZCBieS1zdXJuYW1lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0Ynk9XCJieS1zdXJuYW1lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0b3JkZXI9XCJcIlxyXG4gICAgICAgICAgICB0aXRsZT1cItCh0L7RgNGC0LjRgNC+0LLQsNGC0Ywg0L/QviDQpNCw0LzQuNC70LjQuFwiPtCk0LDQvNC40LvQuNGPPC90aD5cclxuICAgICAgICAgICAgPHRoIGNsYXNzPVwidGFibGVfX2NlbGxfaGVhZCBieS1waG9uZVwiXHJcbiAgICAgICAgICAgIGRhdGEtc29ydGJ5PVwiYnktcGhvbmVcIlxyXG4gICAgICAgICAgICBkYXRhLXNvcnRvcmRlcj1cIlwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwi0KHQvtGA0YLQuNGA0L7QstCw0YLRjCDQv9C+INC90L7QvNC10YDRgyDRgtC10LvQtdGE0L7QvdCwXCI+0KLQtdC70LXRhNC+0L08L3RoPlxyXG4gICAgPC90cj5cclxuICBgKTtcclxuXHJcbiAgLy8g0LPQtdC90LXRgNC40Lwg0Lgg0LLQvtC30YDQsNGJ0LDQtdC8INGB0YHRi9C70LrRgyDQvdCwINGC0LXQu9C+INGC0LDQsdC70LjRhtGLXHJcbiAgY29uc3QgdGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0Ym9keScpO1xyXG4gIHRhYmxlLmFwcGVuZCh0aGVhZCwgdGJvZHkpO1xyXG4gIHRhYmxlLnRoZWFkID0gdGhlYWQ7XHJcbiAgdGFibGUudGJvZHkgPSB0Ym9keTtcclxuICByZXR1cm4gdGFibGU7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVGb3JtID0gKCkgPT4ge1xyXG4gIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tb3ZlcmxheScpO1xyXG4gIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XHJcbiAgZm9ybS5jbGFzc0xpc3QuYWRkKCdmb3JtJyk7XHJcbiAgZm9ybS5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBgXHJcbiAgICA8aDIgY2xhc3M9XCJmb3JtLXRpdGxlXCI+0JTQvtCx0LDQstC40YLRjCDQmtC+0L3RgtCw0LrRgjwvaDI+XHJcbiAgYCk7XHJcbiAgY29uc3QgY2xvc2VCdG4gPSBjcmVhdGVCdXR0b25Hcm91cChbXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZTogJ2Nsb3NlJyxcclxuICAgICAgdHlwZTogJ2J1dHRvbicsXHJcbiAgICAgIHRpdGxlOiAn0JfQsNC60YDRi9GC0Ywg0YTQvtGA0LzRgycsXHJcbiAgICB9LFxyXG4gIF0pLmJ0bnNbMF07XHJcbiAgZm9ybS5wcmVwZW5kKGNsb3NlQnRuKTtcclxuICAvLyDRgdCw0LzQsCDRhNC+0YDQvNCwINCyINC80L7QtNCw0LvRjNC90L7QvCDQvtC60L3QtVxyXG4gIGZvcm0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmxlIGNvbC0xMlwiIGZvcj1cIm5hbWVcIj7QmNC80Y88L2xhYmVsPlxyXG4gICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWlucHV0IGNvbC0xMiBmb3JtLWNvbnRyb2xcIiBuYW1lPVwibmFtZVwiXHJcbiAgICAgICAgICBpZD1cIm5hbWVcIiB0eXBlPVwidGV4dFwiIHJlcXVpcmVkPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmxlIGNvbC0xMlwiIGZvcj1cInN1cm5hbWVcIj7QpNCw0LzQuNC70LjRjzwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0taW5wdXQgY29sLTEwIGZvcm0tY29udHJvbFwiIG5hbWU9XCJzdXJuYW1lXCJcclxuICAgICAgICAgIGlkPVwic3VybmFtZVwiIHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFibGUgY29sLTEyXCIgZm9yPVwicGhvbmVcIj7QotC10LvQtdGE0L7QvTwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0taW5wdXQgY29sLTggZm9ybS1jb250cm9sXCIgbmFtZT1cInBob25lXCJcclxuICAgICAgICAgIGlkPVwicGhvbmVcIiB0eXBlPVwidGV4dFwiIHJlcXVpcmVkPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJjb2wtMTJcIj48L2xhYmVsPlxyXG4gICAgPC9kaXY+XHJcbiAgYCk7XHJcbiAgY29uc3QgYnV0dG9uR3JvdXAgPSBjcmVhdGVCdXR0b25Hcm91cChbXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tcHJpbWFyeSBtci0zJyxcclxuICAgICAgdHlwZTogJ3N1Ym1pdCcsXHJcbiAgICAgIHRleHQ6ICfQlNC+0LHQsNCy0LjRgtGMJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tZGFuZ2VyJyxcclxuICAgICAgdHlwZTogJ3Jlc2V0JyxcclxuICAgICAgdGV4dDogJ9Ce0YLQvNC10L3QsCcsXHJcbiAgICB9LFxyXG4gIF0pO1xyXG4gIGZvcm0uYXBwZW5kKGJ1dHRvbkdyb3VwLmJ0bldyYXBwZXIpO1xyXG4gIG92ZXJsYXkuYXBwZW5kKGZvcm0pO1xyXG4gIHJldHVybiB7XHJcbiAgICBvdmVybGF5LFxyXG4gICAgZm9ybSxcclxuICAgIGNsb3NlQnRuLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVGb290ZXIgPSAoKSA9PiB7XHJcbiAgY29uc3QgZm9vdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9vdGVyJyk7XHJcbiAgZm9vdGVyLmNsYXNzTGlzdC5hZGQoJ2Zvb3RlcicpO1xyXG4gIGNvbnN0IGZvb3RlckNvbnRhaW5lciA9IGNyZWF0ZUNvbnRhaW5lcigpO1xyXG4gIGZvb3Rlci5hcHBlbmQoZm9vdGVyQ29udGFpbmVyKTtcclxuICBmb290ZXIuZm9vdGVyQ29udGFpbmVyID0gZm9vdGVyQ29udGFpbmVyO1xyXG4gIGZvb3RlckNvbnRhaW5lci50ZXh0Q29udGVudCA9ICfQpNGD0YLQtdGAINC60L7Qv9C40YDQsNC50YInO1xyXG4gIHJldHVybiBmb290ZXI7XHJcbn07XHJcblxyXG5cclxuY29uc3QgY3JlYXRlUm93ID0gKHtuYW1lOiBmaXJzdG5hbWUsIHN1cm5hbWUsIHBob25lLCBpZH0pID0+IHtcclxuICBjb25zdCB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcbiAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQvdCwIHVuZGVmaW5lZCDQvdCwINGB0YPRidC10YHRgtCy0L7QstCw0L3QuNC1INC/0L7Qu9GPXHJcbiAgaWYgKGlkKSB7XHJcbiAgICB0ci5pZCA9IGlkO1xyXG4gICAgLy8g0Y3RgtC+0YIgaWQg0YDRj9C00LAg0LrQvtC90YLQutGC0LAg0LTQu9GPINC40LTQtdC90YLQuNGE0LjQutCw0YbQuNC4XHJcbiAgfSBlbHNlIHtcclxuICAgIHRyLmlkID0gJ3RyJyArIGhhc2hDb2RlKGZpcnN0bmFtZSkgKyBoYXNoQ29kZShzdXJuYW1lKSArIGhhc2hDb2RlKHBob25lKTtcclxuICAgIC8vINGC0LDQutC+0LkgaWQg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRglxyXG4gIH1cclxuICB0ci5jbGFzc0xpc3QuYWRkKCdjb250YWN0Jyk7XHJcbiAgdHIudGl0bGUgPSBg0JrQvtC90YLQsNC60YIgJHtzdXJuYW1lfSAke2ZpcnN0bmFtZX1gO1xyXG5cclxuICBjb25zdCB0ZERlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgdGREZWwuY2xhc3NMaXN0LmFkZCgnZGVsZXRlJyk7XHJcbiAgY29uc3QgYnV0dG9uRGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgYnV0dG9uRGVsLmNsYXNzTGlzdC5hZGQoJ2RlbC1pY29uJyk7XHJcbiAgdGREZWwuYXBwZW5kKGJ1dHRvbkRlbCk7XHJcblxyXG4gIGNvbnN0IHRkTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgdGROYW1lLnRleHRDb250ZW50ID0gZmlyc3RuYW1lO1xyXG5cclxuICBjb25zdCB0ZFN1cm5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gIHRkU3VybmFtZS50ZXh0Q29udGVudCA9IHN1cm5hbWU7XHJcblxyXG4gIGNvbnN0IHRkUGhvbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gIGNvbnN0IHBob25lTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICBwaG9uZUxpbmsuaHJlZiA9ICd0ZWw6JyArIHBob25lO1xyXG4gIHBob25lTGluay50ZXh0Q29udGVudCA9IHBob25lO1xyXG4gIHRyLnBob25lTGluayA9IHBob25lTGluaztcclxuICB0ZFBob25lLmFwcGVuZChwaG9uZUxpbmspO1xyXG5cclxuICB0ci5hcHBlbmQodGREZWwsIHRkTmFtZSwgdGRTdXJuYW1lLCB0ZFBob25lKTtcclxuICByZXR1cm4gdHI7XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLy8gY3JlYXRlQ29udGFpbmVyLFxyXG4gIGNyZWF0ZUhlYWRlcixcclxuICBjcmVhdGVMb2dvLFxyXG4gIGNyZWF0ZU1haW4sXHJcbiAgY3JlYXRlQnV0dG9uR3JvdXAsXHJcbiAgY3JlYXRlVGFibGUsXHJcbiAgY3JlYXRlRm9ybSxcclxuICBjcmVhdGVGb290ZXIsXHJcbiAgY3JlYXRlUm93LFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyAqIGpzIG1vZHVsZSB1c2luZyBDSlMgZm9yIGhhc2hcclxuLy8gINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCIGhhc2hDb2RlINC/0L4g0YHRgtGA0L7QutC1IHN0clxyXG5jb25zdCBoYXNoQ29kZSA9IChzdHIpID0+IHtcclxuICBsZXQgaGFzaCA9IDA7XHJcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgY29uc3QgY2hyID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICBoYXNoID0gKGhhc2ggPDwgNSkgLSBoYXNoICsgY2hyO1xyXG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcclxuICB9XHJcbiAgcmV0dXJuIE1hdGguYWJzKGhhc2gpO1xyXG59O1xyXG5cclxuLy8g0LLQvtC30LLRgNCw0YnQsNC10YIg0YHQs9C10L3QtdGA0LjRgNC+0LLQsNC90YvQuSBoYXNoIGlkINC00LvRjyDQutC+0L3RgtCw0LrRgtCwXHJcbi8vINGD0YfQuNGC0YvQstCw0Y8g0LjQvNGPINC/0L7Qu9GPIGlkXHJcbmNvbnN0IGdldENvbnRhY3RIYXNoID0gKGNvbnRhY3QgPSB7fSkgPT4ge1xyXG4gIGNvbnN0IGhhc2hJRCA9IE9iamVjdC5lbnRyaWVzKGNvbnRhY3QpXHJcbiAgICAgIC5yZWR1Y2UoKGFjY3VtLCBjdXJyLCBpbmRleCwgYXJyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY3Vyck5hbWUgPSBjdXJyWzBdO1xyXG4gICAgICAgIGNvbnN0IGN1cnJWYWwgPSBjdXJyWzFdO1xyXG4gICAgICAgIGlmIChjdXJyTmFtZSA9PT0gJ2lkJykge1xyXG4gICAgICAgICAgLy8g0L/QvtC70LUg0YEg0LjQvNC10L3QtdC8IGlkINC90LUg0YPRh9C40YLRi9Cy0LDQtdGC0YHRjyFcclxuICAgICAgICAgIHJldHVybiBhY2N1bTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGAke2FjY3VtfXgke2hhc2hDb2RlKGN1cnJWYWwpLnRvU3RyaW5nKDMyKX1gO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgJ2lkJyk7XHJcbiAgcmV0dXJuIGhhc2hJRDtcclxufTtcclxuXHJcbi8vICog0Y3QutGB0L/QvtGA0YLQuNGA0YPQtdC8INCyINGB0L7RgdGC0LDQstC1INC80L7QtNGD0LvRj1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBnZXRDb250YWN0SGFzaCxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbmNvbnN0IHtcclxuICBjcmVhdGVIZWFkZXIsXHJcbiAgY3JlYXRlTG9nbyxcclxuICBjcmVhdGVNYWluLFxyXG4gIGNyZWF0ZUJ1dHRvbkdyb3VwLFxyXG4gIGNyZWF0ZVRhYmxlLFxyXG4gIGNyZWF0ZUZvcm0sXHJcbiAgY3JlYXRlRm9vdGVyLFxyXG4gIGNyZWF0ZVJvdyxcclxufSA9IHJlcXVpcmUoJy4vY3JlYXRlRWxlbWVudCcpO1xyXG5cclxuXHJcbmNvbnN0IHJlbmRlclBob25lYm9vayA9IChhcHAsIHRpdGxlKSA9PiB7XHJcbiAgY29uc3QgaGVhZGVyID0gY3JlYXRlSGVhZGVyKCk7XHJcbiAgY29uc3QgbG9nbyA9IGNyZWF0ZUxvZ28odGl0bGUpO1xyXG4gIGNvbnN0IG1haW4gPSBjcmVhdGVNYWluKCk7XHJcbiAgY29uc3QgYnV0dG9uR3JvdXAgPSBjcmVhdGVCdXR0b25Hcm91cChbXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tcHJpbWFyeSBtci0zJyxcclxuICAgICAgdHlwZTogJ2J1dHRvbicsXHJcbiAgICAgIHRleHQ6ICfQlNC+0LHQsNCy0LjRgtGMJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tZGFuZ2VyJyxcclxuICAgICAgdHlwZTogJ2J1dHRvbicsXHJcbiAgICAgIHRleHQ6ICfQo9C00LDQu9C40YLRjCcsXHJcbiAgICB9LFxyXG4gIF0pO1xyXG4gIGNvbnN0IHRhYmxlID0gY3JlYXRlVGFibGUoKTtcclxuICBjb25zdCB7Zm9ybSwgb3ZlcmxheSwgY2xvc2VCdG59ID0gY3JlYXRlRm9ybSgpO1xyXG4gIGNvbnN0IGZvb3RlciA9IGNyZWF0ZUZvb3RlcigpO1xyXG5cclxuICBoZWFkZXIuaGVhZGVyQ29udGFpbmVyLmFwcGVuZChsb2dvKTtcclxuICBtYWluLm1haW5Db250YWluZXIuYXBwZW5kKGJ1dHRvbkdyb3VwLmJ0bldyYXBwZXIsIHRhYmxlLCBvdmVybGF5KTtcclxuICBtYWluLmFwcGVuZChvdmVybGF5KTtcclxuICBmb290ZXIuZm9vdGVyQ29udGFpbmVyLmlubmVySFRNTCA9IGDQktGB0LUg0L/RgNCw0LLQsCDQt9Cw0YnQuNGJ0LXQvdGLICZjb3B5OyAke3RpdGxlfWA7XHJcbiAgYXBwLmFwcGVuZChoZWFkZXIsIG1haW4sIGZvb3Rlcik7XHJcbiAgcmV0dXJuIHtcclxuICAgIGxvZ28sXHJcbiAgICBoZWFkOiB0YWJsZS50aGVhZCxcclxuICAgIGxpc3Q6IHRhYmxlLnRib2R5LFxyXG4gICAgYnRuQWRkOiBidXR0b25Hcm91cC5idG5zWzBdLFxyXG4gICAgYnRuRGVsOiBidXR0b25Hcm91cC5idG5zWzFdLFxyXG4gICAgY2xvc2VCdG4sXHJcbiAgICBmb3JtT3ZlcmxheTogb3ZlcmxheSxcclxuICAgIGZvcm0sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IHJlbmRlckNvbnRhY3RzID0gKGxpc3QsIGRhdGEpID0+IHtcclxuICBpZiAoZGF0YSkge1xyXG4gICAgY29uc3QgYWxsUm93cyA9IGRhdGEubWFwKGNyZWF0ZVJvdyk7XHJcbiAgICBsaXN0LmFwcGVuZCguLi5hbGxSb3dzKTtcclxuICAgIHJldHVybiBhbGxSb3dzO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHJlbmRlclBob25lYm9vayxcclxuICByZW5kZXJDb250YWN0cyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gR0xPQkFMIEtFWVMgYW5kIERBVEFcclxubGV0IGRhdGEgPSBbXTtcclxuY29uc3QgS0VZID0gJ3Bob25lLXRlc3QyJztcclxuLy8gY29uc3QgU09SVF9LRVkgPSAncGhvbmUtc29ydDMnO1xyXG5cclxuY29uc3Qge2dldENvbnRhY3RIYXNofSA9IHJlcXVpcmUoJy4vaGFzaCcpO1xyXG5cclxuLy8g0YfQuNGC0LDQtdGCINC4INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC00LDQvdC90YvQtSBkYXRhINC40Lcg0KXRgNCw0L3QuNC70LjRidCwXHJcbmNvbnN0IGdldFN0b3JhZ2UgPSAoc3RvcmFnZUtleSkgPT4ge1xyXG4gIGxldCByZXN1bHQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKEtFWSkpO1xyXG4gIGlmICghQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XHJcbiAgICByZXN1bHQgPSBbXTtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8vINGH0LjRgtCw0LXRgiDQtNCw0L3QvdGL0LUg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LAg0LTQvtCx0LDQstC70Y/QtdGCINC6INC90LjQvCDQutC+0L3RgtCw0LrRglxyXG4vLyDQuCDRgdC90L7QstCwINC/0LXRgNC10LfQsNCy0LjRgdGL0LLQsNC10YIg0LTQsNC90L3Ri9C1INCyINGF0YDQsNC90LjQu9C40YnQtVxyXG5jb25zdCBzZXRTdG9yYWdlID0gKHN0b3JhZ2VLZXksIGNvbnRhY3QgPSB7fSkgPT4ge1xyXG4gIC8vINGH0LjRgtCw0LXQvCDRgtC10LrRg9GJ0LjQtSDQtNCw0L3QvdGL0LVcclxuICBkYXRhID0gZ2V0U3RvcmFnZShLRVkpO1xyXG4gIC8vINC/0YDQvtCy0LXRgNGP0LXQvCDQv9GD0YHRgtC+0Lkg0LvQuCDQuCDQvNCw0YHQuNCyINC70Lgg0LLQvtC+0LHRidC1XHJcbiAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICBkYXRhID0gW107XHJcbiAgfVxyXG4gIC8vINC/0YDQvtCy0LXRgNC60LAg0L3QsCDQuNC80Y8g0L/QvtC70LXQuSBuYW1lLCBzdXJuYW1lLCBwaG9uZVxyXG4gIGlmIChjb250YWN0Lm5hbWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgY29udGFjdC5uYW1lID0gJyc7XHJcbiAgfVxyXG4gIGlmIChjb250YWN0LnN1cm5hbWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgY29udGFjdC5zdXJuYW1lID0gJyc7XHJcbiAgfVxyXG4gIGlmIChjb250YWN0LnBob25lID09PSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnRhY3QucGhvbmUgPSAnJztcclxuICB9XHJcbiAgLy8g0LTQsNCx0LDQstC70Y/QtdC8INGF0Y3RiFxyXG4gIGlmIChjb250YWN0LmlkID09PSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnRhY3QuaWQgPSBnZXRDb250YWN0SGFzaChjb250YWN0KTtcclxuICB9XHJcbiAgLy8g0LTQsNCx0LDQstC70Y/QtdC8INC60L7QvdGC0LDQutGCINCyIGRhdGFcclxuICBkYXRhLnB1c2goY29udGFjdCk7XHJcbiAgLy8g0L7QsdC90L7QstC70Y/QtdC8INC00LDQvdC90YvQtSDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzdG9yYWdlS2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn07XHJcblxyXG4vLyAg0LPQtdC90LXRgNC40YDRg9C10YIg0LTQvtCx0LDQstC70Y/QtdGCIC5pZCDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0LrQvtC90YLQsNC60YLQsCDQvtCx0YrQutGC0LAg0LIg0LzQsNGB0YHQuNCy0LUgZGF0YVxyXG5jb25zdCBtYWtlRGF0YUNvbnRhY3RzSGFzaGVzID0gKGRhdGEpID0+IHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcclxuICAgIHJldHVybiBkYXRhLm1hcCgoY29udGFjdCwgaW5kZXgpID0+IHtcclxuICAgICAgY29udGFjdC5pZCA9IGdldENvbnRhY3RIYXNoKGNvbnRhY3QpO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCByZW1vdmVTdG9yYWdlID0gKHN0b3JhZ2VLZXksIGlkKSA9PiB7XHJcbiAgLy8g0YfQuNGC0LDQtdC8INGC0LXQutGD0YnQuNC1INC00LDQvdC90YvQtVxyXG4gIGRhdGEgPSBnZXRTdG9yYWdlKEtFWSk7XHJcbiAgLy8g0YPQtNCw0LvRj9C10Lwg0LjQtyDQvNCw0YHRgdC40LLQsCDQutC+0L3RgtCw0LrRgiDRgSDRjdGC0LjQvCBpZFxyXG4gIGRhdGEuZm9yRWFjaCgoY29udGFjdCwgaW5kZXgsIGFycikgPT4ge1xyXG4gICAgaWYgKGNvbnRhY3QuaWQgPT09IGlkKSB7XHJcbiAgICAgIGRhdGEuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICB9KTtcclxuICAvLyDRgdC+0YXRgNCw0L3Rj9C10Lwg0L7QsdGA0LDRgtC90L4g0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc3RvcmFnZUtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG59O1xyXG5cclxuXHJcbi8vICogZXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBkYXRhLFxyXG4gIEtFWSxcclxuICBnZXRTdG9yYWdlLFxyXG4gIHNldFN0b3JhZ2UsXHJcbiAgbWFrZURhdGFDb250YWN0c0hhc2hlcyxcclxuICByZW1vdmVTdG9yYWdlLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLy8gKiBzb3J0RGF0YUJ5XHJcbmNvbnN0IHNvcnREYXRhQnkgPSAoc29ydGJ5ID0gJycsIHNvcnRvcmRlciA9ICcnLCBkYXRhKSA9PiB7XHJcbiAgbGV0IHNvcnRlZCA9IFtdO1xyXG4gIHN3aXRjaCAoc29ydGJ5KSB7XHJcbiAgICBjYXNlICdieS1uYW1lJzpcclxuICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QviDQuNC80LXQvdC4XHJcbiAgICAgIHNvcnRlZCA9IGRhdGEuc29ydCgocHJldiwgbmV4dCkgPT4ge1xyXG4gICAgICAgIC8vIGFzY2VuZGluZyBhLCBiLCBjLCAuLiB6IG9yZGVyXHJcbiAgICAgICAgbGV0IG5hbWVQcmV2ID0gcHJldj8ubmFtZTtcclxuICAgICAgICBsZXQgbmFtZU5leHQgPSBuZXh0Py5uYW1lO1xyXG4gICAgICAgIGlmIChzb3J0b3JkZXIgPT09ICdkZXNjZW5kaW5nJykge1xyXG4gICAgICAgICAgLy8gZGVzY2VuZGluZyB6LCB5LCB4LCAuLiBhIG9yZGVyXHJcbiAgICAgICAgICBuYW1lUHJldiA9IG5leHQ/Lm5hbWU7XHJcbiAgICAgICAgICBuYW1lTmV4dCA9IHByZXY/Lm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuYW1lUHJldiA+IG5hbWVOZXh0KSB7XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5hbWVQcmV2IDwgbmFtZU5leHQpIHtcclxuICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdieS1zdXJuYW1lJzpcclxuICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QviDRhNCw0LzQuNC70LjQuFxyXG4gICAgICBzb3J0ZWQgPSBkYXRhLnNvcnQoKHByZXYsIG5leHQpID0+IHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxyXG4gICAgICAgIGNvbnN0IHN1cm5hbWVQcmV2ID0gKHNvcnRvcmRlciA9PT0gJ2FzY2VuZGluZycpID8gcHJldi5zdXJuYW1lIDogbmV4dC5zdXJuYW1lO1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXHJcbiAgICAgICAgY29uc3Qgc3VybmFtZU5leHQgPSAoc29ydG9yZGVyID09PSAnYXNjZW5kaW5nJykgPyBuZXh0LnN1cm5hbWUgOiBwcmV2LnN1cm5hbWU7XHJcbiAgICAgICAgaWYgKHN1cm5hbWVQcmV2ID4gc3VybmFtZU5leHQpIHtcclxuICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3VybmFtZVByZXYgPCBzdXJuYW1lTmV4dCkge1xyXG4gICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2J5LXBob25lJzpcclxuICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QviDQvdC+0LzQtdGA0YMg0YLQtdC70LXRhNC+0L3QsFxyXG4gICAgICBzb3J0ZWQgPSBkYXRhLnNvcnQoKHByZXYsIG5leHQpID0+IHtcclxuICAgICAgICBsZXQgcHJldlBob25lID0gJyc7XHJcbiAgICAgICAgbGV0IG5leHRQaG9uZSA9ICcnO1xyXG4gICAgICAgIGlmIChzb3J0b3JkZXIgPT09ICdhc2NlbmRpbmcnKSB7XHJcbiAgICAgICAgICBwcmV2UGhvbmUgPSBwcmV2LnBob25lO1xyXG4gICAgICAgICAgbmV4dFBob25lID0gbmV4dC5waG9uZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcHJldlBob25lID0gbmV4dC5waG9uZTtcclxuICAgICAgICAgIG5leHRQaG9uZSA9IHByZXYucGhvbmU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwcmV2UGhvbmUgPiBuZXh0UGhvbmUpIHtcclxuICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocHJldlBob25lIDwgbmV4dFBob25lKSB7XHJcbiAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgY29uc29sZS5sb2coJ9C/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuICAvLyByZXR1cm4gZGF0YTtcclxuICByZXR1cm4gc29ydGVkO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgc29ydERhdGFCeSxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gLy8gR0xPQkFMIEtFWVMgYW5kIERBVEFcclxuLy8gbGV0IGRhdGEgPSBbXTtcclxuLy8gY29uc3QgS0VZID0gJ3Bob25lLXRlc3QyJztcclxuY29uc3QgU09SVF9LRVkgPSAncGhvbmUtc29ydDMnO1xyXG5cclxuXHJcbntcclxuICAvLyBjb25zdCB7Z2V0Q29udGFjdEhhc2h9ID0gcmVxdWlyZSgnLi9tb2R1bGVzL2hhc2gnKTtcclxuICAvLyBsZXQgZGF0YSA9IFtdO1xyXG4gIGxldCB7ZGF0YX0gPSByZXF1aXJlKCcuL21vZHVsZXMvc2VydmljZVN0b3JhZ2UnKTtcclxuICBjb25zdCB7XHJcbiAgICBLRVksXHJcbiAgICBnZXRTdG9yYWdlLFxyXG4gICAgLy8gc2V0U3RvcmFnZSxcclxuICAgIG1ha2VEYXRhQ29udGFjdHNIYXNoZXMsXHJcbiAgICAvLyByZW1vdmVTdG9yYWdlLFxyXG4gIH0gPSByZXF1aXJlKCcuL21vZHVsZXMvc2VydmljZVN0b3JhZ2UnKTtcclxuXHJcblxyXG4gIGNvbnN0IHtzb3J0RGF0YUJ5fSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9zb3J0Jyk7XHJcblxyXG5cclxuICBjb25zdCB7XHJcbiAgICBob3ZlclJvdyxcclxuICAgIG1vZGFsQ29udHJvbCxcclxuICAgIGRlbGV0ZUNvbnRyb2wsXHJcbiAgICBmb3JtQ29udHJvbCxcclxuICB9ID0gcmVxdWlyZSgnLi9tb2R1bGVzL2NvbnRyb2wnKTtcclxuXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIHJlbmRlclBob25lYm9vayxcclxuICAgIHJlbmRlckNvbnRhY3RzLFxyXG4gIH0gPSByZXF1aXJlKCcuL21vZHVsZXMvcmVuZGVyJyk7XHJcblxyXG5cclxuICAvLyAqIE1BSU4gSU5JVCAqXHJcbiAgY29uc3QgaW5pdCA9IChzZWxlY3RvckFwcCwgdGl0bGUpID0+IHtcclxuICAgIGNvbnN0IGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JBcHApO1xyXG5cclxuICAgIC8vINGH0LjRgtCw0LXQvCDQtNCw0L3QvdGL0LUg0LrQvtC90YLQsNC60YLQvtCyINC40Lcg0KXRgNCw0L3QuNC70LjRidCwXHJcbiAgICBkYXRhID0gZ2V0U3RvcmFnZShLRVkpO1xyXG4gICAgLy8g0L7QsdC90L7QstC70Y/QtdC8INGF0Y3RiNC4IGlkINC60L7QvdGC0LDQutGC0L7QslxyXG4gICAgbWFrZURhdGFDb250YWN0c0hhc2hlcyhkYXRhKTtcclxuICAgIC8vINGB0L7RhdGA0LDQvdGP0LXQvCDQvtCx0YDQsNGC0L3QviDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEtFWSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgLy8g0L/QtdGA0LXQvdC10YHRgtC4INCyIG1ha2VEYXRhQ29udGFjdHNIYXNoZXNcclxuXHJcbiAgICAvLyDRh9C40YLQsNC10Lwg0LTQsNC90L3Ri9C1INC+INGB0L7RgNGC0LjRgNC+0LLQutC1XHJcbiAgICBsZXQgc29ydEluZm8gPSB7fTtcclxuICAgIC8vIGxldCBzb3J0SW5mbyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oU09SVF9LRVkpKTsgLy8gdG9kb1xyXG5cclxuICAgIGNvbnN0IHtcclxuICAgICAgaGVhZCwgLy8gdGFibGUgdGhlYWRcclxuICAgICAgbGlzdCwgLy8gdGFibGUgdGJvZHlcclxuICAgICAgbG9nbyxcclxuICAgICAgYnRuQWRkLFxyXG4gICAgICBidG5EZWwsXHJcbiAgICAgIGZvcm1PdmVybGF5LFxyXG4gICAgICBjbG9zZUJ0bixcclxuICAgICAgZm9ybSxcclxuICAgIH0gPSByZW5kZXJQaG9uZWJvb2soYXBwLCB0aXRsZSk7XHJcblxyXG4gICAgLy8gb2JqRXZlbnQg0L7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Lkg0LrQu9C40LrQvtCyINC90LAgYnRuQWRkINC4IGJ0bkRlbFxyXG4gICAgY29uc3Qgb2JqRXZlbnRCdG5zID0ge1xyXG4gICAgICBpc1Nob3duOiBmYWxzZSwgLy8g0LIg0L3QsNGH0LDQu9C1INC30LDQutGA0YvRgtGLINCy0YHQtSDRj9GH0LXQudC60Lgg0YEg0LrQvdC+0L/QutCw0LzQuCAuZGVsZXRlXHJcbiAgICAgIGhhbmRsZUV2ZW50KGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgIGNvbnN0IGNlbGxEZWxldGVBbGwgPSBsaXN0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRlbGV0ZScpO1xyXG4gICAgICAgIC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L3QvtC/0LrRgyDQlNC+0LHQsNCy0LjRgtGMIGJ0bkFkZFxyXG4gICAgICAgIGlmICh0YXJnZXQgPT09IGJ0bkFkZCkge1xyXG4gICAgICAgIC8vINC30LTQtdGB0Ywg0LTQtdC70LDQtdC8INCy0LjQtNC40LzRi9C8INC+0LLQtdGA0LvQsNC5INC4INC80L7QtNCw0LvQutGDXHJcbiAgICAgICAgICBmb3JtT3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy12aXNpYmxlJyk7XHJcbiAgICAgICAgICAvLyDQt9C00LXRgdGMINGB0LrRgNGL0LLQsNC10Lwg0LLRgdC1INC60L3QvtC/0LrQuCAuZGVsZXRlXHJcbiAgICAgICAgICAvLyBjb25zdCBjZWxsRGVsZXRlQWxsID0gdGFibGUucXVlcnlTZWxlY3RvckFsbCgnLmRlbGV0ZScpO1xyXG4gICAgICAgICAgdGhpcy5pc1Nob3duID0gZmFsc2U7XHJcbiAgICAgICAgICBjZWxsRGVsZXRlQWxsLmZvckVhY2goY2VsbERlbGV0ZSA9PiB7XHJcbiAgICAgICAgICAgIGNlbGxEZWxldGUuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgLy8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrQvdC+0L/QutGDINCj0LTQsNC70LjRgtGMIGJ0bkRlbFxyXG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0ID09PSBidG5EZWwpIHtcclxuICAgICAgICAvLyDQt9C00LXRgdGMINC/0L7QutCw0LfRi9Cy0LDQtdC8INCy0YHQtSDQutC90L7Qv9C60LggLmRlbGV0ZVxyXG4gICAgICAgICAgaWYgKHRoaXMuaXNTaG93bikge1xyXG4gICAgICAgICAgLy8g0LXRgdC70Lgg0LLQuNC00LjQvNGL0LUg0YLQviDRgdC60YDRi9Cy0LDQtdC8XHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjZWxsRGVsZXRlQWxsLmZvckVhY2goY2VsbERlbGV0ZSA9PiB7XHJcbiAgICAgICAgICAgICAgY2VsbERlbGV0ZS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vINC10YHQu9C4INCx0YvQu9C4INGB0LrRgNGL0YLRi9C1INGC0L4g0L/QvtC60LDQt9GL0LLQsNC10LxcclxuICAgICAgICAgICAgdGhpcy5pc1Nob3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2VsbERlbGV0ZUFsbC5mb3JFYWNoKGNlbGxEZWxldGUgPT4ge1xyXG4gICAgICAgICAgICAgIGNlbGxEZWxldGUuY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIC8vINCk0KPQndCa0KbQmNCe0J3QkNCbINCX0JTQldCh0KxcclxuICAgIC8vIHRvZG8gaW5pdCBzb3J0IHBhcmFtczogc29ydG9yZGVyIHNvcnRieVxyXG5cclxuICAgIGlmICghKHNvcnRJbmZvID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTT1JUX0tFWSkpKSkge1xyXG4gICAgICAvLyDQtdGB0LvQuCBzb3J0SW5mbyDQvdC10KIg0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgICAgIC8vINC30LDQv9C+0LvQvdGP0LXQvCDQt9C90LDRh9C10L3QuNC10Lwg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICAgICAgc29ydEluZm8gPSB7XHJcbiAgICAgICAgc29ydGJ5OiAnYnktbmFtZScsXHJcbiAgICAgICAgc29ydG9yZGVyOiAnYXNjZW5kaW5nJyxcclxuICAgICAgfTtcclxuICAgICAgLy8g0YHQvtGF0YDQsNC90Y/QtdC8INCyINGF0YDQsNC90LjQu9C40YnQtVxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTT1JUX0tFWSwgSlNPTi5zdHJpbmdpZnkoc29ydEluZm8pKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vINC10YHQu9C4INGB0L7RhdGA0LDQvdC10L3QviDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICAgICAgY29uc29sZS5sb2coJ9C90LDRh9Cw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINCyINGF0YDQsNC90LjQu9C40YnQtSBzb3J0SW5mbzonLCBzb3J0SW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW5pdGlhbCBzb3J0aW5nXHJcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGhlYWQuZmlyc3RFbGVtZW50Q2hpbGQuY2hpbGRyZW4pIHtcclxuICAgICAgLy8gPyBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhc2NlbmRpbmcnKTtcclxuICAgICAgLy8gPyBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdkZXNjZW5kaW5nJyk7XHJcbiAgICAgIC8vID8gY2hpbGQuZGF0YXNldC5zb3J0b3JkZXIgPSAnJztcclxuICAgICAgaWYgKGNoaWxkLmRhdGFzZXQuc29ydGJ5ID09PSBzb3J0SW5mby5zb3J0YnkpIHtcclxuICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKHNvcnRJbmZvLnNvcnRvcmRlcik7XHJcbiAgICAgICAgY2hpbGQuZGF0YXNldC5zb3J0b3JkZXIgPSBzb3J0SW5mby5zb3J0b3JkZXI7IC8vIGZsYWdcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRhdGEgPSBzb3J0RGF0YUJ5KHNvcnRJbmZvLnNvcnRieSwgc29ydEluZm8uc29ydG9yZGVyLCBkYXRhKTtcclxuICAgIC8vINGB0L3QsNGH0LDQu9CwINGD0LTQsNC70Y/QtdC8INC40LcgRE9NXHJcbiAgICB3aGlsZSAobGlzdC5sYXN0Q2hpbGQpIHtcclxuICAgICAgbGlzdC5sYXN0Q2hpbGQucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgICAvLyDQv9C+0YLQvtC8INC/0LXRgNC10YDQtdC90LTQtdGA0LjQstCw0LXQvFxyXG4gICAgLy8gcmVuZGVyQ29udGFjdHMobGlzdCwgZGF0YSk7XHJcbiAgICBjb25zdCBhbGxSb3cgPSByZW5kZXJDb250YWN0cyhsaXN0LCBkYXRhKTtcclxuXHJcbiAgICBoZWFkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgLy8gKiBjbGljayDQv9C+INC60LvQtdGC0LrQsNC8INC30LDQs9C+0LvQvtCy0LrQsCDRgtCw0LHQu9C40YbRiyDQtNC70Y8g0YHQvtGA0YLQuNGA0L7QstC60LhcclxuICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhYmxlX19jZWxsX2hlYWQnKSkge1xyXG4gICAgICAgIC8vINC/0LXRgNC10LHQuNGA0LDQtdC8INCy0YHQtSDQtNC+0YfQtdGA0L3QuNC1INC60LvQtdGC0LrQuCDRgNGP0LTQsCDQt9Cw0LPQvtC70L7QstC60LAg0YLQsNCx0LvQuNGG0YtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGhlYWQuZmlyc3RFbGVtZW50Q2hpbGQuY2hpbGRyZW4pIHtcclxuICAgICAgICAgIGlmICh0YXJnZXQgPT09IGNoaWxkKSB7XHJcbiAgICAgICAgICAgIC8vINCf0KPQodCi0JDQryDQktCa0JvQkNCU0JrQkCBcIlwiXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9PT0gJycpIHtcclxuICAgICAgICAgICAgICBjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9ICdkZXNjZW5kaW5nJztcclxuICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKCdkZXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VtcHR5IHRvIGFzY2VuZGluZycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZGF0YXNldC5zb3J0b3JkZXIgPT09ICdhc2NlbmRpbmcnKSB7XHJcbiAgICAgICAgICAgICAgY2hpbGQuZGF0YXNldC5zb3J0b3JkZXIgPSAnZGVzY2VuZGluZyc7XHJcbiAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnYXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZCgnZGVzY2VuZGluZycpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhc2NlbmRpbmcgdG8gZGVzY2VuZGluZycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID09PSAnZGVzY2VuZGluZycpIHtcclxuICAgICAgICAgICAgICBjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9ICdhc2NlbmRpbmcnO1xyXG4gICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKCdhc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGVzY2VuZGluZyB0byBhc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnYXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgY2hpbGQuZGF0YXNldC5zb3J0b3JkZXIgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNvcnRJbmZvLnNvcnRieSA9IHRhcmdldC5kYXRhc2V0Py5zb3J0Ynk7XHJcbiAgICAgICAgc29ydEluZm8uc29ydG9yZGVyID0gdGFyZ2V0LmRhdGFzZXQ/LnNvcnRvcmRlcjtcclxuICAgICAgICAvLyDQvtCx0L3QvtCy0LvRj9C10Lwg0LTQsNC90L3Ri9C1INC+INGB0L7RgNGC0LjRgNC+0LLQutC1INCyINGF0YDQsNC90LjQu9C40YnQtVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNPUlRfS0VZLCBKU09OLnN0cmluZ2lmeShzb3J0SW5mbykpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKG9iakV2ZW50QnRucy5pc1Nob3duKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZGVsZXRlINGB0LrRgNGL0LLQsNC10LwnKTtcclxuICAgICAgICAgIGhlYWQucXVlcnlTZWxlY3RvcignLmRlbGV0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICAgICAgICAgIG9iakV2ZW50QnRucy5pc1Nob3duID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vINC+0YHQutGC0LvRjNC90YvQtSDQsiDRgtCw0LHQu9C40YbQtSDQv9GA0L7RgdGC0L4g0L/QtdGA0LXRgNC10L3QtNC10YDRj9GC0YHRj1xyXG5cclxuICAgICAgICAvLyDRgdC+0YDRgtC40YDRg9C10LxcclxuICAgICAgICBjb25zdCBzb3J0RGF0YSA9IHNvcnREYXRhQnkoc29ydEluZm8uc29ydGJ5LCBzb3J0SW5mby5zb3J0b3JkZXIsIGRhdGEpO1xyXG4gICAgICAgIC8vINGD0LTQsNC70Y/QtdC8INGB0YLRgNC+0LrQuCDQuNC3IERPTVxyXG4gICAgICAgIHdoaWxlIChsaXN0Lmxhc3RDaGlsZCkge1xyXG4gICAgICAgICAgbGlzdC5sYXN0Q2hpbGQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vINC/0LXRgNC10YDQuNGB0L7QstC60LAg0L7QsdC90L7QstC70LXQvdC90L7Qs9C+INGB0L/QuNGB0LrQsCDQutC+0L3RgtCw0LrRgtC+0LJcclxuICAgICAgICByZW5kZXJDb250YWN0cyhsaXN0LCBzb3J0RGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdhbGxSb3c6ICcsIGFsbFJvdyk7XHJcbiAgICBob3ZlclJvdyhhbGxSb3csIGxvZ28pOyAvLyDQvdCw0LLQtdGI0LjQstCw0LXQvCDRgdC70YPRiNCw0YLQtdC70LXQuSBob3ZlciDQv9GA0Lgg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40LhcclxuICAgIC8vINC90LDQstC10YjQuNCy0LDRgtGMINGB0LvRg9GI0LDRgtC10LvQtdC5INC10YnQtSDQuCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L3QvtCy0L7Qs9C+INGA0Y/QtNCwXHJcbiAgICBjb25zdCB7Y2xvc2VNb2RhbH0gPSBtb2RhbENvbnRyb2woe1xyXG4gICAgICBmb3JtT3ZlcmxheSxcclxuICAgICAgYnRuQWRkLFxyXG4gICAgICBjbG9zZUJ0bixcclxuICAgICAgb2JqRXZlbnQ6IG9iakV2ZW50QnRucyxcclxuICAgIH0pO1xyXG4gICAgZGVsZXRlQ29udHJvbCh7YnRuRGVsLCBsaXN0LCBvYmpFdmVudDogb2JqRXZlbnRCdG5zfSk7XHJcbiAgICBmb3JtQ29udHJvbCh7Zm9ybSwgbGlzdCwgY2xvc2VNb2RhbH0pO1xyXG4gIH07XHJcblxyXG5cclxuICB3aW5kb3cucGhvbmVib29rSW5pdCA9IGluaXQ7XHJcbn1cclxuIl19
