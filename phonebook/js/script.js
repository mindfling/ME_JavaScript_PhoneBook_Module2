'use strict';

let data = [];
const KEY = 'phone-test3';
const SORT_KEY = 'phone-sort3';

{
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


  // ** РАБОТА С ХРАНИЛИЩЕМ БРАУЗЕРА **
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

  const renderContacts = (list, data) => {
    if (data) {
      const allRows = data.map(createRow);
      list.append(...allRows);
      return allRows;
    } else {
      return [];
    }
  };

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
  const addContactPage = (newContact, list) => {
    list.append(createRow(newContact));
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

      form.reset();
      closeModal();
    });
  };


  // * sortDataBy
  const sortDataBy = (sortby = '', sortorder = '') => {
    let sorted = [];
    switch (sortby) {
      case 'by-name':
        console.log('сортировка по имени');
        sorted = data.sort((prodA, prodB) => {
          const nameA = prodA.name;
          const nameB = prodB.name;
          if (nameA > nameB) {
            return 1;
          } else if (nameA < nameB) {
            return -1;
          } else {
            return 0;
          }
        });
        break;
      case 'by-surname':
        console.log('сортировка по фамилии');
        sorted = data.sort((prodPrev, prodNext) => {
          const paramPrev = prodPrev.surname;
          const paramNext = prodNext.surname;
          if (paramPrev > paramNext) {
            return 1;
          } else if (paramPrev < paramNext) {
            return -1;
          } else {
            return 0;
          }
        });
        break;
      case 'by-phone':
        console.log('сортировка по номеру телефона');
        sorted = data.sort((prodPrev, prodNext) => {
          const paramPrev = prodPrev.phone;
          const paramNext = prodNext.phone;
          if (paramPrev > paramNext) {
            return 1;
          } else if (paramPrev < paramNext) {
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


  // * MAIN INIT *
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    data = getStorage(KEY);
    makeDataContactsHashes(data);
    // сохраняем обратно в хранилище
    localStorage.setItem(KEY, JSON.stringify(data));
    // перенести в makeDataContactsHashes

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
        // const cellDeleteAll = table.querySelectorAll('.delete');

        // * при нажатии на кнопку Добавить btnAdd
        if (target === btnAdd) {
        // здесь делаем видимым оверлай и модалку
          formOverlay.classList.add('is-visible');

          // здесь скрываем все кнопки .delete
          // const cellDeleteAll = table.querySelectorAll('.delete');
          this.isShown = false;
          cellDeleteAll.forEach(cellDelete => {
            cellDelete.classList.remove('is-visible');
          });

        // * при нажатии на кнопку Удалить btnDel
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
    // let sortby = '';
    // let sortorder = '';
    let sortInfo = {};

    if (!(sortInfo = JSON.parse(localStorage.getItem(SORT_KEY)))) {
      // если sortInfo неТ в хранилище
      console.warn('если sortInfo неТ в хранилище');
      sortInfo = {
        sortby: '',
        sortorder: '',
      };
      // заполняем значением по умолчанию
      localStorage.setItem(SORT_KEY, JSON.stringify(sortInfo));
    } else {
      // если сохранено в хранилище
      console.log('sortInfo: ', sortInfo);
    }

    console.log('sortby: ', sortInfo.sortby);
    console.log('sortorder: ', sortInfo.sortorder);

    // * initial sorting
    for (const child of head.firstElementChild.children) {
      child.classList.remove('ascending');
      child.classList.remove('descending');
      child.dataset.sortorder = '';
      if (child.dataset.sortby === sortInfo.sortby) {
        child.classList.add('ascending');
        child.dataset.sortorder = 'ascending'; // flag
      }
    }

    data = sortDataBy(sortInfo.sortby, sortInfo.sortorder);
    // сначала удаляем
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
          child.classList.remove('ascending');
          child.classList.remove('descending');
          child.dataset.sortorder = ''; // todo
          if (target === child) {
            child.dataset.sortorder = 'ascending'; // todo flag
            child.classList.add('ascending');
          }
        }

        if (objEventBtns.isShown) {
          console.log('delete скрываем');
          // todo
          head.querySelector('.delete').classList.remove('is-visible');
          objEventBtns.isShown = false;
        }
        // осктльные в таблице просто перерендерятся

        sortInfo.sortby = target.dataset?.sortby;
        sortInfo.sortorder = target.dataset?.sortorder;
        // обновляем данные о сортировке в хранилище
        localStorage.setItem(SORT_KEY, JSON.stringify(sortInfo));
        // sortorder = target.dataset?.sortorder;
        console.log(target.dataset.sortby, target.dataset.sortorder);
        // сортируем
        const sortData = sortDataBy(sortInfo.sortby, sortInfo.sortorder);
        // clearContactList очищаем список контактов в DOM
        while (list.lastChild) {
          // наверное можно просто не удаляя использовать .prepend()
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
