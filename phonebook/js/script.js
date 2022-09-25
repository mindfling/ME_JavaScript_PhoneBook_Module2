'use strict';

// ** Добавил кнопки Редактировать
// todo осталось сделать функционал при нажатии на кнопки редактировать :)

/**
 * * Returns a hash code from a string use it for hosh contocts
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// * оригинальные данные
const origin = [
  {
    name: 'Иван',
    surname: 'Петров',
    phone: '+79514545454',
  },
  {
    name: 'Игорь',
    surname: 'Семёнов',
    phone: '+79999999999',
  },
  {
    name: 'Семён',
    surname: 'Иванов',
    phone: '+79800252525',
  },
  {
    name: 'Мария',
    surname: 'Попова',
    phone: '+79876543210',
  },
];
console.log('origin: ', origin);
// * копия данных
let data = JSON.parse(JSON.stringify(origin));
console.log('data: ', data);

// * обработка хэшей добавляем в массив объектов хэш
data = data.map((obj, index) => {
  const str = index.toString() +
      Object.values(obj).reduce((accum, curr) => (accum + curr), '');
  obj.id = 'id' + hashCode(str);
  obj.title = 'title' + str;
  return obj;
});


// * наш модуль приложение
{
  /**
   * * createElem
   * todo функция взята из интенсива для создания елемента
   * @param {String} tag тег элемента
   * @param {Object} attr объект аттрибутов
   * @param {String} text строка текстовое содержимое елемента
   * @return {DOMElement} возвращает созданный елемент
   */
  const createElem = (tag, attr = {}, text) => {
    const elem = document.createElement(tag);
    Object.assign(elem, attr);
    if (text) {
      elem.textContent = text;
    }
    return elem;
  };

  // * createContainer
  const createContainer = () => {
    const container = document.createElement('div');
    container.classList.add('container');
    return container;
  };

  // * createHeader
  const createHeader = () => {
    const header = document.createElement('header');
    header.classList.add('header');
    const headerContainer = createContainer();
    header.append(headerContainer);
    header.headerContainer = headerContainer;
    return header;
  };

  // * createLogo
  const createLogo = title => {
    const h1 = document.createElement('h1');
    h1.classList.add('logo');
    h1.textContent = `Телефонный справочник. ${title}`;
    return h1;
  };

  // * createMain
  const createMain = () => {
    const main = document.createElement('main');
    const mainContainer = createContainer();
    main.append(mainContainer);
    main.mainContainer = mainContainer;
    return main;
  };

  // * createButtonGroup
  const createButtonGroup = params => {
    const btnWrapper = document.createElement('div');
    btnWrapper.classList.add('btn-wrapper');

    const btns = params.map(({className, type, text, title}) => {
      const button = document.createElement('button');
      button.type = type;
      button.textContent = text;
      button.classList = className;
      if (title) {
        button.title = title;
      }
      return button;
    });
    btnWrapper.append(...btns);
    return {
      btnWrapper,
      btns,
    };
  };

  // * createTable
  const createTable = (data) => {
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');

    const thead = document.createElement('thead');
    thead.insertAdjacentHTML('beforeend', `
      <tr>
        <th class="delete">Удалить</th>
        <th>Имя</th>
        <th>Фамилия</th>
        <th>Телефон</th>
        <th class="redact">Редактировать</th>
      </tr>
    `);
    const tbody = document.createElement('tbody');
    table.append(thead, tbody);
    table.thead = thead;
    table.tbody = tbody;
    return table;
  };

  // todo delete comments !
  /*
  // * createForm Максим
  const createForm = (title) => {
    const overlay = document.createElement('div');
    overlay.classList.add('form-overlay');
    const form = document.createElement('form');
    form.classList.add('form');
    let formTitle = (title ? 'Редактировать контакт' : 'Добавить контакт');
    form.insertAdjacentHTML('beforeend', `
      <button class="close" type="button"></button>

      <h2 class="form-title">${formTitle}</h2>

      <div class="form-group row">
        <!-- <label class="form-lable col-sm-4" for="name">Имя</label> -->
        <div class="col-sm-12">
          <input class="form-input form-input-name form-control"
            name="name" placeholder="Введите имя" id="name" type="text" required>
        </div>
      </div>

      <div class="form-group row">
        <!-- <label class="form-lable col-sm-4" for="surname">Фамилия</label> -->
        <div class="col-sm-10">
          <input class="form-input form-input-surname form-control" name="surname" placeholder="Введите фамилию" id="surname" type="text" required>
        </div>
      </div>
      <div class="form-group row">
        <!-- <label class="form-lable col-sm-4" for="phone">Телефон</label> -->
        <div class="col-sm-8">
          <input class="form-input form-input-phone form-control" name="phone" placeholder="Номер телефона" id="phone" type="text" required>
        </div>
      </div>
    `);
    const buttonGroup = createButtonGroup([
      {
        className: 'btn btn-primary col-sm-5 mr-2',
        type: 'submit',
        text: 'Добавить',
      },
      {
        className: 'btn btn-danger col-sm-5',
        type: 'reset',
        text: 'Очистить',
      },
    ]);
    form.append(buttonGroup.btnWrapper);
    overlay.append(form);
    form.inputName = form.querySelector('.form-input-name');
    form.inputSurname = form.querySelector('.form-input-surname');
    form.inputPhone = form.querySelector('.form-input-phone');
    // const formInputName = form.querySelector('.form-input-name');
    // const formInputSurname = form.querySelector('.form-input-surname');
    // const formInputPhone = form.querySelector('.form-input-phone');
    return {
      overlay,
      form,
      inputName: form.inputName,
      inputSurname: form.inputSurname,
      inputPhone: form.inputPhone,
    };
  };
  */

  // * getDataContact
  // получить контакт из массива data by id
  const getDataContact = (id) => {
    // filter фильтрует элементы выдает массив контактов с данным id
    const contact = data.filter(contact => (contact.id === id));
    return contact[0];
  };


  // * deteleDataContact
  const deteleDataContact = (id) => {
    // удалить этот элем из массива
    data.forEach((contact, index, arr) => {
      if (contact.id === id) {
        data.splice(index, 1);
      }
    });
  };

  // eslint-disable-next-line valid-jsdoc
  /**
   * * createFormDyn
   * todo своя функция динамически генерирует форму
   * */
  const createFormDyn = (titleText,
      {dataid, firstname, surname, phone} = {},
  ) => {
    // обработка id контакта если id существует
    if (dataid) {
      const result = getDataContact(dataid);
      firstname = result.name;
      surname = result.surname;
      phone = result.phone;
    }

    // проверка на пустые поля
    firstname = firstname ? firstname : '';
    surname = surname ? surname : '';
    phone = phone ? phone : '';

    // генерим оверлей
    const overlay = createElem('div', {
      className: 'form-overlay',
    });
    // генерируем форму
    const form = createElem('form', {
      className: 'form',
    });
    // заголовок формы, по умолчанию Добавить контакт
    titleText = (titleText ? titleText : 'Добавить контакт');
    const title = createElem('h2', {
      className: 'form-title',
    },
    titleText);
    // кнопка Закрыть форму
    const closeBtn = createElem('button', {
      className: 'close',
      type: 'button',
      title: 'Закрыть форму',
    });

    // строка ввода имени
    const formGroupName = createElem('div', {
      className: 'form-group row',
    });
    const colName = createElem('div', {
      className: 'col-sm-12',
    });
    const inputName = createElem('input', {
      className: 'form-input form-input-name form-control',
      name: 'name',
      placeholder: 'Имя...',
      id: 'name',
      type: 'text',
      required: 'true',
      value: firstname ? firstname : '',
    });
    colName.append(inputName);
    formGroupName.append(colName);

    // строка ввода фамилии
    const formGroupSurname = createElem('div', {
      className: 'form-group row',
    });
    const colSurname = createElem('div', {
      className: 'col-sm-10',
    });
    const inputSurname = createElem('input', {
      className: 'form-input form-input-name form-control',
      name: 'surname',
      placeholder: 'Фамилия...',
      id: 'surname',
      type: 'text',
      required: 'true',
      value: surname ? surname : '',
    });
    colSurname.append(inputSurname);
    formGroupSurname.append(colSurname);

    // строка ввода телефона
    const formGroupPhone = createElem('div', {
      className: 'form-group row',
    });
    const colPhone = createElem('div', {
      className: 'col-sm-8',
    });
    const inputPhone = createElem('input', {
      className: 'form-input form-input-name form-control',
      name: 'phone',
      placeholder: 'Телефон...',
      id: 'phone',
      type: 'text',
      required: 'true',
      value: phone ? phone : '', // todo
    });
    colPhone.append(inputPhone);
    formGroupPhone.append(colPhone);

    const buttonGroupForm = createButtonGroup([
      {
        className: 'btn btn-outline-primary btn-sm mr-2',
        type: 'submit',
        text: 'Добавить',
        title: 'Сохранить контакт в список',
      },
      {
        className: 'btn btn-outline-danger btn-sm',
        type: 'reset',
        text: 'Очистить',
        title: 'Очистить данные формы',
      },
    ]);

    form.append(closeBtn, title, formGroupName, formGroupSurname, formGroupPhone, buttonGroupForm.btnWrapper);

    form.closeBtn = closeBtn;
    form.formTitle = title;
    form.inputName = inputName;
    form.inputSurname = inputSurname;
    form.inputPhone = inputPhone;
    form.btnSubmit = buttonGroupForm.btns[0];
    form.btnReset = buttonGroupForm.btns[1];
    overlay.append(form);

    return {
      overlay,
      title,
      form,
    };
  };


  // * createFooter
  const createFooter = () => {
    const footer = document.createElement('footer');
    footer.classList.add('footer');
    const footerContainer = createContainer();
    footer.append(footerContainer);
    footer.footerContainer = footerContainer;
    footerContainer.textContent = 'Футер копирайт';
    return footer;
  };

  // * renderPhonebook
  const renderPhonebook = (app, title) => {
    const header = createHeader();
    const logo = createLogo(title);
    const main = createMain();
    const buttonGroup = createButtonGroup([
      {
        className: 'btn btn-primary mr-3 js-add',
        type: 'button',
        text: 'Добавить',
        title: 'Открыть форму для добавления данных нового контакта',
      },
      {
        className: 'btn btn-danger js-del',
        type: 'button',
        text: 'Удалить',
        title: 'Выбрать и удалить контакт',
      },
    ]);
    const table = createTable();
    const form = createFormDyn('Добавить');
    // const form = createFormDyn(
    //   'Редактируем этот',
    //   {
    //     dataid: 'id20614058',
    //   },
    // );

    const footer = createFooter('');

    header.headerContainer.append(logo);
    // main.mainContainer.append(buttonGroup.btnWrapper, table, form.overlay);
    main.mainContainer.append(buttonGroup.btnWrapper, table);
    main.append(form.overlay);
    footer.footerContainer.innerHTML = 'Все права защищены &copy; ' + title;
    app.append(header, main, footer);

    return {
      logo,
      table,
      listTbody: table.tbody,
      btnAdd: buttonGroup.btns[0],
      btnDel: buttonGroup.btns[1],
      formOverlay: form.overlay,
      form: form.form,
    };
  };

  // * createRow
  const createRow = ({name: firstname, surname, phone, id, title}) => {
    const tr = document.createElement('tr');
    tr.classList.add('tdRow');
    tr.id = id; // id ряда конткта для идентификации
    tr.title = title; // title этого ряда для дебага

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

    const tdRedact = document.createElement('td');
    const redactBtn = createButtonGroup([
      {
        className: 'btn btn-outline-danger btn-sm redact-btn',
        type: 'button',
        text: 'редактировать',
        title: `Редактировать контакт: ${firstname} ${surname} ${phone} `,
      },
    ]);
    tdRedact.classList.add('redact');
    tdRedact.append(...redactBtn.btns);
    tr.append(tdDel, tdName, tdSurname, tdPhone, tdRedact);
    return tr;
  };

  // * renderContacts
  const renderContacts = (list, data) => {
    // генерируем массив рядов из массива данных data
    const allRows = data.map(createRow);
    // * добавляем все ряды
    list.append(...allRows);
    return allRows;
  };


  // * practice working lesson05
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


  // * ! ЗАПУСК ПРИЛОЖНИЯ ЧЕРЕЗ init() !!!
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    // const phonebook = renderPhonebook(app, title);
    // const {listTbody, logo, btnAdd, btnDel, formOverlay, form, table} = phonebook;

    // деструктуризируем переменные из объекта
    const {
      listTbody,
      logo,
      btnAdd,
      btnDel,
      formOverlay,
      form,
      table,
    } = renderPhonebook(app, title);

    // form.formTitle.textContent = 'Kh мой заголовок';
    // console.log('renderPhonebook: form: ', form);
    // console.log('form.formTitle: ', form.formTitle);

    const allRow = renderContacts(listTbody, data);
    hoverRow(allRow, logo);

    // обработчик событий кликов на
    // * btnAdd и btnDel
    const objEventBtns = {
      isShown: false, // в начале закрыты все ячейки с кнопками .delete
      handleEvent(event) {
        const target = event.target;
        const cellDeleteAll = table.querySelectorAll('.delete');

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

    // кнопка Добавить
    btnAdd.addEventListener('click', objEventBtns);
    // кнопка Удалить
    btnDel.addEventListener('click', objEventBtns);


    // при клике на оверлай скрывем модалку
    formOverlay.addEventListener('click', (event) => {
      const target = event.target;
      // todo отрабатываем клик по кнокпе close
      if (target === form.closeBtn) {
        formOverlay.classList.remove('is-visible');
        return;
      }

      // * кнопка Submit
      if (target === form.btnSubmit) {
        event.preventDefault();
        const contact = {
          name: form.inputName.value,
          surname: form.inputSurname.value,
          phone: form.inputPhone.value,
        };

        // ** добавим новый контакт
        contact.id = 'id' + hashCode(data.length.toString() +
            Object.values(contact).reduce((accum, curr) => (accum + curr), ''));
        data.push(contact);
        listTbody.append(createRow(contact));

        // очистить форму
        form.inputName.value = '';
        form.inputSurname.value = '';
        form.inputPhone.value = '';
        // закрываем форму
        formOverlay.classList.remove('is-visible');
        return;
      }

      // * кнопка Reset
      if (target === form.btnReset) {
        // отключить действие поумолчанию при нажатии на клавшу reset формы
        event.preventDefault();
        // очистить форму вручную
        console.log('Очистить');
        // form.inputName.value = '';
        // form.inputSurname.value = '';
        // form.inputPhone.value = '';
        return;
      }

      // блокируем клик по самой форме
      if (event.target.closest('.form')) {
        return;
      }
      formOverlay.classList.remove('is-visible'); // скрываем оверлей
    });


    listTbody.addEventListener('click', e => {
      const target = e.target;

      // обработка событий клик по кнопке Редактировать
      if (target.classList.contains('redact-btn')) {
        const targetRow = target.closest('.tdRow');
        const dataID = targetRow?.id;

        data.forEach((contact, index, arr) => {
          if (contact.id === dataID) {
            console.log('here is: ', contact.title, 'at index: ', index);
            console.log(data[index]);
            data.splice(index, 1);
            // todo редактирование этого элем из массива
          }
          listTbody.innerHTML = '';
          listTbody.append(document.createElement('div'));
          renderContacts(listTbody, data);
        });
      }
    });

    // обработка событий клик по Удалить del-icon
    listTbody.addEventListener('click', e => {
      const trg = e.target;
      if (trg.classList.contains('del-icon')) {
        const trgRow = trg.closest('.tdRow');
        const dataID = trgRow.id;
        // удалить этот элем из массива
        deteleDataContact(dataID);
        // удалить строку из DOM
        trgRow.remove();
        // проверка данных в массве
        console.log(data.length, JSON.stringify(data));
      }
    });
  };

  window.phonebookInit = init;
}
