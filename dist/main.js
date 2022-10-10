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
        // // удаляем строки из DOM
        // while (list.lastChild) {
        //   list.lastChild.remove();
        // }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVqcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvY29udHJvbC5qcyIsInBob25lYm9vay9qcy9tb2R1bGVzL2NyZWF0ZUVsZW1lbnQuanMiLCJwaG9uZWJvb2svanMvbW9kdWxlcy9oYXNoLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvcmVuZGVyLmpzIiwicGhvbmVib29rL2pzL21vZHVsZXMvc2VydmljZVN0b3JhZ2UuanMiLCJwaG9uZWJvb2svanMvbW9kdWxlcy9zb3J0LmpzIiwicGhvbmVib29rL2pzL3NjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qge1xyXG4gIC8vIGNyZWF0ZUNvbnRhaW5lcixcclxuICAvLyBjcmVhdGVIZWFkZXIsXHJcbiAgLy8gY3JlYXRlTG9nbyxcclxuICAvLyBjcmVhdGVNYWluLFxyXG4gIC8vIGNyZWF0ZUJ1dHRvbkdyb3VwLFxyXG4gIC8vIGNyZWF0ZVRhYmxlLFxyXG4gIC8vIGNyZWF0ZUZvcm0sXHJcbiAgLy8gY3JlYXRlRm9vdGVyLFxyXG4gIGNyZWF0ZVJvdyxcclxufSA9IHJlcXVpcmUoJy4vY3JlYXRlRWxlbWVudCcpO1xyXG5cclxuLy8gbGV0IHtkYXRhfSA9IHJlcXVpcmUoJy4vc2VydmljZVN0b3JhZ2UnKTtcclxuLy8gY29uc3Qge2RhdGF9ID0gcmVxdWlyZSgnLi9zZXJ2aWNlU3RvcmFnZScpO1xyXG5cclxuY29uc3Qge1xyXG4gIEtFWSxcclxuICAvLyBnZXRTdG9yYWdlLFxyXG4gIHNldFN0b3JhZ2UsXHJcbiAgLy8gbWFrZURhdGFDb250YWN0c0hhc2hlcyxcclxuICByZW1vdmVTdG9yYWdlLFxyXG59ID0gcmVxdWlyZSgnLi9zZXJ2aWNlU3RvcmFnZScpO1xyXG5cclxuY29uc3Qge1xyXG4gIHJlbmRlckNvbnRhY3RzLFxyXG59ID0gcmVxdWlyZSgnLi9yZW5kZXInKTtcclxuXHJcbi8vINC00L7QsdCw0LLQu9GP0LXQvCDQvdCwINC60LDQttC00YvQuSDRgNGP0LQg0YHQu9GD0YjQsNGC0LXQu9C10LlcclxuY29uc3QgaG92ZXJSb3cgPSAoYWxsUm93LCBsb2dvKSA9PiB7XHJcbiAgY29uc3QgdGV4dCA9IGxvZ28udGV4dENvbnRlbnQ7XHJcbiAgYWxsUm93LmZvckVhY2goY29udGFjdCA9PiB7XHJcbiAgICBjb250YWN0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XHJcbiAgICAgIGxvZ28udGV4dENvbnRlbnQgPSBjb250YWN0LnBob25lTGluaz8udGV4dENvbnRlbnQ7XHJcbiAgICB9KTtcclxuICAgIGNvbnRhY3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcclxuICAgICAgbG9nby50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm47XHJcbn07XHJcblxyXG4vLyDRhNGD0L3QutGG0LjQvtC90LDQuyDRgNCw0LHQvtGC0Ysg0YEg0LzQvtC00LDQu9GM0L3QvtC5INGE0L7RgNC80L7QuVxyXG5jb25zdCBtb2RhbENvbnRyb2wgPSAoe2J0bkFkZCwgZm9ybU92ZXJsYXksIGNsb3NlQnRuLCBvYmpFdmVudH0pID0+IHtcclxuICAvLyDQvtGC0LrRgNGL0YLRjCDQvNC+0LTQsNC70LrRg1xyXG4gIGNvbnN0IG9wZW5Nb2RhbCA9ICgpID0+IHtcclxuICAgIGZvcm1PdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXZpc2libGUnKTtcclxuICB9O1xyXG5cclxuICAvLyDQt9Cw0LrRgNGL0YLRjCDQvNC+0LTQsNC70LrRg1xyXG4gIGNvbnN0IGNsb3NlTW9kYWwgPSAoKSA9PiB7XHJcbiAgICBmb3JtT3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XHJcbiAgfTtcclxuXHJcbiAgLy8g0LrQvdC+0L/QutCwINCU0L7QsdCw0LLQuNGC0Ywg0L7RgtC60YDRi9Cy0LDQtdGCINC80L7QtNCw0LvQutGDXHJcbiAgYnRuQWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb2JqRXZlbnQpO1xyXG4gIC8vIGJ0bkFkZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5Nb2RhbCk7XHJcblxyXG4gIGZvcm1PdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgIC8vINC+0YLRgNCw0LHQsNGC0YvQstCw0LXQvCDQutC70LjQuiDQv9C+INC60L3QvtC60L/QtSBDTE9TRSDQuCDQv9C+INC+0LLQtdGA0LvQtdGOXHJcbiAgICBpZiAodGFyZ2V0ID09PSBjbG9zZUJ0biB8fFxyXG4gICAgICAgIHRhcmdldCA9PT0gZm9ybU92ZXJsYXkpIHtcclxuICAgICAgY2xvc2VNb2RhbCgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgb3Blbk1vZGFsLFxyXG4gICAgY2xvc2VNb2RhbCxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgZGVsZXRlQ29udHJvbCA9ICh7ZGF0YSwgYnRuRGVsLCBsaXN0LCBvYmpFdmVudH0pID0+IHtcclxuICAvLyBoYW5kbGVFdmVudCBvYmog0LrQu9C40LrQuCDQv9C+INC60L3QvtC/0LrQsNC8INCU0L7QsdCw0LLQuNGC0Ywg0Lgg0KPQtNCw0LvQuNGC0YxcclxuICBidG5EZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvYmpFdmVudCk7XHJcblxyXG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAvLyDQutC70LjQuiDQv9C+INC60LvQtdGC0LrQtSBkZWxcclxuICAgIGlmICh0YXJnZXQuY2xvc2VzdCgnLmRlbC1pY29uJykpIHtcclxuICAgICAgLy8g0YDRj9C0INC/0L4g0LrQvtGC0L7RgNC+0LzRgyDQutC70LjQutC90YPQu9C4XHJcbiAgICAgIGNvbnN0IHRhcmdldFJvdyA9IHRhcmdldC5jbG9zZXN0KCcuY29udGFjdCcpO1xyXG4gICAgICAvLyBpZCDQutC+0L3RgtCw0LrRgtCwINC40Lcg0YDRj9C00LBcclxuICAgICAgY29uc3QgZGF0YUlEID0gdGFyZ2V0Um93LmlkO1xyXG4gICAgICAvLyBkZXRlbGVEYXRhQ29udGFjdChkYXRhSUQpO1xyXG4gICAgICBkYXRhID0gcmVtb3ZlU3RvcmFnZShLRVksIGRhdGFJRCk7IC8vINGD0LTQsNC70Y/QtdC8INC40Lcg0YXRgNCw0L3QuNC70LjRidCwXHJcbiAgICAgIC8vIHRhcmdldFJvdy5yZW1vdmUoKTsgLy8g0YPQtNCw0LvRj9C10Lwg0YHRgtGA0L7QutGDINC40LcgRE9NXHJcbiAgICAgIC8vINCy0YvQstC+0LTQuNC8INCyINC60L7QvdGB0L7Qu9GMINGC0L4g0YfRgtC+INGDINC90LDRgSDQstGL0YjQu9C+XHJcbiAgICAgIGNvbnNvbGUubG9nKCdkZWwgcm93IGZyb20gZGF0YTogJywgZGF0YSk7XHJcblxyXG4gICAgICAvLyB0b2RvINGB0LrRgNGL0LLQsNC10LwgLmRlbGV0ZSDQsiDQt9Cw0LPQvtC70L7QstC60LUg0YLQsNCx0LvQuNGG0YtcclxuICAgICAgaWYgKG9iakV2ZW50LmlzU2hvd24pIHtcclxuICAgICAgICBjb25zdCBoZWFkID0gbGlzdC5wYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgIGhlYWQucXVlcnlTZWxlY3RvcignLmRlbGV0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICAgICAgICBvYmpFdmVudC5pc1Nob3duID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHRvZG9vbyBtb3ZlIHRvIHJlbmRlckNvbnRhY3RzXHJcbiAgICAgIC8vIC8vINGD0LTQsNC70Y/QtdC8INGB0YLRgNC+0LrQuCDQuNC3IERPTVxyXG4gICAgICAvLyB3aGlsZSAobGlzdC5sYXN0Q2hpbGQpIHtcclxuICAgICAgLy8gICBsaXN0Lmxhc3RDaGlsZC5yZW1vdmUoKTtcclxuICAgICAgLy8gfVxyXG4gICAgICAvLyDQv9C10YDQtdGA0LjRgdC+0LLQutCwINC+0LHQvdC+0LLQu9C10L3QvdC+0LPQviDRgdC/0LjRgdC60LAg0LrQvtC90YLQsNC60YLQvtCyXHJcbiAgICAgIHJlbmRlckNvbnRhY3RzKGxpc3QsIGRhdGEpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vLyDQtNC+0LHQsNCy0LvRj9C10Lwg0L3QvtCy0YPRjiDRgdGC0YDQvtC60YMg0YEg0LrQvtC90YLQsNC60YLQvtC8INCyINGC0LXQu9C+INGC0LDQsdC70LjRhtGLIHRhYmxlLnRib2R5XHJcbmNvbnN0IGFkZENvbnRhY3RQYWdlID0gKGNvbnRhY3QsIGxpc3QpID0+IHtcclxuICBsaXN0LmFwcGVuZChjcmVhdGVSb3coY29udGFjdCkpO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybUNvbnRyb2wgPSAoe2Zvcm0sIGxpc3QsIGNsb3NlTW9kYWx9KSA9PiB7XHJcbiAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZS50YXJnZXQpOyAvLyDQtNCw0L3QvdGL0LUg0LjQtyDRhNC+0YDQvNGLXHJcbiAgICAvLyDRhNC+0YDQvNC40YDRg9C10Lwg0L7QsdGK0LXQutGCINC60L7QvdGC0LDQutGCINC40Lcg0LfQvdCw0YfQtdC90LjQuSDQv9C+0LvQtdC5INGE0L7RgNC80YtcclxuICAgIGNvbnN0IG5ld0NvbnRhY3QgPSBPYmplY3QuZnJvbUVudHJpZXMoZm9ybURhdGEpO1xyXG4gICAgLy8g0LfQsNC/0LjRgdGL0LLQsNC10Lwg0LIg0LvQvtC60LDQu9GM0L3QvtC1INGF0YDQsNC90LjQu9C40YnQtVxyXG4gICAgc2V0U3RvcmFnZShLRVksIG5ld0NvbnRhY3QpO1xyXG4gICAgLy8g0LTQvtCx0LDQstC70Y/QtdC8INCyIERPTSDQvdCwINGB0YLRgNCw0L3QuNGG0YNcclxuICAgIGFkZENvbnRhY3RQYWdlKG5ld0NvbnRhY3QsIGxpc3QpO1xyXG4gICAgLy8gdG9kbyBtYWtlIGl0INGB0YDQsNC30YMg0L/QvtGB0LvQtSDQtNC+0LHQsNCy0LvQtdC90LjRjyDQutC+0L3RgtCw0LrRgtCwXHJcbiAgICAvLyB0b2RvINGB0L7RgNGC0LjRgNC+0LLQsNGC0Ywg0L/QtdGA0LXRgNC10L3QtNC10YDQuNGC0Ywg0YHQv9C40YHQvtC6XHJcbiAgICAvLyByZW5kZXJDb250YWN0cyguLi4pXHJcbiAgICBmb3JtLnJlc2V0KCk7XHJcbiAgICBjbG9zZU1vZGFsKCk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgaG92ZXJSb3csXHJcbiAgbW9kYWxDb250cm9sLFxyXG4gIGRlbGV0ZUNvbnRyb2wsXHJcbiAgZm9ybUNvbnRyb2wsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5jb25zdCBjcmVhdGVDb250YWluZXIgPSAoKSA9PiB7XHJcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicpO1xyXG4gIHJldHVybiBjb250YWluZXI7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVIZWFkZXIgPSAoKSA9PiB7XHJcbiAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaGVhZGVyJyk7XHJcbiAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcicpO1xyXG4gIGNvbnN0IGhlYWRlckNvbnRhaW5lciA9IGNyZWF0ZUNvbnRhaW5lcigpO1xyXG4gIGhlYWRlci5hcHBlbmQoaGVhZGVyQ29udGFpbmVyKTtcclxuICBoZWFkZXIuaGVhZGVyQ29udGFpbmVyID0gaGVhZGVyQ29udGFpbmVyO1xyXG4gIHJldHVybiBoZWFkZXI7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVMb2dvID0gdGl0bGUgPT4ge1xyXG4gIGNvbnN0IGgxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcclxuICBoMS5jbGFzc0xpc3QuYWRkKCdsb2dvJyk7XHJcbiAgaDEudGV4dENvbnRlbnQgPSBg0KLQtdC70LXRhNC+0L3QvdGL0Lkg0YHQv9GA0LDQstC+0YfQvdC40LouICR7dGl0bGV9YDtcclxuICByZXR1cm4gaDE7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVNYWluID0gKCkgPT4ge1xyXG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtYWluJyk7XHJcbiAgY29uc3QgbWFpbkNvbnRhaW5lciA9IGNyZWF0ZUNvbnRhaW5lcigpO1xyXG4gIG1haW4uYXBwZW5kKG1haW5Db250YWluZXIpO1xyXG4gIG1haW4ubWFpbkNvbnRhaW5lciA9IG1haW5Db250YWluZXI7XHJcbiAgcmV0dXJuIG1haW47XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVCdXR0b25Hcm91cCA9IHBhcmFtcyA9PiB7XHJcbiAgY29uc3QgYnRuV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGJ0bldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYnRuLXdyYXBwZXInKTtcclxuXHJcbiAgY29uc3QgYnRucyA9IHBhcmFtcy5tYXAoKHtjbGFzc05hbWUsIHR5cGUsIHRleHQsIHRpdGxlfSkgPT4ge1xyXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICBidXR0b24udHlwZSA9IHR5cGU7XHJcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcclxuICAgIGJ1dHRvbi50aXRsZSA9IHRpdGxlID8gdGl0bGUgOiAnJztcclxuICAgIHJldHVybiBidXR0b247XHJcbiAgfSk7XHJcblxyXG4gIGJ0bldyYXBwZXIuYXBwZW5kKC4uLmJ0bnMpO1xyXG4gIHJldHVybiB7XHJcbiAgICBidG5XcmFwcGVyLFxyXG4gICAgYnRucyxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlVGFibGUgPSAoZGF0YSkgPT4ge1xyXG4gIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcclxuICB0YWJsZS5jbGFzc0xpc3QuYWRkKCd0YWJsZScsICd0YWJsZS1zdHJpcGVkJyk7XHJcbiAgLy8g0LPQtdC90LXRgNC40Lwg0LfQsNCz0L7Qu9C+0LLQvtC6INGC0LDQsdC70LjRhtGLXHJcbiAgY29uc3QgdGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0aGVhZCcpO1xyXG4gIC8qXHJcbiAgdGhlYWQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgXHJcbiAgICA8dHI+XHJcbiAgICAgIDx0aCBjbGFzcz1cImRlbGV0ZVwiPtCj0LTQsNC70LjRgtGMPC90aD5cclxuICAgICAgPHRoPtCY0LzRjzwvdGg+XHJcbiAgICAgIDx0aD7QpNCw0LzQuNC70LjRjzwvdGg+XHJcbiAgICAgIDx0aD7QotC10LvQtdGE0L7QvTwvdGg+XHJcbiAgICA8L3RyPlxyXG4gIGApO1xyXG4gICovXHJcbiAgdGhlYWQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgXHJcbiAgICA8dHIgY2xhc3M9XCJ0YWJsZV9fcm93X2hlYWRcIj5cclxuICAgICAgPHRoIGNsYXNzPVwiZGVsZXRlXCI+0KPQtNCw0LvQuNGC0Yw8L3RoPlxyXG4gICAgICA8dGggY2xhc3M9XCJ0YWJsZV9fY2VsbF9oZWFkIGJ5LW5hbWVcIlxyXG4gICAgICAgICAgICBkYXRhLXNvcnRieT1cImJ5LW5hbWVcIlxyXG4gICAgICAgICAgICBkYXRhLXNvcnRvcmRlcj1cIlwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwi0KHQvtGA0YLQuNGA0L7QstCw0YLRjCDQv9C+INCY0LzQtdC90LhcIj7QmNC80Y88L3RoPlxyXG4gICAgICAgICAgICA8dGggY2xhc3M9XCJ0YWJsZV9fY2VsbF9oZWFkIGJ5LXN1cm5hbWVcIlxyXG4gICAgICAgICAgICBkYXRhLXNvcnRieT1cImJ5LXN1cm5hbWVcIlxyXG4gICAgICAgICAgICBkYXRhLXNvcnRvcmRlcj1cIlwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwi0KHQvtGA0YLQuNGA0L7QstCw0YLRjCDQv9C+INCk0LDQvNC40LvQuNC4XCI+0KTQsNC80LjQu9C40Y88L3RoPlxyXG4gICAgICAgICAgICA8dGggY2xhc3M9XCJ0YWJsZV9fY2VsbF9oZWFkIGJ5LXBob25lXCJcclxuICAgICAgICAgICAgZGF0YS1zb3J0Ynk9XCJieS1waG9uZVwiXHJcbiAgICAgICAgICAgIGRhdGEtc29ydG9yZGVyPVwiXCJcclxuICAgICAgICAgICAgdGl0bGU9XCLQodC+0YDRgtC40YDQvtCy0LDRgtGMINC/0L4g0L3QvtC80LXRgNGDINGC0LXQu9C10YTQvtC90LBcIj7QotC10LvQtdGE0L7QvTwvdGg+XHJcbiAgICA8L3RyPlxyXG4gIGApO1xyXG5cclxuICAvLyDQs9C10L3QtdGA0LjQvCDQuCDQstC+0LfRgNCw0YnQsNC10Lwg0YHRgdGL0LvQutGDINC90LAg0YLQtdC70L4g0YLQsNCx0LvQuNGG0YtcclxuICBjb25zdCB0Ym9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5Jyk7XHJcbiAgdGFibGUuYXBwZW5kKHRoZWFkLCB0Ym9keSk7XHJcbiAgdGFibGUudGhlYWQgPSB0aGVhZDtcclxuICB0YWJsZS50Ym9keSA9IHRib2R5O1xyXG4gIHJldHVybiB0YWJsZTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZUZvcm0gPSAoKSA9PiB7XHJcbiAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIG92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnZm9ybS1vdmVybGF5Jyk7XHJcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcclxuICBmb3JtLmNsYXNzTGlzdC5hZGQoJ2Zvcm0nKTtcclxuICBmb3JtLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGBcclxuICAgIDxoMiBjbGFzcz1cImZvcm0tdGl0bGVcIj7QlNC+0LHQsNCy0LjRgtGMINCa0L7QvdGC0LDQutGCPC9oMj5cclxuICBgKTtcclxuICBjb25zdCBjbG9zZUJ0biA9IGNyZWF0ZUJ1dHRvbkdyb3VwKFtcclxuICAgIHtcclxuICAgICAgY2xhc3NOYW1lOiAnY2xvc2UnLFxyXG4gICAgICB0eXBlOiAnYnV0dG9uJyxcclxuICAgICAgdGl0bGU6ICfQl9Cw0LrRgNGL0YLRjCDRhNC+0YDQvNGDJyxcclxuICAgIH0sXHJcbiAgXSkuYnRuc1swXTtcclxuICBmb3JtLnByZXBlbmQoY2xvc2VCdG4pO1xyXG4gIC8vINGB0LDQvNCwINGE0L7RgNC80LAg0LIg0LzQvtC00LDQu9GM0L3QvtC8INC+0LrQvdC1XHJcbiAgZm9ybS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGBcclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFibGUgY29sLTEyXCIgZm9yPVwibmFtZVwiPtCY0LzRjzwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0taW5wdXQgY29sLTEyIGZvcm0tY29udHJvbFwiIG5hbWU9XCJuYW1lXCJcclxuICAgICAgICAgIGlkPVwibmFtZVwiIHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFibGUgY29sLTEyXCIgZm9yPVwic3VybmFtZVwiPtCk0LDQvNC40LvQuNGPPC9sYWJlbD5cclxuICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1pbnB1dCBjb2wtMTAgZm9ybS1jb250cm9sXCIgbmFtZT1cInN1cm5hbWVcIlxyXG4gICAgICAgICAgaWQ9XCJzdXJuYW1lXCIgdHlwZT1cInRleHRcIiByZXF1aXJlZD5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJsZSBjb2wtMTJcIiBmb3I9XCJwaG9uZVwiPtCi0LXQu9C10YTQvtC9PC9sYWJlbD5cclxuICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1pbnB1dCBjb2wtOCBmb3JtLWNvbnRyb2xcIiBuYW1lPVwicGhvbmVcIlxyXG4gICAgICAgICAgaWQ9XCJwaG9uZVwiIHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgIDxsYWJlbCBjbGFzcz1cImNvbC0xMlwiPjwvbGFiZWw+XHJcbiAgICA8L2Rpdj5cclxuICBgKTtcclxuICBjb25zdCBidXR0b25Hcm91cCA9IGNyZWF0ZUJ1dHRvbkdyb3VwKFtcclxuICAgIHtcclxuICAgICAgY2xhc3NOYW1lOiAnYnRuIGJ0bi1wcmltYXJ5IG1yLTMnLFxyXG4gICAgICB0eXBlOiAnc3VibWl0JyxcclxuICAgICAgdGV4dDogJ9CU0L7QsdCw0LLQuNGC0YwnLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgY2xhc3NOYW1lOiAnYnRuIGJ0bi1kYW5nZXInLFxyXG4gICAgICB0eXBlOiAncmVzZXQnLFxyXG4gICAgICB0ZXh0OiAn0J7RgtC80LXQvdCwJyxcclxuICAgIH0sXHJcbiAgXSk7XHJcbiAgZm9ybS5hcHBlbmQoYnV0dG9uR3JvdXAuYnRuV3JhcHBlcik7XHJcbiAgb3ZlcmxheS5hcHBlbmQoZm9ybSk7XHJcbiAgcmV0dXJuIHtcclxuICAgIG92ZXJsYXksXHJcbiAgICBmb3JtLFxyXG4gICAgY2xvc2VCdG4sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZUZvb3RlciA9ICgpID0+IHtcclxuICBjb25zdCBmb290ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb290ZXInKTtcclxuICBmb290ZXIuY2xhc3NMaXN0LmFkZCgnZm9vdGVyJyk7XHJcbiAgY29uc3QgZm9vdGVyQ29udGFpbmVyID0gY3JlYXRlQ29udGFpbmVyKCk7XHJcbiAgZm9vdGVyLmFwcGVuZChmb290ZXJDb250YWluZXIpO1xyXG4gIGZvb3Rlci5mb290ZXJDb250YWluZXIgPSBmb290ZXJDb250YWluZXI7XHJcbiAgZm9vdGVyQ29udGFpbmVyLnRleHRDb250ZW50ID0gJ9Ck0YPRgtC10YAg0LrQvtC/0LjRgNCw0LnRgic7XHJcbiAgcmV0dXJuIGZvb3RlcjtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZVJvdyA9ICh7bmFtZTogZmlyc3RuYW1lLCBzdXJuYW1lLCBwaG9uZSwgaWR9KSA9PiB7XHJcbiAgY29uc3QgdHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xyXG4gIC8vINC/0YDQvtCy0LXRgNC60LAg0L3QsCB1bmRlZmluZWQg0L3QsCDRgdGD0YnQtdGB0YLQstC+0LLQsNC90LjQtSDQv9C+0LvRj1xyXG4gIHRyLmlkID0gaWQ7IC8vID8g0L3Rg9C20L3QsCDQu9C4INC/0YDQvtCy0LXRgNC60LAgP1xyXG4gIHRyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhY3QnKTtcclxuICB0ci50aXRsZSA9IGDQmtC+0L3RgtCw0LrRgiAke3N1cm5hbWV9ICR7Zmlyc3RuYW1lfWA7XHJcblxyXG4gIGNvbnN0IHRkRGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICB0ZERlbC5jbGFzc0xpc3QuYWRkKCdkZWxldGUnKTtcclxuICBjb25zdCBidXR0b25EZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICBidXR0b25EZWwuY2xhc3NMaXN0LmFkZCgnZGVsLWljb24nKTtcclxuICB0ZERlbC5hcHBlbmQoYnV0dG9uRGVsKTtcclxuXHJcbiAgY29uc3QgdGROYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICB0ZE5hbWUudGV4dENvbnRlbnQgPSBmaXJzdG5hbWU7XHJcblxyXG4gIGNvbnN0IHRkU3VybmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgdGRTdXJuYW1lLnRleHRDb250ZW50ID0gc3VybmFtZTtcclxuXHJcbiAgY29uc3QgdGRQaG9uZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgY29uc3QgcGhvbmVMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gIHBob25lTGluay5ocmVmID0gJ3RlbDonICsgcGhvbmU7XHJcbiAgcGhvbmVMaW5rLnRleHRDb250ZW50ID0gcGhvbmU7XHJcbiAgdHIucGhvbmVMaW5rID0gcGhvbmVMaW5rO1xyXG4gIHRkUGhvbmUuYXBwZW5kKHBob25lTGluayk7XHJcblxyXG4gIHRyLmFwcGVuZCh0ZERlbCwgdGROYW1lLCB0ZFN1cm5hbWUsIHRkUGhvbmUpO1xyXG4gIHJldHVybiB0cjtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAvLyBjcmVhdGVDb250YWluZXIsXHJcbiAgY3JlYXRlSGVhZGVyLFxyXG4gIGNyZWF0ZUxvZ28sXHJcbiAgY3JlYXRlTWFpbixcclxuICBjcmVhdGVCdXR0b25Hcm91cCxcclxuICBjcmVhdGVUYWJsZSxcclxuICBjcmVhdGVGb3JtLFxyXG4gIGNyZWF0ZUZvb3RlcixcclxuICBjcmVhdGVSb3csXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vICoganMgbW9kdWxlIHVzaW5nIENKUyBmb3IgaGFzaFxyXG4vLyAg0LLQvtC30LLRgNCw0YnQsNC10YIgaGFzaENvZGUg0L/QviDRgdGC0YDQvtC60LUgc3RyXHJcbmNvbnN0IGhhc2hDb2RlID0gKHN0cikgPT4ge1xyXG4gIGxldCBoYXNoID0gMDtcclxuICBmb3IgKGxldCBpID0gMCwgbGVuID0gc3RyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICBjb25zdCBjaHIgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgIGhhc2ggPSAoaGFzaCA8PCA1KSAtIGhhc2ggKyBjaHI7XHJcbiAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxyXG4gIH1cclxuICByZXR1cm4gTWF0aC5hYnMoaGFzaCk7XHJcbn07XHJcblxyXG4vLyDQstC+0LfQstGA0LDRidCw0LXRgiDRgdCz0LXQvdC10YDQuNGA0L7QstCw0L3Ri9C5IGhhc2ggaWQg0LTQu9GPINC60L7QvdGC0LDQutGC0LBcclxuLy8g0YPRh9C40YLRi9Cy0LDRjyDQuNC80Y8g0L/QvtC70Y8gaWRcclxuY29uc3QgZ2V0Q29udGFjdEhhc2ggPSAoY29udGFjdCA9IHt9KSA9PiB7XHJcbiAgY29uc3QgaGFzaElEID0gT2JqZWN0LmVudHJpZXMoY29udGFjdClcclxuICAgICAgLnJlZHVjZSgoYWNjdW0sIGN1cnIsIGluZGV4LCBhcnIpID0+IHtcclxuICAgICAgICBjb25zdCBjdXJyTmFtZSA9IGN1cnJbMF07XHJcbiAgICAgICAgY29uc3QgY3VyclZhbCA9IGN1cnJbMV07XHJcbiAgICAgICAgaWYgKGN1cnJOYW1lID09PSAnaWQnKSB7XHJcbiAgICAgICAgICAvLyDQv9C+0LvQtSDRgSDQuNC80LXQvdC10LwgaWQg0L3QtSDRg9GH0LjRgtGL0LLQsNC10YLRgdGPIVxyXG4gICAgICAgICAgcmV0dXJuIGFjY3VtO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gYCR7YWNjdW19eCR7aGFzaENvZGUoY3VyclZhbCkudG9TdHJpbmcoMzIpfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICAnaWQnKTtcclxuICByZXR1cm4gaGFzaElEO1xyXG59O1xyXG5cclxuLy8gKiDRjdC60YHQv9C+0YDRgtC40YDRg9C10Lwg0LIg0YHQvtGB0YLQsNCy0LUg0LzQvtC00YPQu9GPXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGdldENvbnRhY3RIYXNoLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCB7XHJcbiAgY3JlYXRlSGVhZGVyLFxyXG4gIGNyZWF0ZUxvZ28sXHJcbiAgY3JlYXRlTWFpbixcclxuICBjcmVhdGVCdXR0b25Hcm91cCxcclxuICBjcmVhdGVUYWJsZSxcclxuICBjcmVhdGVGb3JtLFxyXG4gIGNyZWF0ZUZvb3RlcixcclxuICBjcmVhdGVSb3csXHJcbn0gPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKTtcclxuXHJcbmNvbnN0IHJlbmRlclBob25lYm9vayA9IChhcHAsIHRpdGxlKSA9PiB7XHJcbiAgY29uc3QgaGVhZGVyID0gY3JlYXRlSGVhZGVyKCk7XHJcbiAgY29uc3QgbG9nbyA9IGNyZWF0ZUxvZ28odGl0bGUpO1xyXG4gIGNvbnN0IG1haW4gPSBjcmVhdGVNYWluKCk7XHJcbiAgY29uc3QgYnV0dG9uR3JvdXAgPSBjcmVhdGVCdXR0b25Hcm91cChbXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tcHJpbWFyeSBtci0zJyxcclxuICAgICAgdHlwZTogJ2J1dHRvbicsXHJcbiAgICAgIHRleHQ6ICfQlNC+0LHQsNCy0LjRgtGMJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tZGFuZ2VyJyxcclxuICAgICAgdHlwZTogJ2J1dHRvbicsXHJcbiAgICAgIHRleHQ6ICfQo9C00LDQu9C40YLRjCcsXHJcbiAgICB9LFxyXG4gIF0pO1xyXG4gIGNvbnN0IHRhYmxlID0gY3JlYXRlVGFibGUoKTtcclxuICBjb25zdCB7Zm9ybSwgb3ZlcmxheSwgY2xvc2VCdG59ID0gY3JlYXRlRm9ybSgpO1xyXG4gIGNvbnN0IGZvb3RlciA9IGNyZWF0ZUZvb3RlcigpO1xyXG5cclxuICBoZWFkZXIuaGVhZGVyQ29udGFpbmVyLmFwcGVuZChsb2dvKTtcclxuICBtYWluLm1haW5Db250YWluZXIuYXBwZW5kKGJ1dHRvbkdyb3VwLmJ0bldyYXBwZXIsIHRhYmxlLCBvdmVybGF5KTtcclxuICBtYWluLmFwcGVuZChvdmVybGF5KTtcclxuICBmb290ZXIuZm9vdGVyQ29udGFpbmVyLmlubmVySFRNTCA9IGDQktGB0LUg0L/RgNCw0LLQsCDQt9Cw0YnQuNGJ0LXQvdGLICZjb3B5OyAke3RpdGxlfWA7XHJcbiAgYXBwLmFwcGVuZChoZWFkZXIsIG1haW4sIGZvb3Rlcik7XHJcbiAgcmV0dXJuIHtcclxuICAgIGxvZ28sXHJcbiAgICBoZWFkOiB0YWJsZS50aGVhZCxcclxuICAgIGxpc3Q6IHRhYmxlLnRib2R5LFxyXG4gICAgYnRuQWRkOiBidXR0b25Hcm91cC5idG5zWzBdLFxyXG4gICAgYnRuRGVsOiBidXR0b25Hcm91cC5idG5zWzFdLFxyXG4gICAgY2xvc2VCdG4sXHJcbiAgICBmb3JtT3ZlcmxheTogb3ZlcmxheSxcclxuICAgIGZvcm0sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IHJlbmRlckNvbnRhY3RzID0gKGxpc3QsIGRhdGEpID0+IHtcclxuICAvLyDRg9C00LDQu9GP0LXQvCDRgdGC0YDQvtC60Lgg0LjQtyBET01cclxuICB3aGlsZSAobGlzdC5sYXN0Q2hpbGQpIHtcclxuICAgIGxpc3QubGFzdENoaWxkLnJlbW92ZSgpO1xyXG4gIH1cclxuICBpZiAoZGF0YSkge1xyXG4gICAgY29uc3QgYWxsUm93cyA9IGRhdGEubWFwKGNyZWF0ZVJvdyk7XHJcbiAgICBsaXN0LmFwcGVuZCguLi5hbGxSb3dzKTtcclxuICAgIHJldHVybiBhbGxSb3dzO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHJlbmRlclBob25lYm9vayxcclxuICByZW5kZXJDb250YWN0cyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gR0xPQkFMIEtFWVMgYW5kIERBVEFcclxubGV0IGRhdGEgPSBbXTtcclxuY29uc3QgS0VZID0gJ3Bob25lLXRlc3QnO1xyXG4vLyBjb25zdCBLRVkgPSAncGhvbmUtdGVzdDInO1xyXG4vLyBjb25zdCBTT1JUX0tFWSA9ICdwaG9uZS1zb3J0Myc7XHJcblxyXG5jb25zdCB7XHJcbiAgZ2V0Q29udGFjdEhhc2gsXHJcbn0gPSByZXF1aXJlKCcuL2hhc2gnKTtcclxuXHJcbi8vINGH0LjRgtCw0LXRgiDQuCDQstC+0LfQstGA0LDRidCw0LXRgiDQtNCw0L3QvdGL0LUgZGF0YSDQuNC3INCl0YDQsNC90LjQu9C40YnQsFxyXG5jb25zdCBnZXRTdG9yYWdlID0gKHN0b3JhZ2VLZXkpID0+IHtcclxuICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShLRVkpKTtcclxuICBpZiAoIUFycmF5LmlzQXJyYXkocmVzdWx0KSkge1xyXG4gICAgcmVzdWx0ID0gW107XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyDRh9C40YLQsNC10YIg0LTQsNC90L3Ri9C1INC40Lcg0YXRgNCw0L3QuNC70LjRidCwINC00L7QsdCw0LLQu9GP0LXRgiDQuiDQvdC40Lwg0LrQvtC90YLQsNC60YJcclxuY29uc3Qgc2V0U3RvcmFnZSA9IChzdG9yYWdlS2V5LCBjb250YWN0ID0ge30pID0+IHtcclxuICAvLyDRh9C40YLQsNC10Lwg0YLQtdC60YPRidC40LUg0LTQsNC90L3Ri9C1XHJcbiAgZGF0YSA9IGdldFN0b3JhZ2UoS0VZKTtcclxuICAvLyDQv9GA0L7QstC10YDRj9C10Lwg0L/Rg9GB0YLQvtC5INC70Lgg0Lgg0LzQsNGB0LjQsiDQu9C4INCy0L7QvtCx0YnQtVxyXG4gIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xyXG4gICAgZGF0YSA9IFtdO1xyXG4gIH1cclxuICAvLyDQv9GA0L7QstC10YDQutCwINC90LAg0LjQvNGPINC/0L7Qu9C10LkgbmFtZSwgc3VybmFtZSwgcGhvbmVcclxuICBpZiAoY29udGFjdC5uYW1lID09PSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnRhY3QubmFtZSA9ICcnO1xyXG4gIH1cclxuICBpZiAoY29udGFjdC5zdXJuYW1lID09PSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnRhY3Quc3VybmFtZSA9ICcnO1xyXG4gIH1cclxuICBpZiAoY29udGFjdC5waG9uZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb250YWN0LnBob25lID0gJyc7XHJcbiAgfVxyXG4gIC8vINC00LDQsdCw0LLQu9GP0LXQvCDRhdGN0YhcclxuICBpZiAoY29udGFjdC5pZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb250YWN0LmlkID0gZ2V0Q29udGFjdEhhc2goY29udGFjdCk7XHJcbiAgfVxyXG4gIC8vINC00LDQsdCw0LLQu9GP0LXQvCDQutC+0L3RgtCw0LrRgiDQsiBkYXRhXHJcbiAgZGF0YS5wdXNoKGNvbnRhY3QpO1xyXG4gIC8vINC4INGB0L3QvtCy0LAg0L/QtdGA0LXQt9Cw0LLQuNGB0YvQstCw0LXRgiDQtNCw0L3QvdGL0LUg0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgLy8g0L7QsdC90L7QstC70Y/QtdC8INC00LDQvdC90YvQtSDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzdG9yYWdlS2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn07XHJcblxyXG4vLyDRh9C40YLQsNC10Lwg0LTQsNC90L3Ri9C1INGD0LTQsNC70Y/QtdC8INC+0LHQvdC+0LLQu9GP0LXQvCDQuCDQv9C10YDQtdC30LDQv9C40YHRi9Cy0LDQtdC8XHJcbmNvbnN0IHJlbW92ZVN0b3JhZ2UgPSAoc3RvcmFnZUtleSwgaWQpID0+IHtcclxuICAvLyDRh9C40YLQsNC10Lwg0YLQtdC60YPRidC40LUg0LTQsNC90L3Ri9C1XHJcbiAgZGF0YSA9IGdldFN0b3JhZ2UoS0VZKTtcclxuICAvLyDRg9C00LDQu9GP0LXQvCDQuNC3INC80LDRgdGB0LjQstCwINC60L7QvdGC0LDQutGCINGBINGN0YLQuNC8IGlkXHJcbiAgZGF0YS5mb3JFYWNoKChjb250YWN0LCBpbmRleCwgYXJyKSA9PiB7XHJcbiAgICBpZiAoY29udGFjdC5pZCA9PT0gaWQpIHtcclxuICAgICAgZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIC8vINGB0L7RhdGA0LDQvdGP0LXQvCDQvtCx0YDQsNGC0L3QviDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzdG9yYWdlS2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgcmV0dXJuIGRhdGE7XHJcbn07XHJcblxyXG4vLyAg0LPQtdC90LXRgNC40YDRg9C10YIg0LTQvtCx0LDQstC70Y/QtdGCIC5pZCDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0LrQvtC90YLQsNC60YLQsCDQvtCx0YrQutGC0LAg0LIg0LzQsNGB0YHQuNCy0LUgZGF0YVxyXG4vLyDQtNC+0LHQsNCy0LvRj9C10YIg0YXRjdGI0Lgg0LIg0LzQsNGB0YHQuNCyINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC4INC/0LXRgNC10LfQsNC/0LjRgdGL0LLQsNC10YIg0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbmNvbnN0IG1ha2VEYXRhQ29udGFjdHNIYXNoZXMgPSAoZGF0YSkgPT4ge1xyXG4gIGxldCByZXN1bHQ7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICByZXN1bHQgPSBkYXRhLm1hcCgoY29udGFjdCwgaW5kZXgpID0+IHtcclxuICAgICAgY29udGFjdC5pZCA9IGdldENvbnRhY3RIYXNoKGNvbnRhY3QpO1xyXG4gICAgICByZXR1cm4gY29udGFjdDtcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXN1bHQgPSBbXTtcclxuICB9XHJcbiAgLy8g0YLQsNC60LbQtSDRgdC+0YXRgNCw0L3Rj9C10Lwg0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLCBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXHJcbi8vICogZXhwb3J0c1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBkYXRhLFxyXG4gIEtFWSxcclxuICBnZXRTdG9yYWdlLFxyXG4gIHNldFN0b3JhZ2UsXHJcbiAgcmVtb3ZlU3RvcmFnZSxcclxuICBtYWtlRGF0YUNvbnRhY3RzSGFzaGVzLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuLy8gKiBzb3J0RGF0YUJ5XHJcbmNvbnN0IHNvcnREYXRhQnkgPSAoc29ydGJ5ID0gJycsIHNvcnRvcmRlciA9ICcnLCBkYXRhKSA9PiB7XHJcbiAgbGV0IHNvcnRlZCA9IFtdO1xyXG4gIHN3aXRjaCAoc29ydGJ5KSB7XHJcbiAgICBjYXNlICdieS1uYW1lJzpcclxuICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QviDQuNC80LXQvdC4XHJcbiAgICAgIHNvcnRlZCA9IGRhdGEuc29ydCgocHJldiwgbmV4dCkgPT4ge1xyXG4gICAgICAgIC8vIGFzY2VuZGluZyBhLCBiLCBjLCAuLiB6IG9yZGVyXHJcbiAgICAgICAgbGV0IG5hbWVQcmV2ID0gcHJldj8ubmFtZTtcclxuICAgICAgICBsZXQgbmFtZU5leHQgPSBuZXh0Py5uYW1lO1xyXG4gICAgICAgIGlmIChzb3J0b3JkZXIgPT09ICdkZXNjZW5kaW5nJykge1xyXG4gICAgICAgICAgLy8gZGVzY2VuZGluZyB6LCB5LCB4LCAuLiBhIG9yZGVyXHJcbiAgICAgICAgICBuYW1lUHJldiA9IG5leHQ/Lm5hbWU7XHJcbiAgICAgICAgICBuYW1lTmV4dCA9IHByZXY/Lm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuYW1lUHJldiA+IG5hbWVOZXh0KSB7XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5hbWVQcmV2IDwgbmFtZU5leHQpIHtcclxuICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdieS1zdXJuYW1lJzpcclxuICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QviDRhNCw0LzQuNC70LjQuFxyXG4gICAgICBzb3J0ZWQgPSBkYXRhLnNvcnQoKHByZXYsIG5leHQpID0+IHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxyXG4gICAgICAgIGNvbnN0IHN1cm5hbWVQcmV2ID0gKHNvcnRvcmRlciA9PT0gJ2FzY2VuZGluZycpID8gcHJldi5zdXJuYW1lIDogbmV4dC5zdXJuYW1lO1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXHJcbiAgICAgICAgY29uc3Qgc3VybmFtZU5leHQgPSAoc29ydG9yZGVyID09PSAnYXNjZW5kaW5nJykgPyBuZXh0LnN1cm5hbWUgOiBwcmV2LnN1cm5hbWU7XHJcbiAgICAgICAgaWYgKHN1cm5hbWVQcmV2ID4gc3VybmFtZU5leHQpIHtcclxuICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3VybmFtZVByZXYgPCBzdXJuYW1lTmV4dCkge1xyXG4gICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2J5LXBob25lJzpcclxuICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QviDQvdC+0LzQtdGA0YMg0YLQtdC70LXRhNC+0L3QsFxyXG4gICAgICBzb3J0ZWQgPSBkYXRhLnNvcnQoKHByZXYsIG5leHQpID0+IHtcclxuICAgICAgICBsZXQgcHJldlBob25lID0gJyc7XHJcbiAgICAgICAgbGV0IG5leHRQaG9uZSA9ICcnO1xyXG4gICAgICAgIGlmIChzb3J0b3JkZXIgPT09ICdhc2NlbmRpbmcnKSB7XHJcbiAgICAgICAgICBwcmV2UGhvbmUgPSBwcmV2LnBob25lO1xyXG4gICAgICAgICAgbmV4dFBob25lID0gbmV4dC5waG9uZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcHJldlBob25lID0gbmV4dC5waG9uZTtcclxuICAgICAgICAgIG5leHRQaG9uZSA9IHByZXYucGhvbmU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwcmV2UGhvbmUgPiBuZXh0UGhvbmUpIHtcclxuICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocHJldlBob25lIDwgbmV4dFBob25lKSB7XHJcbiAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgY29uc29sZS5sb2coJ9C/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuICAvLyByZXR1cm4gZGF0YTtcclxuICByZXR1cm4gc29ydGVkO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgc29ydERhdGFCeSxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gLy8gR0xPQkFMIEtFWVMgYW5kIERBVEFcclxuLy8gbGV0IGRhdGEgPSBbXTtcclxuLy8gY29uc3QgS0VZID0gJ3Bob25lLXRlc3QyJztcclxuY29uc3QgU09SVF9LRVkgPSAncGhvbmUtc29ydDMnO1xyXG5cclxubGV0IHtkYXRhfSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9zZXJ2aWNlU3RvcmFnZScpO1xyXG5cclxue1xyXG4gIGNvbnNvbGUubG9nKCdkYXRhOiAnLCBkYXRhKTtcclxuICAvLyBsZXQgZGF0YSA9IFtdO1xyXG4gIGNvbnN0IHtcclxuICAgIEtFWSxcclxuICAgIGdldFN0b3JhZ2UsXHJcbiAgICAvLyBzZXRTdG9yYWdlLFxyXG4gICAgbWFrZURhdGFDb250YWN0c0hhc2hlcyxcclxuICAgIC8vIHJlbW92ZVN0b3JhZ2UsXHJcbiAgfSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9zZXJ2aWNlU3RvcmFnZScpO1xyXG5cclxuICBjb25zdCB7c29ydERhdGFCeX0gPSByZXF1aXJlKCcuL21vZHVsZXMvc29ydCcpO1xyXG5cclxuICBjb25zdCB7XHJcbiAgICBob3ZlclJvdyxcclxuICAgIG1vZGFsQ29udHJvbCxcclxuICAgIGRlbGV0ZUNvbnRyb2wsXHJcbiAgICBmb3JtQ29udHJvbCxcclxuICB9ID0gcmVxdWlyZSgnLi9tb2R1bGVzL2NvbnRyb2wnKTtcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgcmVuZGVyUGhvbmVib29rLFxyXG4gICAgcmVuZGVyQ29udGFjdHMsXHJcbiAgfSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9yZW5kZXInKTtcclxuXHJcblxyXG4gIC8vICogTUFJTiBJTklUICpcclxuICBjb25zdCBpbml0ID0gKHNlbGVjdG9yQXBwLCB0aXRsZSkgPT4ge1xyXG4gICAgY29uc3QgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvckFwcCk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ2JlZ2luIGRhdGE6ICcsIGRhdGEpO1xyXG4gICAgLy8g0YfQuNGC0LDQtdC8INC00LDQvdC90YvQtSDQutC+0L3RgtCw0LrRgtC+0LIg0LjQtyDQpdGA0LDQvdC40LvQuNGJ0LBcclxuICAgIGRhdGEgPSBnZXRTdG9yYWdlKEtFWSk7XHJcbiAgICBjb25zb2xlLmxvZygnZ2V0U3RvcmFnZSBkYXRhOiAnLCBkYXRhKTtcclxuICAgIC8vINC+0LHQvdC+0LLQu9GP0LXQvCDRhdGN0YjQuCBpZCDQutC+0L3RgtCw0LrRgtC+0LJcclxuICAgIGRhdGEgPSBtYWtlRGF0YUNvbnRhY3RzSGFzaGVzKGRhdGEpO1xyXG5cclxuICAgIC8vINC/0LXRgNC10L3QtdGB0YLQuCDQsiBtYWtlRGF0YUNvbnRhY3RzSGFzaGVzXHJcblxyXG4gICAgLy8g0YfQuNGC0LDQtdC8INC00LDQvdC90YvQtSDQviDRgdC+0YDRgtC40YDQvtCy0LrQtVxyXG4gICAgbGV0IHNvcnRJbmZvID0ge307XHJcbiAgICAvLyBsZXQgc29ydEluZm8gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNPUlRfS0VZKSk7IC8vIHRvZG9cclxuXHJcbiAgICBjb25zdCB7XHJcbiAgICAgIGhlYWQsIC8vIHRhYmxlIHRoZWFkXHJcbiAgICAgIGxpc3QsIC8vIHRhYmxlIHRib2R5XHJcbiAgICAgIGxvZ28sXHJcbiAgICAgIGJ0bkFkZCxcclxuICAgICAgYnRuRGVsLFxyXG4gICAgICBmb3JtT3ZlcmxheSxcclxuICAgICAgY2xvc2VCdG4sXHJcbiAgICAgIGZvcm0sXHJcbiAgICB9ID0gcmVuZGVyUGhvbmVib29rKGFwcCwgdGl0bGUpO1xyXG5cclxuICAgIC8vIG9iakV2ZW50INC+0LHRgNCw0LHQvtGC0YfQuNC6INGB0L7QsdGL0YLQuNC5INC60LvQuNC60L7QsiDQvdCwIGJ0bkFkZCDQuCBidG5EZWxcclxuICAgIGNvbnN0IG9iakV2ZW50QnRucyA9IHtcclxuICAgICAgaXNTaG93bjogZmFsc2UsIC8vINCyINC90LDRh9Cw0LvQtSDQt9Cw0LrRgNGL0YLRiyDQstGB0LUg0Y/Rh9C10LnQutC4INGBINC60L3QvtC/0LrQsNC80LggLmRlbGV0ZVxyXG4gICAgICBoYW5kbGVFdmVudChldmVudCkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICBjb25zdCBjZWxsRGVsZXRlQWxsID0gbGlzdC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kZWxldGUnKTtcclxuICAgICAgICAvLyDQv9GA0Lgg0L3QsNC20LDRgtC40Lgg0L3QsCDQutC90L7Qv9C60YMg0JTQvtCx0LDQstC40YLRjCBidG5BZGRcclxuICAgICAgICBpZiAodGFyZ2V0ID09PSBidG5BZGQpIHtcclxuICAgICAgICAvLyDQt9C00LXRgdGMINC00LXQu9Cw0LXQvCDQstC40LTQuNC80YvQvCDQvtCy0LXRgNC70LDQuSDQuCDQvNC+0LTQsNC70LrRg1xyXG4gICAgICAgICAgZm9ybU92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgICAgLy8g0LfQtNC10YHRjCDRgdC60YDRi9Cy0LDQtdC8INCy0YHQtSDQutC90L7Qv9C60LggLmRlbGV0ZVxyXG4gICAgICAgICAgLy8gY29uc3QgY2VsbERlbGV0ZUFsbCA9IHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5kZWxldGUnKTtcclxuICAgICAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xyXG4gICAgICAgICAgY2VsbERlbGV0ZUFsbC5mb3JFYWNoKGNlbGxEZWxldGUgPT4ge1xyXG4gICAgICAgICAgICBjZWxsRGVsZXRlLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L3QvtC/0LrRgyDQo9C00LDQu9C40YLRjCBidG5EZWxcclxuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldCA9PT0gYnRuRGVsKSB7XHJcbiAgICAgICAgLy8g0LfQtNC10YHRjCDQv9C+0LrQsNC30YvQstCw0LXQvCDQstGB0LUg0LrQvdC+0L/QutC4IC5kZWxldGVcclxuICAgICAgICAgIGlmICh0aGlzLmlzU2hvd24pIHtcclxuICAgICAgICAgIC8vINC10YHQu9C4INCy0LjQtNC40LzRi9C1INGC0L4g0YHQutGA0YvQstCw0LXQvFxyXG4gICAgICAgICAgICB0aGlzLmlzU2hvd24gPSBmYWxzZTtcclxuICAgICAgICAgICAgY2VsbERlbGV0ZUFsbC5mb3JFYWNoKGNlbGxEZWxldGUgPT4ge1xyXG4gICAgICAgICAgICAgIGNlbGxEZWxldGUuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyDQtdGB0LvQuCDQsdGL0LvQuCDRgdC60YDRi9GC0YvQtSDRgtC+INC/0L7QutCw0LfRi9Cy0LDQtdC8XHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG93biA9IHRydWU7XHJcbiAgICAgICAgICAgIGNlbGxEZWxldGVBbGwuZm9yRWFjaChjZWxsRGVsZXRlID0+IHtcclxuICAgICAgICAgICAgICBjZWxsRGVsZXRlLmNsYXNzTGlzdC5hZGQoJ2lzLXZpc2libGUnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQpNCj0J3QmtCm0JjQntCd0JDQmyDQl9CU0JXQodCsXHJcbiAgICAvLyB0b2RvIGluaXQgc29ydCBwYXJhbXM6IHNvcnRvcmRlciBzb3J0YnlcclxuICAgIGlmICghKHNvcnRJbmZvID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTT1JUX0tFWSkpKSkge1xyXG4gICAgICAvLyDQtdGB0LvQuCBzb3J0SW5mbyDQvdC10KIg0LIg0YXRgNCw0L3QuNC70LjRidC1XHJcbiAgICAgIC8vINC30LDQv9C+0LvQvdGP0LXQvCDQt9C90LDRh9C10L3QuNC10Lwg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICAgICAgc29ydEluZm8gPSB7XHJcbiAgICAgICAgc29ydGJ5OiAnYnktbmFtZScsXHJcbiAgICAgICAgc29ydG9yZGVyOiAnYXNjZW5kaW5nJyxcclxuICAgICAgfTtcclxuICAgICAgLy8g0YHQvtGF0YDQsNC90Y/QtdC8INCyINGF0YDQsNC90LjQu9C40YnQtVxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTT1JUX0tFWSwgSlNPTi5zdHJpbmdpZnkoc29ydEluZm8pKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vINC10YHQu9C4INGB0L7RhdGA0LDQvdC10L3QviDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcclxuICAgICAgY29uc29sZS5sb2coJ9C90LDRh9Cw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINCyINGF0YDQsNC90LjQu9C40YnQtSBzb3J0SW5mbzonLCBzb3J0SW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW5pdGlhbCByb3dzIHNvcnRpbmdcclxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgaGVhZC5maXJzdEVsZW1lbnRDaGlsZC5jaGlsZHJlbikge1xyXG4gICAgICAvLyAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2FzY2VuZGluZycpO1xyXG4gICAgICAvLyAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2NlbmRpbmcnKTtcclxuICAgICAgLy8gICBjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9ICcnO1xyXG4gICAgICBpZiAoY2hpbGQuZGF0YXNldC5zb3J0YnkgPT09IHNvcnRJbmZvLnNvcnRieSkge1xyXG4gICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoc29ydEluZm8uc29ydG9yZGVyKTtcclxuICAgICAgICBjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9IHNvcnRJbmZvLnNvcnRvcmRlcjsgLy8gZmxhZ1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YSA9IHNvcnREYXRhQnkoc29ydEluZm8uc29ydGJ5LCBzb3J0SW5mby5zb3J0b3JkZXIsIGRhdGEpO1xyXG4gICAgY29uc29sZS5sb2coJ2FmdGVyIHNvcnQgZGF0YTogJywgZGF0YSk7XHJcbiAgICAvLyAvLyDRgdC90LDRh9Cw0LvQsCDRg9C00LDQu9GP0LXQvCDQuNC3IERPTVxyXG4gICAgLy8gd2hpbGUgKGxpc3QubGFzdENoaWxkKSB7XHJcbiAgICAvLyAgIGxpc3QubGFzdENoaWxkLnJlbW92ZSgpO1xyXG4gICAgLy8gfVxyXG4gICAgLy8g0L/QvtGC0L7QvCDQv9C10YDQtdGA0LXQvdC00LXRgNC40LLQsNC10LxcclxuICAgIGNvbnN0IGFsbFJvdyA9IHJlbmRlckNvbnRhY3RzKGxpc3QsIGRhdGEpO1xyXG5cclxuICAgIGhlYWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAvLyBjbGljayDQv9C+INC60LvQtdGC0LrQsNC8INC30LDQs9C+0LvQvtCy0LrQsCDRgtCw0LHQu9C40YbRiyDQtNC70Y8g0YHQvtGA0YLQuNGA0L7QstC60LhcclxuICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhYmxlX19jZWxsX2hlYWQnKSkge1xyXG4gICAgICAgIC8vINC/0LXRgNC10LHQuNGA0LDQtdC8INCy0YHQtSDQtNC+0YfQtdGA0L3QuNC1INC60LvQtdGC0LrQuCDRgNGP0LTQsCDQt9Cw0LPQvtC70L7QstC60LAg0YLQsNCx0LvQuNGG0YtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGhlYWQuZmlyc3RFbGVtZW50Q2hpbGQuY2hpbGRyZW4pIHtcclxuICAgICAgICAgIGlmICh0YXJnZXQgPT09IGNoaWxkKSB7XHJcbiAgICAgICAgICAgIC8vINCf0KPQodCi0JDQryDQktCa0JvQkNCU0JrQkCBcIlwiXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9PT0gJycpIHtcclxuICAgICAgICAgICAgICBjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9ICdkZXNjZW5kaW5nJztcclxuICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKCdkZXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VtcHR5IHRvIGFzY2VuZGluZycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hpbGQuZGF0YXNldC5zb3J0b3JkZXIgPT09ICdhc2NlbmRpbmcnKSB7XHJcbiAgICAgICAgICAgICAgY2hpbGQuZGF0YXNldC5zb3J0b3JkZXIgPSAnZGVzY2VuZGluZyc7XHJcbiAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnYXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZCgnZGVzY2VuZGluZycpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhc2NlbmRpbmcgdG8gZGVzY2VuZGluZycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLmRhdGFzZXQuc29ydG9yZGVyID09PSAnZGVzY2VuZGluZycpIHtcclxuICAgICAgICAgICAgICBjaGlsZC5kYXRhc2V0LnNvcnRvcmRlciA9ICdhc2NlbmRpbmcnO1xyXG4gICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKCdhc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGVzY2VuZGluZyB0byBhc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnYXNjZW5kaW5nJyk7XHJcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2NlbmRpbmcnKTtcclxuICAgICAgICAgICAgY2hpbGQuZGF0YXNldC5zb3J0b3JkZXIgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNvcnRJbmZvLnNvcnRieSA9IHRhcmdldC5kYXRhc2V0Py5zb3J0Ynk7XHJcbiAgICAgICAgc29ydEluZm8uc29ydG9yZGVyID0gdGFyZ2V0LmRhdGFzZXQ/LnNvcnRvcmRlcjtcclxuICAgICAgICAvLyDQvtCx0L3QvtCy0LvRj9C10Lwg0LTQsNC90L3Ri9C1INC+INGB0L7RgNGC0LjRgNC+0LLQutC1INCyINGF0YDQsNC90LjQu9C40YnQtVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNPUlRfS0VZLCBKU09OLnN0cmluZ2lmeShzb3J0SW5mbykpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKG9iakV2ZW50QnRucy5pc1Nob3duKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZGVsZXRlINGB0LrRgNGL0LLQsNC10LwnKTtcclxuICAgICAgICAgIGhlYWQucXVlcnlTZWxlY3RvcignLmRlbGV0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICAgICAgICAgIG9iakV2ZW50QnRucy5pc1Nob3duID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vINC+0YHQutGC0LvRjNC90YvQtSDQsiDRgtCw0LHQu9C40YbQtSDQv9GA0L7RgdGC0L4g0L/QtdGA0LXRgNC10L3QtNC10YDRj9GC0YHRj1xyXG5cclxuICAgICAgICAvLyDRgdC+0YDRgtC40YDRg9C10LxcclxuICAgICAgICBjb25zdCBzb3J0RGF0YSA9IHNvcnREYXRhQnkoc29ydEluZm8uc29ydGJ5LCBzb3J0SW5mby5zb3J0b3JkZXIsIGRhdGEpO1xyXG4gICAgICAgIC8vIC8vINGD0LTQsNC70Y/QtdC8INGB0YLRgNC+0LrQuCDQuNC3IERPTVxyXG4gICAgICAgIC8vIHdoaWxlIChsaXN0Lmxhc3RDaGlsZCkge1xyXG4gICAgICAgIC8vICAgbGlzdC5sYXN0Q2hpbGQucmVtb3ZlKCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vINC/0LXRgNC10YDQuNGB0L7QstC60LAg0L7QsdC90L7QstC70LXQvdC90L7Qs9C+INGB0L/QuNGB0LrQsCDQutC+0L3RgtCw0LrRgtC+0LJcclxuICAgICAgICByZW5kZXJDb250YWN0cyhsaXN0LCBzb3J0RGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGhvdmVyUm93KGFsbFJvdywgbG9nbyk7IC8vINC90LDQstC10YjQuNCy0LDQtdC8INGB0LvRg9GI0LDRgtC10LvQtdC5IGhvdmVyINC/0YDQuCDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuFxyXG4gICAgLy8g0L3QsNCy0LXRiNC40LLQsNGC0Ywg0YHQu9GD0YjQsNGC0LXQu9C10Lkg0LXRidC1INC4INC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQvdC+0LLQvtCz0L4g0YDRj9C00LBcclxuICAgIGNvbnN0IHtjbG9zZU1vZGFsfSA9IG1vZGFsQ29udHJvbCh7XHJcbiAgICAgIGZvcm1PdmVybGF5LFxyXG4gICAgICBidG5BZGQsXHJcbiAgICAgIGNsb3NlQnRuLFxyXG4gICAgICBvYmpFdmVudDogb2JqRXZlbnRCdG5zLFxyXG4gICAgfSk7XHJcbiAgICBkZWxldGVDb250cm9sKHtkYXRhLCBidG5EZWwsIGxpc3QsIG9iakV2ZW50OiBvYmpFdmVudEJ0bnN9KTtcclxuICAgIGZvcm1Db250cm9sKHtmb3JtLCBsaXN0LCBjbG9zZU1vZGFsfSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIHdpbmRvdy5waG9uZWJvb2tJbml0ID0gaW5pdDtcclxufVxyXG4iXX0=
