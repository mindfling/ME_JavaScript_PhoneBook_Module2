'use strict';

// const data = []; // в отдельном ящике data.js

let data = [];
const KEY = 'phone-test';

{
  const getStorage = (storageKey) => {
    let result = JSON.parse(localStorage.getItem(KEY));
    if (!Array.isArray(result)) {
      console.log('Пусто был неАрхив');
      result = [];
    }
    console.log('result ', result);
    return result;
  };

  const setStorage = (storageKey, data) => {
    console.log('set local storage', data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };


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

  //  возвращает сгенерированый hash id для контакта
  const getContactHash = (contact = {}) => {
    const hashID = Object.values(contact)
        .reduce((accum, curr) => `${accum}x${hashCode(curr).toString(32)}`,
            'id');
    return hashID;
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


  // получить контакт из массива data by id
  const getDataContact = (id) => {
    // filter фильтрует элементы выдает массив контактов с данным id
    const contacts = data.filter(contact => (contact.id === id));
    return contacts[0];
  };


  const removeStorage = (storageKey, newData) => {
    console.log('remove storageKey: ', storageKey);
    // todo записываем поверх новыми данными
    setStorage(storageKey, newData);
  };


  // удалить контакт из массива by id
  const deteleDataContact = (id) => {
    data.forEach((contact, index, arr) => {
      if (contact.id === id) {
        data.splice(index, 1);
      }
    });
    // удалить из data
    removeStorage(KEY, data);
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
    thead.insertAdjacentHTML('beforeend', `
      <tr>
        <th class="delete">Удалить</th>
        <th>Имя</th>
        <th>Фамилия</th>
        <th>Телефон</th>
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
    console.log('create row mapping data: ', data);
    if (data) {
      const allRows = data.map(createRow);
      list.append(...allRows);
      return allRows;
    } else {
      return [];
    }
  };

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
    console.log('modal objEvent: ', objEvent);

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
    console.log('delete objEvent: ', objEvent);
    // handleEvent obj клики по кнопкам Добавить и Удалить
    btnDel.addEventListener('click', objEvent);

    list.addEventListener('click', (e) => {
      const target = e.target;
      if (target.closest('.del-icon')) {
        const targetRow = target.closest('.contact'); // clicked Row
        const dataID = targetRow.id; // data ID contact
        deteleDataContact(dataID);
        console.log(data); // выводим в консоль то что у нас вышло
        targetRow.remove(); // удаляем строку из DOM
        return;
      }
    });
  };

  // добавляем новый контакт в массив data
  const addContactData = (newContact) => {
    if (Array.isArray(data)) {
      data.push(newContact);
      console.log('Array', data);
    } else {
      // todo добавлять хеш id для контакта ПРОВЕРКА
      console.log('is not Array', data);
      data = [];
      data.push(newContact);
    }
  };

  // добавляем новую строку с контактом в тело таблицы table.tbody
  const addContactPage = (newContact, list) => {
    list.append(createRow(newContact));
  };

  const formControl = ({form, list, closeModal}) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target); // данные из формы
      const newContact = Object.fromEntries(formData);

      newContact.id = getContactHash(newContact);
      console.log('newContact: ', newContact);

      addContactData(newContact);
      addContactPage(newContact, list);

      form.reset();
      closeModal();
    });
  };


  // * MAIN INIT *
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);

    data = getStorage(KEY);

    makeDataContactsHashes(data);
    const {
      list,
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
        // const cellDeleteAll = table.querySelectorAll('.delete');

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


    // todo ФУНКЦИОНАЛ ЗДЕСЬ
    const allRow = renderContacts(list, data);
    console.log('allRow: ', allRow);
    hoverRow(allRow, logo);
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


  /*
  const initStorage = () => {
    console.log(data);
    const localStorage = getStorage(KEY);
    console.log('localStorage: ', localStorage);
    data = localStorage;
    if (localStorage) {
      console.log('storage is full of', localStorage);
    } else {
      console.log('storage is empty\ninit Storage');
      setStorage(KEY, JSON.stringify(originData));
      data = getStorage(KEY);
    }
    makeDataContactsHashes(data);
    console.log('data: ', data);
  };
*/
