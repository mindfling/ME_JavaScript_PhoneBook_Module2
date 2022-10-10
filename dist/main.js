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
} = require('./serviceStorage');

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

      // todooo move to renderContacts
      // // удаляем строки из DOM
      // while (list.lastChild) {
      //   list.lastChild.remove();
      // }
      // перерисовка обновленного списка контактов
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
  return data;
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
    console.log('init data: ', data);
    // обновляем хэши id контактов
    makeDataContactsHashes(data);
    console.log('hash data: ', data);
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
    console.log('after sort data: ', data);
    // // сначала удаляем из DOM
    // while (list.lastChild) {
    //   list.lastChild.remove();
    // }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVqcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvY29udHJvbC5qcyIsInBob25lYm9vay9qcy9tb2R1bGVzL2NyZWF0ZUVsZW1lbnQuanMiLCJwaG9uZWJvb2svanMvbW9kdWxlcy9oYXNoLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvcmVuZGVyLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvc2VydmljZVN0b3JhZ2UuanMiLCJwaG9uZWJvb2svanMvbW9kdWxlcy9zb3J0LmpzIiwicGhvbmVib29rL2pzL3NjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCB7XHJcbiAgLy8gY3JlYXRlQ29udGFpbmVyLFxyXG4gIC8vIGNyZWF0ZUhlYWRlcixcclxuICAvLyBjcmVhdGVMb2dvLFxyXG4gIC8vIGNyZWF0ZU1haW4sXHJcbiAgLy8gY3JlYXRlQnV0dG9uR3JvdXAsXHJcbiAgLy8gY3JlYXRlVGFibGUsXHJcbiAgLy8gY3JlYXRlRm9ybSxcclxuICAvLyBjcmVhdGVGb290ZXIsXHJcbiAgY3JlYXRlUm93LFxyXG59ID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50Jyk7XHJcblxyXG4vLyBsZXQge2RhdGF9ID0gcmVxdWlyZSgnLi9zZXJ2aWNlU3RvcmFnZScpO1xyXG4vLyBjb25zdCB7ZGF0YX0gPSByZXF1aXJlKCcuL3NlcnZpY2VTdG9yYWdlJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgS0VZLFxyXG4gIC8vIGdldFN0b3JhZ2UsXHJcbiAgc2V0U3RvcmFnZSxcclxuICAvLyBtYWtlRGF0YUNvbnRhY3RzSGFzaGVzLFxyXG4gIHJlbW92ZVN0b3JhZ2UsXHJcbn0gPSByZXF1aXJlKCcuL3NlcnZpY2VTdG9yYWdlJyk7XHJcblxyXG5jb25zdCB7XHJcbiAgcmVuZGVyQ29udGFjdHMsXHJcbn0gPSByZXF1aXJlKCcuL3JlbmRlcicpO1xyXG5cclxuLy8g0LTQvtCx0LDQstC70Y/QtdC8INC90LAg0LrQsNC20LTRi9C5INGA0Y/QtCDRgdC70YPRiNCw0YLQtdC70LXQuVxyXG5jb25zdCBob3ZlclJvdyA9IChhbGxSb3csIGxvZ28pID0+IHtcclxuICBjb25zdCB0ZXh0ID0gbG9nby50ZXh0Q29udGVudDtcclxuICBhbGxSb3cuZm9yRWFjaChjb250YWN0ID0+IHtcclxuICAgIGNvbnRhY3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcclxuICAgICAgbG9nby50ZXh0Q29udGVudCA9IGNvbnRhY3QucGhvbmVMaW5rPy50ZXh0Q29udGVudDtcclxuICAgIH0pO1xyXG4gICAgY29udGFjdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xyXG4gICAgICBsb2dvLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybjtcclxufTtcclxuXHJcbi8vINGE0YPQvdC60YbQuNC+0L3QsNC7INGA0LDQsdC+0YLRiyDRgSDQvNC+0LTQsNC70YzQvdC+0Lkg0YTQvtGA0LzQvtC5XHJcbmNvbnN0IG1vZGFsQ29udHJvbCA9ICh7YnRuQWRkLCBmb3JtT3ZlcmxheSwgY2xvc2VCdG4sIG9iakV2ZW50fSkgPT4ge1xyXG4gIC8vINC+0YLQutGA0YvRgtGMINC80L7QtNCw0LvQutGDXHJcbiAgY29uc3Qgb3Blbk1vZGFsID0gKCkgPT4ge1xyXG4gICAgZm9ybU92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xyXG4gIH07XHJcblxyXG4gIC8vINC30LDQutGA0YvRgtGMINC80L7QtNCw0LvQutGDXHJcbiAgY29uc3QgY2xvc2VNb2RhbCA9ICgpID0+IHtcclxuICAgIGZvcm1PdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICB9O1xyXG5cclxuICAvLyDQutC90L7Qv9C60LAg0JTQvtCx0LDQstC40YLRjCDQvtGC0LrRgNGL0LLQsNC10YIg0LzQvtC00LDQu9C60YNcclxuICBidG5BZGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvYmpFdmVudCk7XHJcbiAgLy8gYnRuQWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3Blbk1vZGFsKTtcclxuXHJcbiAgZm9ybU92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgLy8g0L7RgtGA0LDQsdCw0YLRi9Cy0LDQtdC8INC60LvQuNC6INC/0L4g0LrQvdC+0LrQv9C1IENMT1NFINC4INC/0L4g0L7QstC10YDQu9C10Y5cclxuICAgIGlmICh0YXJnZXQgPT09IGNsb3NlQnRuIHx8XHJcbiAgICAgICAgdGFyZ2V0ID09PSBmb3JtT3ZlcmxheSkge1xyXG4gICAgICBjbG9zZU1vZGFsKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBvcGVuTW9kYWwsXHJcbiAgICBjbG9zZU1vZGFsLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBkZWxldGVDb250cm9sID0gKHtkYXRhLCBidG5EZWwsIGxpc3QsIG9iakV2ZW50fSkgPT4ge1xyXG4gIC8vIGhhbmRsZUV2ZW50IG9iaiDQutC70LjQutC4INC/0L4g0LrQvdC+0L/QutCw0Lwg0JTQvtCx0LDQstC40YLRjCDQuCDQo9C00LDQu9C40YLRjFxyXG4gIGJ0bkRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9iakV2ZW50KTtcclxuXHJcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgIC8vINC60LvQuNC6INC/0L4g0LrQu9C10YLQutC1IGRlbFxyXG4gICAgaWYgKHRhcmdldC5jbG9zZXN0KCcuZGVsLWljb24nKSkge1xyXG4gICAgICAvLyDRgNGP0LQg0L/QviDQutC+0YLQvtGA0L7QvNGDINC60LvQuNC60L3Rg9C70LhcclxuICAgICAgY29uc3QgdGFyZ2V0Um93ID0gdGFyZ2V0LmNsb3Nlc3QoJy5jb250YWN0Jyk7XHJcbiAgICAgIC8vIGlkINC60L7QvdGC0LDQutGC0LAg0LjQtyDRgNGP0LTQsFxyXG4gICAgICBjb25zdCBkYXRhSUQgPSB0YXJnZXRSb3cuaWQ7XHJcbiAgICAgIC8vIGRldGVsZURhdGFDb250YWN0KGRhdGFJRCk7XHJcbiAgICAgIGRhdGEgPSByZW1vdmVTdG9yYWdlKEtFWSwgZGF0YUlEKTsgLy8g0YPQtNCw0LvRj9C10Lwg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LBcclxuICAgICAgLy8gdGFyZ2V0Um93LnJlbW92ZSgpOyAvLyDRg9C00LDQu9GP0LXQvCDRgdGC0YDQvtC60YMg0LjQtyBET01cclxuICAgICAgLy8g0LLRi9Cy0L7QtNC40Lwg0LIg0LrQvtC90YHQvtC70Ywg0YLQviDRh9GC0L4g0YMg0L3QsNGBINCy0YvRiNC70L5cclxuICAgICAgY29uc29sZS5sb2coJ2RlbCByb3cgZnJvbSBkYXRhOiAnLCBkYXRhKTtcclxuXHJcbiAgICAgIC8vIHRvZG8g0YHQutGA0YvQstCw0LXQvCAuZGVsZXRlINCyINC30LDQs9C+0LvQvtCy0LrQtSDRgtCw0LHQu9C40YbRi1xyXG4gICAgICBpZiAob2JqRXZlbnQuaXNTaG93bikge1xyXG4gICAgICAgIGNvbnN0IGhlYWQgPSBsaXN0LnBhcmVudEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICAgICAgaGVhZC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgIG9iakV2ZW50LmlzU2hvd24gPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gdG9kb29vIG1vdmUgdG8gcmVuZGVyQ29udGFjdHNcclxuICAgICAgLy8gLy8g0YPQtNCw0LvRj9C10Lwg0YHRgtGA0L7QutC4INC40LcgRE9NXHJcbiAgICAgIC8vIHdoaWxlIChsaXN0Lmxhc3RDaGlsZCkge1xyXG4gICAgICAvLyAgIGxpc3QubGFzdENoaWxkLnJlbW92ZSgpO1xyXG4gICAgICAvLyB9XHJcbiAgICAgIC8vINC/0LXRgNC10YDQuNGB0L7QstC60LAg0L7QsdC90L7QstC70LXQvdC90L7Qs9C+INGB0L/QuNGB0LrQsCDQutC+0L3RgtCw0LrRgtC+0LJcclxuICAgICAgcmVuZGVyQ29udGFjdHMobGlzdCwgZGF0YSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbi8vINC00L7QsdCw0LLQu9GP0LXQvCDQvdC+0LLRg9GOINGB0YLRgNC+0LrRgyDRgSDQutC+0L3RgtCw0LrRgtC+0Lwg0LIg0YLQtdC70L4g0YLQsNCx0LvQuNGG0YsgdGFibGUudGJvZHlcclxuY29uc3QgYWRkQ29udGFjdFBhZ2UgPSAoY29udGFjdCwgbGlzdCkgPT4ge1xyXG4gIGxpc3QuYXBwZW5kKGNyZWF0ZVJvdyhjb250YWN0KSk7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtQ29udHJvbCA9ICh7Zm9ybSwgbGlzdCwgY2xvc2VNb2RhbH0pID0+IHtcclxuICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7IC8vINC00LDQvdC90YvQtSDQuNC3INGE0L7RgNC80YtcclxuICAgIC8vINGE0L7RgNC80LjRgNGD0LXQvCDQvtCx0YrQtdC60YIg0LrQvtC90YLQsNC60YIg0LjQtyDQt9C90LDRh9C10L3QuNC5INC/0L7Qu9C10Lkg0YTQvtGA0LzRi1xyXG4gICAgY29uc3QgbmV3Q29udGFjdCA9IE9iamVjdC5mcm9tRW50cmllcyhmb3JtRGF0YSk7XHJcbiAgICAvLyDQt9Cw0L/QuNGB0YvQstCw0LXQvCDQsiDQu9C+0LrQsNC70YzQvdC+0LUg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgICBzZXRTdG9yYWdlKEtFWSwgbmV3Q29udGFjdCk7XHJcbiAgICAvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0LIgRE9NINC90LAg0YHRgtGA0LDQvdC40YbRg1xyXG4gICAgYWRkQ29udGFjdFBhZ2UobmV3Q29udGFjdCwgbGlzdCk7XHJcbiAgICAvLyB0b2RvIG1ha2UgaXQg0YHRgNCw0LfRgyDQv9C+0YHQu9C1INC00L7QsdCw0LLQu9C10L3QuNGPINC60L7QvdGC0LDQutGC0LBcclxuICAgIC8vIHRvZG8g0YHQvtGA0YLQuNGA0L7QstCw0YLRjCDQv9C10YDQtdGA0LXQvdC00LXRgNC40YLRjCDRgdC/0LjRgdC+0LpcclxuICAgIC8vIHJlbmRlckNvbnRhY3RzKC4uLilcclxuICAgIGZvcm0ucmVzZXQoKTtcclxuICAgIGNsb3NlTW9kYWwoKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBob3ZlclJvdyxcclxuICBtb2RhbENvbnRyb2wsXHJcbiAgZGVsZXRlQ29udHJvbCxcclxuICBmb3JtQ29udHJvbCxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbmNvbnN0IGNyZWF0ZUNvbnRhaW5lciA9ICgpID0+IHtcclxuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyJyk7XHJcbiAgcmV0dXJuIGNvbnRhaW5lcjtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZUhlYWRlciA9ICgpID0+IHtcclxuICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoZWFkZXInKTtcclxuICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyJyk7XHJcbiAgY29uc3QgaGVhZGVyQ29udGFpbmVyID0gY3JlYXRlQ29udGFpbmVyKCk7XHJcbiAgaGVhZGVyLmFwcGVuZChoZWFkZXJDb250YWluZXIpO1xyXG4gIGhlYWRlci5oZWFkZXJDb250YWluZXIgPSBoZWFkZXJDb250YWluZXI7XHJcbiAgcmV0dXJuIGhlYWRlcjtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZUxvZ28gPSB0aXRsZSA9PiB7XHJcbiAgY29uc3QgaDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xyXG4gIGgxLmNsYXNzTGlzdC5hZGQoJ2xvZ28nKTtcclxuICBoMS50ZXh0Q29udGVudCA9IGDQotC10LvQtdGE0L7QvdC90YvQuSDRgdC/0YDQsNCy0L7Rh9C90LjQui4gJHt0aXRsZX1gO1xyXG4gIHJldHVybiBoMTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZU1haW4gPSAoKSA9PiB7XHJcbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21haW4nKTtcclxuICBjb25zdCBtYWluQ29udGFpbmVyID0gY3JlYXRlQ29udGFpbmVyKCk7XHJcbiAgbWFpbi5hcHBlbmQobWFpbkNvbnRhaW5lcik7XHJcbiAgbWFpbi5tYWluQ29udGFpbmVyID0gbWFpbkNvbnRhaW5lcjtcclxuICByZXR1cm4gbWFpbjtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZUJ1dHRvbkdyb3VwID0gcGFyYW1zID0+IHtcclxuICBjb25zdCBidG5XcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgYnRuV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdidG4td3JhcHBlcicpO1xyXG5cclxuICBjb25zdCBidG5zID0gcGFyYW1zLm1hcCgoe2NsYXNzTmFtZSwgdHlwZSwgdGV4dCwgdGl0bGV9KSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgIGJ1dHRvbi50eXBlID0gdHlwZTtcclxuICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICBidXR0b24uY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gICAgYnV0dG9uLnRpdGxlID0gdGl0bGUgPyB0aXRsZSA6ICcnO1xyXG4gICAgcmV0dXJuIGJ1dHRvbjtcclxuICB9KTtcclxuXHJcbiAgYnRuV3JhcHBlci5hcHBlbmQoLi4uYnRucyk7XHJcbiAgcmV0dXJuIHtcclxuICAgIGJ0bldyYXBwZXIsXHJcbiAgICBidG5zLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVUYWJsZSA9IChkYXRhKSA9PiB7XHJcbiAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xyXG4gIHRhYmxlLmNsYXNzTGlzdC5hZGQoJ3RhYmxlJywgJ3RhYmxlLXN0cmlwZWQnKTtcclxuICAvLyDQs9C10L3QtdGA0LjQvCDQt9Cw0LPQvtC70L7QstC+0Log0YLQsNCx0LvQuNGG0YtcclxuICBjb25zdCB0aGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoZWFkJyk7XHJcbiAgLypcclxuICB0aGVhZC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGBcclxuICAgIDx0cj5cclxuICAgICAgPHRoIGNsYXNzPVwiZGVsZXRlXCI+0KPQtNCw0LvQuNGC0Yw8L3RoPlxyXG4gICAgICA8dGg+0JjQvNGPPC90aD5cclxuICAgICAgPHRoPtCk0LDQvNC40LvQuNGPPC90aD5cclxuICAgICAgPHRoPtCi0LXQu9C10YTQvtC9PC90aD5cclxuICAgIDwvdHI+XHJcbiAgYCk7XHJcbiAgKi9cclxuICAvKlxyXG4gIHRoZWFkLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYFxyXG4gICAgPHRyIGNsYXNzPVwidGFibGVfX3Jvd19oZWFkXCI+XHJcbiAgICAgIDx0aCBjbGFzcz1cImRlbGV0ZVwiPtCj0LTQsNC70LjRgtGMPC90aD5cclxuICAgICAgPHRoIGNsYXNzPVwidGFibGVfX2NlbGxfaGVhZCBieS1uYW1lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0Ynk9XCJieS1uYW1lXCJcclxuICAgICAgICAgICAgdGl0bGU9XCLQodC+0YDRgtC40YDQvtCy0LDRgtGMINC/0L4g0JjQvNC10L3QuFwiPtCY0LzRjzwvdGg+XHJcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cInRhYmxlX19jZWxsX2hlYWRcIlxyXG4gICAgICAgICAgICBkYXRhLXNvcnRieT1cImJ5LXN1cm5hbWVcIlxyXG4gICAgICAgICAgICB0aXRsZT1cItCh0L7RgNGC0LjRgNC+0LLQsNGC0Ywg0L/QviDQpNCw0LzQuNC70LjQuFwiPtCk0LDQvNC40LvQuNGPPC90aD5cclxuICAgICAgICAgICAgPHRoIGNsYXNzPVwidGFibGVfX2NlbGxfaGVhZCBieS1waG9uZSBkZXNjZW5kaW5nXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0Ynk9XCJieS1waG9uZVwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwi0KHQvtGA0YLQuNGA0L7QstCw0YLRjCDQv9C+INC90L7QvNC10YDRgyDRgtC10LvQtdGE0L7QvdCwXCI+0KLQtdC70LXRhNC+0L08L3RoPlxyXG4gICAgPC90cj5cclxuICBgKTtcclxuICAqL1xyXG5cclxuICB0aGVhZC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGBcclxuICAgIDx0ciBjbGFzcz1cInRhYmxlX19yb3dfaGVhZFwiPlxyXG4gICAgICA8dGggY2xhc3M9XCJkZWxldGVcIj7Qo9C00LDQu9C40YLRjDwvdGg+XHJcbiAgICAgIDx0aCBjbGFzcz1cInRhYmxlX19jZWxsX2hlYWQgYnktbmFtZVwiXHJcbiAgICAgICAgICAgIGRhdGEtc29ydGJ5PVwiYnktbmFtZVwiXHJcbiAgICAgICAgICAgIGRhdGEtc29ydG9yZGVyPVwiXCJcclxuICAgICAgICAgICAgdGl0bGU9XCLQodC+0YDRgtC40YDQvtCy0LDRgtGMINC/0L4g0JjQvNC10L3QuFwiPtCY0LzRjzwvdGg+XHJcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cInRhYmxlX19jZWxsX2hlYWQgYnktc3VybmFtZVwiXHJcbiAgICAgICAgICAgIGRhdGEtc29ydGJ5PVwiYnktc3VybmFtZVwiXHJcbiAgICAgICAgICAgIGRhdGEtc29ydG9yZGVyPVwiXCJcclxuICAgICAgICAgICAgdGl0bGU9XCLQodC+0YDRgtC40YDQvtCy0LDRgtGMINC/0L4g0KTQsNC80LjQu9C40LhcIj7QpNCw0LzQuNC70LjRjzwvdGg+XHJcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cInRhYmxlX19jZWxsX2hlYWQgYnktcGhvbmVcIlxyXG4gICAgICAgICAgICBkYXRhLXNvcnRieT1cImJ5LXBob25lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0b3JkZXI9XCJcIlxyXG4gICAgICAgICAgICB0aXRsZT1cItCh0L7RgNGC0LjRgNC+0LLQsNGC0Ywg0L/QviDQvdC+0LzQtdGA0YMg0YLQtdC70LXRhNC+0L3QsFwiPtCi0LXQu9C10YTQvtC9PC90aD5cclxuICAgIDwvdHI+XHJcbiAgYCk7XHJcblxyXG4gIC8vINCz0LXQvdC10YDQuNC8INC4INCy0L7Qt9GA0LDRidCw0LXQvCDRgdGB0YvQu9C60YMg0L3QsCDRgtC10LvQviDRgtCw0LHQu9C40YbRi1xyXG4gIGNvbnN0IHRib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGJvZHknKTtcclxuICB0YWJsZS5hcHBlbmQodGhlYWQsIHRib2R5KTtcclxuICB0YWJsZS50aGVhZCA9IHRoZWFkO1xyXG4gIHRhYmxlLnRib2R5ID0gdGJvZHk7XHJcbiAgcmV0dXJuIHRhYmxlO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlRm9ybSA9ICgpID0+IHtcclxuICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdmb3JtLW92ZXJsYXknKTtcclxuICBjb25zdCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xyXG4gIGZvcm0uY2xhc3NMaXN0LmFkZCgnZm9ybScpO1xyXG4gIGZvcm0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgYFxyXG4gICAgPGgyIGNsYXNzPVwiZm9ybS10aXRsZVwiPtCU0L7QsdCw0LLQuNGC0Ywg0JrQvtC90YLQsNC60YI8L2gyPlxyXG4gIGApO1xyXG4gIGNvbnN0IGNsb3NlQnRuID0gY3JlYXRlQnV0dG9uR3JvdXAoW1xyXG4gICAge1xyXG4gICAgICBjbGFzc05hbWU6ICdjbG9zZScsXHJcbiAgICAgIHR5cGU6ICdidXR0b24nLFxyXG4gICAgICB0aXRsZTogJ9CX0LDQutGA0YvRgtGMINGE0L7RgNC80YMnLFxyXG4gICAgfSxcclxuICBdKS5idG5zWzBdO1xyXG4gIGZvcm0ucHJlcGVuZChjbG9zZUJ0bik7XHJcbiAgLy8g0YHQsNC80LAg0YTQvtGA0LzQsCDQsiDQvNC+0LTQsNC70YzQvdC+0Lwg0L7QutC90LVcclxuICBmb3JtLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYFxyXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJsZSBjb2wtMTJcIiBmb3I9XCJuYW1lXCI+0JjQvNGPPC9sYWJlbD5cclxuICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1pbnB1dCBjb2wtMTIgZm9ybS1jb250cm9sXCIgbmFtZT1cIm5hbWVcIlxyXG4gICAgICAgICAgaWQ9XCJuYW1lXCIgdHlwZT1cInRleHRcIiByZXF1aXJlZD5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJsZSBjb2wtMTJcIiBmb3I9XCJzdXJuYW1lXCI+0KTQsNC80LjQu9C40Y88L2xhYmVsPlxyXG4gICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWlucHV0IGNvbC0xMCBmb3JtLWNvbnRyb2xcIiBuYW1lPVwic3VybmFtZVwiXHJcbiAgICAgICAgICBpZD1cInN1cm5hbWVcIiB0eXBlPVwidGV4dFwiIHJlcXVpcmVkPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmxlIGNvbC0xMlwiIGZvcj1cInBob25lXCI+0KLQtdC70LXRhNC+0L08L2xhYmVsPlxyXG4gICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWlucHV0IGNvbC04IGZvcm0tY29udHJvbFwiIG5hbWU9XCJwaG9uZVwiXHJcbiAgICAgICAgICBpZD1cInBob25lXCIgdHlwZT1cInRleHRcIiByZXF1aXJlZD5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgPGxhYmVsIGNsYXNzPVwiY29sLTEyXCI+PC9sYWJlbD5cclxuICAgIDwvZGl2PlxyXG4gIGApO1xyXG4gIGNvbnN0IGJ1dHRvbkdyb3VwID0gY3JlYXRlQnV0dG9uR3JvdXAoW1xyXG4gICAge1xyXG4gICAgICBjbGFzc05hbWU6ICdidG4gYnRuLXByaW1hcnkgbXItMycsXHJcbiAgICAgIHR5cGU6ICdzdWJtaXQnLFxyXG4gICAgICB0ZXh0OiAn0JTQvtCx0LDQstC40YLRjCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBjbGFzc05hbWU6ICdidG4gYnRuLWRhbmdlcicsXHJcbiAgICAgIHR5cGU6ICdyZXNldCcsXHJcbiAgICAgIHRleHQ6ICfQntGC0LzQtdC90LAnLFxyXG4gICAgfSxcclxuICBdKTtcclxuICBmb3JtLmFwcGVuZChidXR0b25Hcm91cC5idG5XcmFwcGVyKTtcclxuICBvdmVybGF5LmFwcGVuZChmb3JtKTtcclxuICByZXR1cm4ge1xyXG4gICAgb3ZlcmxheSxcclxuICAgIGZvcm0sXHJcbiAgICBjbG9zZUJ0bixcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlRm9vdGVyID0gKCkgPT4ge1xyXG4gIGNvbnN0IGZvb3RlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvb3RlcicpO1xyXG4gIGZvb3Rlci5jbGFzc0xpc3QuYWRkKCdmb290ZXInKTtcclxuICBjb25zdCBmb290ZXJDb250YWluZXIgPSBjcmVhdGVDb250YWluZXIoKTtcclxuICBmb290ZXIuYXBwZW5kKGZvb3RlckNvbnRhaW5lcik7XHJcbiAgZm9vdGVyLmZvb3RlckNvbnRhaW5lciA9IGZvb3RlckNvbnRhaW5lcjtcclxuICBmb290ZXJDb250YWluZXIudGV4dENvbnRlbnQgPSAn0KTRg9GC0LXRgCDQutC+0L/QuNGA0LDQudGCJztcclxuICByZXR1cm4gZm9vdGVyO1xyXG59O1xyXG5cclxuXHJcbmNvbnN0IGNyZWF0ZVJvdyA9ICh7bmFtZTogZmlyc3RuYW1lLCBzdXJuYW1lLCBwaG9uZSwgaWR9KSA9PiB7XHJcbiAgY29uc3QgdHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xyXG4gIC8vINC/0YDQvtCy0LXRgNC60LAg0L3QsCB1bmRlZmluZWQg0L3QsCDRgdGD0YnQtdGB0YLQstC+0LLQsNC90LjQtSDQv9C+0LvRj1xyXG4gIGlmIChpZCkge1xyXG4gICAgdHIuaWQgPSBpZDtcclxuICAgIC8vINGN0YLQvtGCIGlkINGA0Y/QtNCwINC60L7QvdGC0LrRgtCwINC00LvRjyDQuNC00LXQvdGC0LjRhNC40LrQsNGG0LjQuFxyXG4gIH0gZWxzZSB7XHJcbiAgICB0ci5pZCA9ICd0cicgKyBoYXNoQ29kZShmaXJzdG5hbWUpICsgaGFzaENvZGUoc3VybmFtZSkgKyBoYXNoQ29kZShwaG9uZSk7XHJcbiAgICAvLyDRgtCw0LrQvtC5IGlkINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YJcclxuICB9XHJcbiAgdHIuY2xhc3NMaXN0LmFkZCgnY29udGFjdCcpO1xyXG4gIHRyLnRpdGxlID0gYNCa0L7QvdGC0LDQutGCICR7c3VybmFtZX0gJHtmaXJzdG5hbWV9YDtcclxuXHJcbiAgY29uc3QgdGREZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gIHRkRGVsLmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZScpO1xyXG4gIGNvbnN0IGJ1dHRvbkRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gIGJ1dHRvbkRlbC5jbGFzc0xpc3QuYWRkKCdkZWwtaWNvbicpO1xyXG4gIHRkRGVsLmFwcGVuZChidXR0b25EZWwpO1xyXG5cclxuICBjb25zdCB0ZE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gIHRkTmFtZS50ZXh0Q29udGVudCA9IGZpcnN0bmFtZTtcclxuXHJcbiAgY29uc3QgdGRTdXJuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICB0ZFN1cm5hbWUudGV4dENvbnRlbnQgPSBzdXJuYW1lO1xyXG5cclxuICBjb25zdCB0ZFBob25lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICBjb25zdCBwaG9uZUxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgcGhvbmVMaW5rLmhyZWYgPSAndGVsOicgKyBwaG9uZTtcclxuICBwaG9uZUxpbmsudGV4dENvbnRlbnQgPSBwaG9uZTtcclxuICB0ci5waG9uZUxpbmsgPSBwaG9uZUxpbms7XHJcbiAgdGRQaG9uZS5hcHBlbmQocGhvbmVMaW5rKTtcclxuXHJcbiAgdHIuYXBwZW5kKHRkRGVsLCB0ZE5hbWUsIHRkU3VybmFtZSwgdGRQaG9uZSk7XHJcbiAgcmV0dXJuIHRyO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIC8vIGNyZWF0ZUNvbnRhaW5lcixcclxuICBjcmVhdGVIZWFkZXIsXHJcbiAgY3JlYXRlTG9nbyxcclxuICBjcmVhdGVNYWluLFxyXG4gIGNyZWF0ZUJ1dHRvbkdyb3VwLFxyXG4gIGNyZWF0ZVRhYmxlLFxyXG4gIGNyZWF0ZUZvcm0sXHJcbiAgY3JlYXRlRm9vdGVyLFxyXG4gIGNyZWF0ZVJvdyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gKiBqcyBtb2R1bGUgdXNpbmcgQ0pTIGZvciBoYXNoXHJcbi8vICDQstC+0LfQstGA0LDRidCw0LXRgiBoYXNoQ29kZSDQv9C+INGB0YLRgNC+0LrQtSBzdHJcclxuY29uc3QgaGFzaENvZGUgPSAoc3RyKSA9PiB7XHJcbiAgbGV0IGhhc2ggPSAwO1xyXG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzdHIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgIGNvbnN0IGNociA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgaGFzaCA9IChoYXNoIDw8IDUpIC0gaGFzaCArIGNocjtcclxuICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXHJcbiAgfVxyXG4gIHJldHVybiBNYXRoLmFicyhoYXNoKTtcclxufTtcclxuXHJcbi8vINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGB0LPQtdC90LXRgNC40YDQvtCy0LDQvdGL0LkgaGFzaCBpZCDQtNC70Y8g0LrQvtC90YLQsNC60YLQsFxyXG4vLyDRg9GH0LjRgtGL0LLQsNGPINC40LzRjyDQv9C+0LvRjyBpZFxyXG5jb25zdCBnZXRDb250YWN0SGFzaCA9IChjb250YWN0ID0ge30pID0+IHtcclxuICBjb25zdCBoYXNoSUQgPSBPYmplY3QuZW50cmllcyhjb250YWN0KVxyXG4gICAgICAucmVkdWNlKChhY2N1bSwgY3VyciwgaW5kZXgsIGFycikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGN1cnJOYW1lID0gY3VyclswXTtcclxuICAgICAgICBjb25zdCBjdXJyVmFsID0gY3VyclsxXTtcclxuICAgICAgICBpZiAoY3Vyck5hbWUgPT09ICdpZCcpIHtcclxuICAgICAgICAgIC8vINC/0L7Qu9C1INGBINC40LzQtdC90LXQvCBpZCDQvdC1INGD0YfQuNGC0YvQstCw0LXRgtGB0Y8hXHJcbiAgICAgICAgICByZXR1cm4gYWNjdW07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBgJHthY2N1bX14JHtoYXNoQ29kZShjdXJyVmFsKS50b1N0cmluZygzMil9YDtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgICdpZCcpO1xyXG4gIHJldHVybiBoYXNoSUQ7XHJcbn07XHJcblxyXG4vLyAqINGN0LrRgdC/0L7RgNGC0LjRgNGD0LXQvCDQsiDRgdC+0YHRgtCw0LLQtSDQvNC+0LTRg9C70Y9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZ2V0Q29udGFjdEhhc2gsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5jb25zdCB7XHJcbiAgY3JlYXRlSGVhZGVyLFxyXG4gIGNyZWF0ZUxvZ28sXHJcbiAgY3JlYXRlTWFpbixcclxuICBjcmVhdGVCdXR0b25Hcm91cCxcclxuICBjcmVhdGVUYWJsZSxcclxuICBjcmVhdGVGb3JtLFxyXG4gIGNyZWF0ZUZvb3RlcixcclxuICBjcmVhdGVSb3csXHJcbn0gPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKTtcclxuXHJcblxyXG5jb25zdCByZW5kZXJQaG9uZWJvb2sgPSAoYXBwLCB0aXRsZSkgPT4ge1xyXG4gIGNvbnN0IGhlYWRlciA9IGNyZWF0ZUhlYWRlcigpO1xyXG4gIGNvbnN0IGxvZ28gPSBjcmVhdGVMb2dvKHRpdGxlKTtcclxuICBjb25zdCBtYWluID0gY3JlYXRlTWFpbigpO1xyXG4gIGNvbnN0IGJ1dHRvbkdyb3VwID0gY3JlYXRlQnV0dG9uR3JvdXAoW1xyXG4gICAge1xyXG4gICAgICBjbGFzc05hbWU6ICdidG4gYnRuLXByaW1hcnkgbXItMycsXHJcbiAgICAgIHR5cGU6ICdidXR0b24nLFxyXG4gICAgICB0ZXh0OiAn0JTQvtCx0LDQstC40YLRjCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBjbGFzc05hbWU6ICdidG4gYnRuLWRhbmdlcicsXHJcbiAgICAgIHR5cGU6ICdidXR0b24nLFxyXG4gICAgICB0ZXh0OiAn0KPQtNCw0LvQuNGC0YwnLFxyXG4gICAgfSxcclxuICBdKTtcclxuICBjb25zdCB0YWJsZSA9IGNyZWF0ZVRhYmxlKCk7XHJcbiAgY29uc3Qge2Zvcm0sIG92ZXJsYXksIGNsb3NlQnRufSA9IGNyZWF0ZUZvcm0oKTtcclxuICBjb25zdCBmb290ZXIgPSBjcmVhdGVGb290ZXIoKTtcclxuXHJcbiAgaGVhZGVyLmhlYWRlckNvbnRhaW5lci5hcHBlbmQobG9nbyk7XHJcbiAgbWFpbi5tYWluQ29udGFpbmVyLmFwcGVuZChidXR0b25Hcm91cC5idG5XcmFwcGVyLCB0YWJsZSwgb3ZlcmxheSk7XHJcbiAgbWFpbi5hcHBlbmQob3ZlcmxheSk7XHJcbiAgZm9vdGVyLmZvb3RlckNvbnRhaW5lci5pbm5lckhUTUwgPSBg0JLRgdC1INC/0YDQsNCy0LAg0LfQsNGJ0LjRidC10L3RiyAmY29weTsgJHt0aXRsZX1gO1xyXG4gIGFwcC5hcHBlbmQoaGVhZGVyLCBtYWluLCBmb290ZXIpO1xyXG4gIHJldHVybiB7XHJcbiAgICBsb2dvLFxyXG4gICAgaGVhZDogdGFibGUudGhlYWQsXHJcbiAgICBsaXN0OiB0YWJsZS50Ym9keSxcclxuICAgIGJ0bkFkZDogYnV0dG9uR3JvdXAuYnRuc1swXSxcclxuICAgIGJ0bkRlbDogYnV0dG9uR3JvdXAuYnRuc1sxXSxcclxuICAgIGNsb3NlQnRuLFxyXG4gICAgZm9ybU92ZXJsYXk6IG92ZXJsYXksXHJcbiAgICBmb3JtLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCByZW5kZXJDb250YWN0cyA9IChsaXN0LCBkYXRhKSA9PiB7XHJcbiAgLy8g0YPQtNCw0LvRj9C10Lwg0YHRgtGA0L7QutC4INC40LcgRE9NXHJcbiAgd2hpbGUgKGxpc3QubGFzdENoaWxkKSB7XHJcbiAgICBsaXN0Lmxhc3RDaGlsZC5yZW1vdmUoKTtcclxuICB9XHJcbiAgaWYgKGRhdGEpIHtcclxuICAgIGNvbnN0IGFsbFJvd3MgPSBkYXRhLm1hcChjcmVhdGVSb3cpO1xyXG4gICAgbGlzdC5hcHBlbmQoLi4uYWxsUm93cyk7XHJcbiAgICByZXR1cm4gYWxsUm93cztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICByZW5kZXJQaG9uZWJvb2ssXHJcbiAgcmVuZGVyQ29udGFjdHMsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIEdMT0JBTCBLRVlTIGFuZCBEQVRBXHJcbmxldCBkYXRhID0gW107XHJcbmNvbnN0IEtFWSA9ICdwaG9uZS10ZXN0JztcclxuLy8gY29uc3QgS0VZID0gJ3Bob25lLXRlc3QyJztcclxuLy8gY29uc3QgU09SVF9LRVkgPSAncGhvbmUtc29ydDMnO1xyXG5cclxuY29uc3Qge2dldENvbnRhY3RIYXNofSA9IHJlcXVpcmUoJy4vaGFzaCcpO1xyXG5cclxuLy8g0YfQuNGC0LDQtdGCINC4INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC00LDQvdC90YvQtSBkYXRhINC40Lcg0KXRgNCw0L3QuNC70LjRidCwXHJcbmNvbnN0IGdldFN0b3JhZ2UgPSAoc3RvcmFnZUtleSkgPT4ge1xyXG4gIGxldCByZXN1bHQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKEtFWSkpO1xyXG4gIGlmICghQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XHJcbiAgICByZXN1bHQgPSBbXTtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8vINGH0LjRgtCw0LXRgiDQtNCw0L3QvdGL0LUg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LAg0LTQvtCx0LDQstC70Y/QtdGCINC6INC90LjQvCDQutC+0L3RgtCw0LrRglxyXG4vLyDQuCDRgdC90L7QstCwINC/0LXRgNC10LfQsNCy0LjRgdGL0LLQsNC10YIg0LTQsNC90L3Ri9C1INCyINGF0YDQsNC90LjQu9C40YnQtVxyXG5jb25zdCBzZXRTdG9yYWdlID0gKHN0b3JhZ2VLZXksIGNvbnRhY3QgPSB7fSkgPT4ge1xyXG4gIC8vINGH0LjRgtCw0LXQvCDRgtC10LrRg9GJ0LjQtSDQtNCw0L3QvdGL0LVcclxuICBkYXRhID0gZ2V0U3RvcmFnZShLRVkpO1xyXG4gIC8vINC/0YDQvtCy0LXRgNGP0LXQvCDQv9GD0YHRgtC+0Lkg0LvQuCDQuCDQvNCw0YHQuNCyINC70Lgg0LLQvtC+0LHRidC1XHJcbiAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICBkYXRhID0gW107XHJcbiAgfVxyXG4gIC8vINC/0YDQvtCy0LXRgNC60LAg0L3QsCDQuNC80Y8g0L/QvtC70LXQuSBuYW1lLCBzdXJuYW1lLCBwaG9uZVxyXG4gIGlmIChjb250YWN0Lm5hbWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgY29udGFjdC5uYW1lID0gJyc7XHJcbiAgfVxyXG4gIGlmIChjb250YWN0LnN1cm5hbWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgY29udGFjdC5zdXJuYW1lID0gJyc7XHJcbiAgfVxyXG4gIGlmIChjb250YWN0LnBob25lID09PSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnRhY3QucGhvbmUgPSAnJztcclxuICB9XHJcbiAgLy8g0LTQsNCx0LDQstC70Y/QtdC8INGF0Y3RiFxyXG4gIGlmIChjb250YWN0LmlkID09PSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnRhY3QuaWQgPSBnZXRDb250YWN0SGFzaChjb250YWN0KTtcclxuICB9XHJcbiAgLy8g0LTQsNCx0LDQstC70Y/QtdC8INC60L7QvdGC0LDQutGCINCyIGRhdGFcclxuICBkYXRhLnB1c2goY29udGFjdCk7XHJcbiAgLy8g0L7QsdC90L7QstC70Y/QtdC8INC00LDQvdC90YvQtSDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzdG9yYWdlS2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn07XHJcblxyXG4vLyAg0LPQtdC90LXRgNC40YDRg9C10YIg0LTQvtCx0LDQstC70Y/QtdGCIC5pZCDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0LrQvtC90YLQsNC60YLQsCDQvtCx0YrQutGC0LAg0LIg0LzQsNGB0YHQuNCy0LUgZGF0YVxyXG5jb25zdCBtYWtlRGF0YUNvbnRhY3RzSGFzaGVzID0gKGRhdGEpID0+IHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcclxuICAgIHJldHVybiBkYXRhLm1hcCgoY29udGFjdCwgaW5kZXgpID0+IHtcclxuICAgICAgY29udGFjdC5pZCA9IGdldENvbnRhY3RIYXNoKGNvbnRhY3QpO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCByZW1vdmVTdG9yYWdlID0gKHN0b3JhZ2VLZXksIGlkKSA9PiB7XHJcbiAgLy8g0YfQuNGC0LDQtdC8INGC0LXQutGD0YnQuNC1INC00LDQvdC90YvQtVxyXG4gIGRhdGEgPSBnZXRTdG9yYWdlKEtFWSk7XHJcbiAgLy8g0YPQtNCw0LvRj9C10Lwg0LjQtyDQvNCw0YHRgdC40LLQsCDQutC+0L3RgtCw0LrRgiDRgSDRjdGC0LjQvCBpZFxyXG4gIGRhdGEuZm9yRWFjaCgoY29udGFjdCwgaW5kZXgsIGFycikgPT4ge1xyXG4gICAgaWYgKGNvbnRhY3QuaWQgPT09IGlkKSB7XHJcbiAgICAgIGRhdGEuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICB9KTtcclxuICAvLyDRgdC+0YXRgNCw0L3Rj9C10Lwg0L7QsdGA0LDRgtC90L4g0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc3RvcmFnZUtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gIHJldHVybiBkYXRhO1xyXG59O1xyXG5cclxuXHJcbi8vICogZXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBkYXRhLFxyXG4gIEtFWSxcclxuICBnZXRTdG9yYWdlLFxyXG4gIHNldFN0b3JhZ2UsXHJcbiAgbWFrZURhdGFDb250YWN0c0hhc2hlcyxcclxuICByZW1vdmVTdG9yYWdlLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLy8gKiBzb3J0RGF0YUJ5XHJcbmNvbnN0IHNvcnREYXRhQnkgPSAoc29ydGJ5ID0gJycsIHNvcnRvcmRlciA9ICcnLCBkYXRhKSA9PiB7XHJcbiAgbGV0IHNvcnRlZCA9IFtdO1xyXG4gIHN3aXRjaCAoc29ydGJ5KSB7XHJcbiAgICBjYXNlICdieS1uYW1lJzpcclxuICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QviDQuNC80LXQvdC4XHJcbiAgICAgIHNvcnRlZCA9IGRhdGEuc29ydCgocHJldiwgbmV4dCkgPT4ge1xyXG4gICAgICAgIC8vIGFzY2VuZGluZyBhLCBiLCBjLCAuLiB6IG9yZGVyXHJcbiAgICAgICAgbGV0IG5hbWVQcmV2ID0gcHJldj8ubmFtZTtcclxuICAgICAgICBsZXQgbmFtZU5leHQgPSBuZXh0Py5uYW1lO1xyXG4gICAgICAgIGlmIChzb3J0b3JkZXIgPT09ICdkZXNjZW5kaW5nJykge1xyXG4gICAgICAgICAgLy8gZGVzY2VuZGluZyB6LCB5LCB4LCAuLiBhIG9yZGVyXHJcbiAgICAgICAgICBuYW1lUHJldiA9IG5leHQ/Lm5hbWU7XHJcbiAgICAgICAgICBuYW1lTmV4dCA9IHByZXY/Lm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuYW1lUHJldiA+IG5hbWVOZXh0KSB7XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5hbWVQcmV2IDwgbmFtZU5leHQpIHtcclxuICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdieS1zdXJuYW1lJzpcclxuICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QviDRhNCw0LzQuNC70LjQuFxyXG4gICAgICBzb3J0ZWQgPSBkYXRhLnNvcnQoKHByZXYsIG5leHQpID0+IHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxyXG4gICAgICAgIGNvbnN0IHN1cm5hbWVQcmV2ID0gKHNvcnRvcmRlciA9PT0gJ2FzY2VuZGluZycpID8gcHJldi5zdXJuYW1lIDogbmV4dC5zdXJuYW1lO1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXHJcbiAgICAgICAgY29uc3Qgc3VybmFtZU5leHQgPSAoc29ydG9yZGVyID09PSAnYXNjZW5kaW5nJykgPyBuZXh0LnN1cm5hbWUgOiBwcmV2LnN1cm5hbWU7XHJcbiAgICAgICAgaWYgKHN1cm5hbWVQcmV2ID4gc3VybmFtZU5leHQpIHtcclxuICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3VybmFtZVByZXYgPCBzdXJuYW1lTmV4dCkge1xyXG4gICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2J5LXBob25lJzpcclxuICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QviDQvdC+0LzQtdGA0YMg0YLQtdC70LXRhNC+0L3QsFxyXG4gICAgICBzb3J0ZWQgPSBkYXRhLnNvcnQoKHByZXYsIG5leHQpID0+IHtcclxuICAgICAgICBsZXQgcHJldlBob25lID0gJyc7XHJcbiAgICAgICAgbGV0IG5leHRQaG9uZSA9ICcnO1xyXG4gICAgICAgIGlmIChzb3J0b3JkZXIgPT09ICdhc2NlbmRpbmcnKSB7XHJcbiAgICAgICAgICBwcmV2UGhvbmUgPSBwcmV2LnBob25lO1xyXG4gICAgICAgICAgbmV4dFBob25lID0gbmV4dC5waG9uZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcHJldlBob25lID0gbmV4dC5waG9uZTtcclxuICAgICAgICAgIG5leHRQaG9uZSA9IHByZXYucGhvbmU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwcmV2UGhvbmUgPiBuZXh0UGhvbmUpIHtcclxuICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocHJldlBob25lIDwgbmV4dFBob25lKSB7XHJcbiAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgY29uc29sZS5sb2coJ9C/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuICAvLyByZXR1cm4gZGF0YTtcclxuICByZXR1cm4gc29ydGVkO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgc29ydERhdGFCeSxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gLy8gR0xPQkFMIEtFWVMgYW5kIERBVEFcclxuLy8gbGV0IGRhdGEgPSBbXTtcclxuLy8gY29uc3QgS0VZID0gJ3Bob25lLXRlc3QyJztcclxuY29uc3QgU09SVF9LRVkgPSAncGhvbmUtc29ydDMnO1xyXG5cclxubGV0IHtkYXRhfSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9zZXJ2aWNlU3RvcmFnZScpO1xyXG5cclxue1xyXG4gIGNvbnNvbGUubG9nKCdkYXRhOiAnLCBkYXRhKTtcclxuICAvLyBsZXQgZGF0YSA9IFtdO1xyXG4gIGNvbnN0IHtcclxuICAgIEtFWSxcclxuICAgIGdldFN0b3JhZ2UsXHJcbiAgICAvLyBzZXRTdG9yYWdlLFxyXG4gICAgbWFrZURhdGFDb250YWN0c0hhc2hlcyxcclxuICAgIC8vIHJlbW92ZVN0b3JhZ2UsXHJcbiAgfSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9zZXJ2aWNlU3RvcmFnZScpO1xyXG5cclxuICBjb25zdCB7c29ydERhdGFCeX0gPSByZXF1aXJlKCcuL21vZHVsZXMvc29ydCcpO1xyXG5cclxuICBjb25zdCB7XHJcbiAgICBob3ZlclJvdyxcclxuICAgIG1vZGFsQ29udHJvbCxcclxuICAgIGRlbGV0ZUNvbnRyb2wsXHJcbiAgICBmb3JtQ29udHJvbCxcclxuICB9ID0gcmVxdWlyZSgnLi9tb2R1bGVzL2NvbnRyb2wnKTtcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgcmVuZGVyUGhvbmVib29rLFxyXG4gICAgcmVuZGVyQ29udGFjdHMsXHJcbiAgfSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9yZW5kZXInKTtcclxuXHJcblxyXG4gIC8vICogTUFJTiBJTklUICpcclxuICBjb25zdCBpbml0ID0gKHNlbGVjdG9yQXBwLCB0aXRsZSkgPT4ge1xyXG4gICAgY29uc3QgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvckFwcCk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ2JlZ2luIGRhdGE6ICcsIGRhdGEpO1xyXG4gICAgLy8g0YfQuNGC0LDQtdC8INC00LDQvdC90YvQtSDQutC+0L3RgtCw0LrRgtC+0LIg0LjQtyDQpdGA0LDQvdC40LvQuNGJ0LBcclxuICAgIGRhdGEgPSBnZXRTdG9yYWdlKEtFWSk7XHJcbiAgICBjb25zb2xlLmxvZygnaW5pdCBkYXRhOiAnLCBkYXRhKTtcclxuICAgIC8vINC+0LHQvdC+0LLQu9GP0LXQvCDRhdGN0YjQuCBpZCDQutC+0L3RgtCw0LrRgtC+0LJcclxuICAgIG1ha2VEYXRhQ29udGFjdHNIYXNoZXMoZGF0YSk7XHJcbiAgICBjb25zb2xlLmxvZygnaGFzaCBkYXRhOiAnLCBkYXRhKTtcclxuICAgIC8vINGB0L7RhdGA0LDQvdGP0LXQvCDQvtCx0YDQsNGC0L3QviDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEtFWSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgLy8g0L/QtdGA0LXQvdC10YHRgtC4INCyIG1ha2VEYXRhQ29udGFjdHNIYXNoZXNcclxuXHJcbiAgICAvLyDRh9C40YLQsNC10Lwg0LTQsNC90L3Ri9C1INC+INGB0L7RgNGC0LjRgNC+0LLQutC1XHJcbiAgICBsZXQgc29ydEluZm8gPSB7fTtcclxuICAgIC8vIGxldCBzb3J0SW5mbyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oU09SVF9LRVkpKTsgLy8gdG9kb1xyXG5cclxuICAgIGNvbnN0IHtcclxuICAgICAgaGVhZCwgLy8gdGFibGUgdGhlYWRcclxuICAgICAgbGlzdCwgLy8gdGFibGUgdGJvZHlcclxuICAgICAgbG9nbyxcclxuICAgICAgYnRuQWRkLFxyXG4gICAgICBidG5EZWwsXHJcbiAgICAgIGZvcm1PdmVybGF5LFxyXG4gICAgICBjbG9zZUJ0bixcclxuICAgICAgZm9ybSxcclxuICAgIH0gPSByZW5kZXJQaG9uZWJvb2soYXBwLCB0aXRsZSk7XHJcblxyXG4gICAgLy8gb2JqRXZlbnQg0L7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Lkg0LrQu9C40LrQvtCyINC90LAgYnRuQWRkINC4IGJ0bkRlbFxyXG4gICAgY29uc3Qgb2JqRXZlbnRCdG5zID0ge1xyXG4gICAgICBpc1Nob3duOiBmYWxzZSwgLy8g0LIg0L3QsNGH0LDQu9C1INC30LDQutGA0YvRgtGLINCy0YHQtSDRj9GH0LXQudC60Lgg0YEg0LrQvdC+0L/QutCw0LzQuCAuZGVsZXRlXHJcbiAgICAgIGhhbmRsZUV2ZW50KGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgIGNvbnN0IGNlbGxEZWxldGVBbGwgPSBsaXN0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRlbGV0ZScpO1xyXG4gICAgICAgIC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L3QvtC/0LrRgyDQlNC+0LHQsNCy0LjRgtGMIGJ0bkFkZFxyXG4gICAgICAgIGlmICh0YXJnZXQgPT09IGJ0bkFkZCkge1xyXG4gICAgICAgIC8vINC30LTQtdGB0Ywg0LTQtdC70LDQtdC8INCy0LjQtNC40LzRi9C8INC+0LLQtdGA0LvQsNC5INC4INC80L7QtNCw0LvQutGDXHJcbiAgICAgICAgICBmb3JtT3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy12aXNpYmxlJyk7XHJcbiAgICAgICAgICAvLyDQt9C00LXRgdGMINGB0LrRgNGL0LLQsNC10Lwg0LLRgdC1INC60L3QvtC/0LrQuCAuZGVsZXRlXHJcbiAgICAgICAgICAvLyBjb25zdCBjZWxsRGVsZXRlQWxsID0gdGFibGUucXVlcnlTZWxlY3RvckFsbCgnLmRlbGV0ZScpO1xyXG4gICAgICAgICAgdGhpcy5pc1Nob3duID0gZmFsc2U7XHJcbiAgICAgICAgICBjZWxsRGVsZXRlQWxsLmZvckVhY2goY2VsbERlbGV0ZSA9PiB7XHJcbiAgICAgICAgICAgIGNlbGxEZWxldGUuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgLy8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrQvdC+0L/QutGDINCj0LTQsNC70LjRgtGMIGJ0bkRlbFxyXG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0ID09PSBidG5EZWwpIHtcclxuICAgICAgICAvLyDQt9C00LXRgdGMINC/0L7QutCw0LfRi9Cy0LDQtdC8INCy0YHQtSDQutC90L7Qv9C60LggLmRlbGV0ZVxyXG4gICAgICAgICAgaWYgKHRoaXMuaXNTaG93bikge1xyXG4gICAgICAgICAgLy8g0LXRgdC70Lgg0LLQuNC00LjQvNGL0LUg0YLQviDRgdC60YDRi9Cy0LDQtdC8XHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjZWxsRGVsZXRlQWxsLmZvckVhY2goY2VsbERlbGV0ZSA9PiB7XHJcbiAgICAgICAgICAgICAgY2VsbERlbGV0ZS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vINC10YHQu9C4INCx0YvQu9C4INGB0LrRgNGL0YLRi9C1INGC0L4g0L/QvtC60LDQt9GL0LLQsNC10LxcclxuICAgICAgICAgICAgdGhpcy5pc1Nob3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2VsbERlbGV0ZUFsbC5mb3JFYWNoKGNlbGxEZWxldGUgPT4ge1xyXG4gICAgICAgICAgICAgIGNlbGxEZWxldGUuY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIC8vINCk0KPQndCa0KbQmNCe0J3QkNCbINCX0JTQldCh0KxcclxuICAgIC8vIHRvZG8gaW5pdCBzb3J0IHBhcmFtczogc29ydG9yZGVyIHNvcnRieVxyXG4gICAgaWYgKCEoc29ydEluZm8gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNPUlRfS0VZKSkpKSB7XHJcbiAgICAgIC8vINC10YHQu9C4IHNvcnRJbmZvINC90LXQoiDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICAgICAgLy8g0LfQsNC/0L7Qu9C90Y/QtdC8INC30L3QsNGH0LXQvdC40LXQvCDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgICBzb3J0SW5mbyA9IHtcclxuICAgICAgICBzb3J0Ynk6ICdieS1uYW1lJyxcclxuICAgICAgICBzb3J0b3JkZXI6ICdhc2NlbmRpbmcnLFxyXG4gICAgICB9O1xyXG4gICAgICAvLyDRgdC+0YXRgNCw0L3Rj9C10Lwg0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNPUlRfS0VZLCBKU09OLnN0cmluZ2lmeShzb3J0SW5mbykpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8g0LXRgdC70Lgg0YHQvtGF0YDQsNC90LXQvdC+INCyINGF0YDQsNC90LjQu9C40YnQtVxyXG4gICAgICBjb25zb2xlLmxvZygn0L3QsNGH0LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LIg0YXRgNCw0L3QuNC70LjRidC1IHNvcnRJbmZvOicsIHNvcnRJbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpbml0aWFsIHJvd3Mgc29ydGluZ1xyXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBoZWFkLmZpcnN0RWxlbWVudENoaWxkLmNoaWxkcmVuKSB7XHJcbiAgICAgIC8vICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnYXNjZW5kaW5nJyk7XHJcbiAgICAgIC8vICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnZGVzY2VuZGluZycpO1xyXG4gICAgICAvLyAgIGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID0gJyc7XHJcbiAgICAgIGlmIChjaGlsZC5kYXRhc2V0LnNvcnRieSA9PT0gc29ydEluZm8uc29ydGJ5KSB7XHJcbiAgICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZChzb3J0SW5mby5zb3J0b3JkZXIpO1xyXG4gICAgICAgIGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID0gc29ydEluZm8uc29ydG9yZGVyOyAvLyBmbGFnXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkYXRhID0gc29ydERhdGFCeShzb3J0SW5mby5zb3J0YnksIHNvcnRJbmZvLnNvcnRvcmRlciwgZGF0YSk7XHJcbiAgICBjb25zb2xlLmxvZygnYWZ0ZXIgc29ydCBkYXRhOiAnLCBkYXRhKTtcclxuICAgIC8vIC8vINGB0L3QsNGH0LDQu9CwINGD0LTQsNC70Y/QtdC8INC40LcgRE9NXHJcbiAgICAvLyB3aGlsZSAobGlzdC5sYXN0Q2hpbGQpIHtcclxuICAgIC8vICAgbGlzdC5sYXN0Q2hpbGQucmVtb3ZlKCk7XHJcbiAgICAvLyB9XHJcbiAgICAvLyDQv9C+0YLQvtC8INC/0LXRgNC10YDQtdC90LTQtdGA0LjQstCw0LXQvFxyXG4gICAgY29uc3QgYWxsUm93ID0gcmVuZGVyQ29udGFjdHMobGlzdCwgZGF0YSk7XHJcblxyXG4gICAgaGVhZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgIC8vIGNsaWNrINC/0L4g0LrQu9C10YLQutCw0Lwg0LfQsNCz0L7Qu9C+0LLQutCwINGC0LDQsdC70LjRhtGLINC00LvRjyDRgdC+0YDRgtC40YDQvtCy0LrQuFxyXG4gICAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndGFibGVfX2NlbGxfaGVhZCcpKSB7XHJcbiAgICAgICAgLy8g0L/QtdGA0LXQsdC40YDQsNC10Lwg0LLRgdC1INC00L7Rh9C10YDQvdC40LUg0LrQu9C10YLQutC4INGA0Y/QtNCwINC30LDQs9C+0LvQvtCy0LrQsCDRgtCw0LHQu9C40YbRi1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgaGVhZC5maXJzdEVsZW1lbnRDaGlsZC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgaWYgKHRhcmdldCA9PT0gY2hpbGQpIHtcclxuICAgICAgICAgICAgLy8g0J/Qo9Ch0KLQkNCvINCS0JrQm9CQ0JTQmtCQIFwiXCJcclxuICAgICAgICAgICAgaWYgKGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID09PSAnJykge1xyXG4gICAgICAgICAgICAgIGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID0gJ2Rlc2NlbmRpbmcnO1xyXG4gICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2FzY2VuZGluZycpO1xyXG4gICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoJ2Rlc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZW1wdHkgdG8gYXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9PT0gJ2FzY2VuZGluZycpIHtcclxuICAgICAgICAgICAgICBjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9ICdkZXNjZW5kaW5nJztcclxuICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKCdkZXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FzY2VuZGluZyB0byBkZXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQuZGF0YXNldC5zb3J0b3JkZXIgPT09ICdkZXNjZW5kaW5nJykge1xyXG4gICAgICAgICAgICAgIGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID0gJ2FzY2VuZGluZyc7XHJcbiAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnZGVzY2VuZGluZycpO1xyXG4gICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoJ2FzY2VuZGluZycpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXNjZW5kaW5nIHRvIGFzY2VuZGluZycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnZGVzY2VuZGluZycpO1xyXG4gICAgICAgICAgICBjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc29ydEluZm8uc29ydGJ5ID0gdGFyZ2V0LmRhdGFzZXQ/LnNvcnRieTtcclxuICAgICAgICBzb3J0SW5mby5zb3J0b3JkZXIgPSB0YXJnZXQuZGF0YXNldD8uc29ydG9yZGVyO1xyXG4gICAgICAgIC8vINC+0LHQvdC+0LLQu9GP0LXQvCDQtNCw0L3QvdGL0LUg0L4g0YHQvtGA0YLQuNGA0L7QstC60LUg0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU09SVF9LRVksIEpTT04uc3RyaW5naWZ5KHNvcnRJbmZvKSk7XHJcblxyXG5cclxuICAgICAgICBpZiAob2JqRXZlbnRCdG5zLmlzU2hvd24pIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWxldGUg0YHQutGA0YvQstCw0LXQvCcpO1xyXG4gICAgICAgICAgaGVhZC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgICAgb2JqRXZlbnRCdG5zLmlzU2hvd24gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g0L7RgdC60YLQu9GM0L3Ri9C1INCyINGC0LDQsdC70LjRhtC1INC/0YDQvtGB0YLQviDQv9C10YDQtdGA0LXQvdC00LXRgNGP0YLRgdGPXHJcblxyXG4gICAgICAgIC8vINGB0L7RgNGC0LjRgNGD0LXQvFxyXG4gICAgICAgIGNvbnN0IHNvcnREYXRhID0gc29ydERhdGFCeShzb3J0SW5mby5zb3J0YnksIHNvcnRJbmZvLnNvcnRvcmRlciwgZGF0YSk7XHJcbiAgICAgICAgLy8g0YPQtNCw0LvRj9C10Lwg0YHRgtGA0L7QutC4INC40LcgRE9NXHJcbiAgICAgICAgd2hpbGUgKGxpc3QubGFzdENoaWxkKSB7XHJcbiAgICAgICAgICBsaXN0Lmxhc3RDaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g0L/QtdGA0LXRgNC40YHQvtCy0LrQsCDQvtCx0L3QvtCy0LvQtdC90L3QvtCz0L4g0YHQv9C40YHQutCwINC60L7QvdGC0LDQutGC0L7QslxyXG4gICAgICAgIHJlbmRlckNvbnRhY3RzKGxpc3QsIHNvcnREYXRhKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaG92ZXJSb3coYWxsUm93LCBsb2dvKTsgLy8g0L3QsNCy0LXRiNC40LLQsNC10Lwg0YHQu9GD0YjQsNGC0LXQu9C10LkgaG92ZXIg0L/RgNC4INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4XHJcbiAgICAvLyDQvdCw0LLQtdGI0LjQstCw0YLRjCDRgdC70YPRiNCw0YLQtdC70LXQuSDQtdGJ0LUg0Lgg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC90L7QstC+0LPQviDRgNGP0LTQsFxyXG4gICAgY29uc3Qge2Nsb3NlTW9kYWx9ID0gbW9kYWxDb250cm9sKHtcclxuICAgICAgZm9ybU92ZXJsYXksXHJcbiAgICAgIGJ0bkFkZCxcclxuICAgICAgY2xvc2VCdG4sXHJcbiAgICAgIG9iakV2ZW50OiBvYmpFdmVudEJ0bnMsXHJcbiAgICB9KTtcclxuICAgIGRlbGV0ZUNvbnRyb2woe2RhdGEsIGJ0bkRlbCwgbGlzdCwgb2JqRXZlbnQ6IG9iakV2ZW50QnRuc30pO1xyXG4gICAgZm9ybUNvbnRyb2woe2Zvcm0sIGxpc3QsIGNsb3NlTW9kYWx9KTtcclxuICB9O1xyXG5cclxuXHJcbiAgd2luZG93LnBob25lYm9va0luaXQgPSBpbml0O1xyXG59XHJcbiJdfQ==
