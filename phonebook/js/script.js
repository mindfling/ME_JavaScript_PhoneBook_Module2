'use strict';

// const data = []; // в отдельном ящике data.js

{
  // * возвращает hashCode по строке str
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      const chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // * возвращает сгенерированый hash id для контакта
  const getContactHash = (contact = {}) => {
    const hashID = Object.values(contact)
        .reduce((accum, curr) => `${accum}x${hashCode(curr).toString(32)}`,
            'id');
    return hashID;
  };
  /*
id:  id_1ecaaa7_45919168_5cc27a08 	-> tel: +79514545454 script.js:236:15
id:  id_3ba957cf_29dfbeb8_3877df4 	-> tel: +79999999999 script.js:236:15
id:  id_3c290e94_396d249b_26fc1eec 	-> tel: +79800252525 script.js:236:15
id:  id_1f04fd0_396d249b_d5da5f9 	-> tel: +79876543210 script.js:236:15
id:  id_3222064f_4baa628b_6bab5e87 	-> tel: +79001234567 script.js:236:15
*/
  /*
id:  0xxupal7x12p34b8x1ec4ug8 	-> tel: +79514545454 script.js:245:15
id:  0xxupal7xktvflox1oevfk 	-> tel: +79999999999 script.js:245:15
id:  0xxupal7xsmq94rxjfo7nc 	-> tel: +79800252525 script.js:245:15
id:  0xxupal7xsmq94rx6lr9fp 	-> tel: +79876543210 script.js:245:15
id:  0xxp241ifx15qkokbx1lqmnk7 	-> tel: +79001234567

id:  idxupal7x12p34b8x1ec4ug8 	-> tel: +79514545454 script.js:250:15
id:  idxtqilufxktvflox1oevfk 	-> tel: +79999999999 script.js:250:15
id:  idxu2i3kkxsmq94rxjfo7nc 	-> tel: +79800252525 script.js:250:15
id:  idxv0jugxsmq94rx6lr9fp 	-> tel: +79876543210 script.js:250:15
id:  idxp241ifx15qkokbx1lqmnk7 	-> tel: +79001234567
*/

  // * генерирует добавляет .id для каждого контакта объкта в массиве data
  const makeDataContactsHashes = (data) => data.map((contact, index) => {
    contact.id = getContactHash(contact);
  });

  // получить контакт из массива data by id
  const getDataContact = (id) => {
    // filter фильтрует элементы выдает массив контактов с данным id
    const contacts = data.filter(contact => (contact.id === id));
    return contacts[0];
  };

  // удалить контакт из массива by id
  const deteleDataContact = (id) => {
    data.forEach((contact, index, arr) => {
      if (contact.id === id) {
        data.splice(index, 1);
      }
    });
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
    // проверка на undefined
    if (id) {
      tr.id = id; // id ряда конткта для идентификации
      console.log('id: ', id, '\t-> tel:', phone);
    } else {
      tr.id = 'tr' + hashCode(firstname) + hashCode(surname) + hashCode(phone);
      console.log('id не существует: ', id, tr.id);
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
    const allRows = data.map(createRow);
    list.append(...allRows);
    return allRows;
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
    // открыть модалку
    const openModal = () => {
      formOverlay.classList.add('is-visible');
    };

    // закрыть модалку
    const closeModal = () => {
      formOverlay.classList.remove('is-visible');
    };

    // кнопка Добавить открывает модалку
    btnAdd.addEventListener('click', openModal);

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
    // * handleEvent obj клики по кнопкам Добавить и Удалить
    btnDel.addEventListener('click', () => {
      const dellCellAll = list.parentElement.querySelectorAll('.delete');
      dellCellAll.forEach(del => {
        // todo close only .is-visible
        del.classList.toggle('is-visible');
      });
    });


    list.addEventListener('click', (e) => {
      const target = e.target;
      if (target.closest('.del-icon')) {
        const targetRow = target.closest('.contact'); // clicked Row
        const dataID = targetRow.id; // data ID contact
        deteleDataContact(dataID);
        console.log(data); // выводим в консоль то что у нас вышло
        targetRow.remove();
        return;
      }
    });
  };

  // добавляем новый контакт в массив data
  const addContactData = (newContact) => {
    // todo добавлять хеш id для контакта
    data.push(newContact);
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


    // todo ФУНКЦИОНАЛ ЗДЕСЬ
    const allRow = renderContacts(list, data);
    hoverRow(allRow, logo);
    const {closeModal} = modalControl({
      formOverlay,
      btnAdd,
      closeBtn,
    });
    deleteControl({btnDel, list});
    formControl({form, list, closeModal});
  };


  window.phonebookInit = init;
}
