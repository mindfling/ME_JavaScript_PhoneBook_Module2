'use strict';

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
  {
    name: 'Dmitry',
    surname: 'Василич',
    phone: '+79001234567',
  },
];

{
  let data = [];
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


  // * getDataContact
  // получить контакт из массива data by id
  const getDataContact = (id) => {
    // filter фильтрует элементы выдает массив контактов с данным id
    const contact = data.filter(contact => (contact.id === id));
    // console.log('contact: ', contact);
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
    const thead = document.createElement('thead');
    thead.insertAdjacentHTML('beforeend', `
      <tr class="table__row_head">
        <th class="delete">Удалить</th>
        <th class="table__cell_head" data-sortby="by-name">Имя</th>
        <th class="table__cell_head" data-sortby="by-surname">Фамилия</th>
        <th class="table__cell_head" data-sortby="by-phone">Телефон</th>
      </tr>
    `);

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

    // <h2 class="form-title">Добавить Контакт</h2>
    form.insertAdjacentHTML('afterbegin', `
      <h2 class="form-title">Добавить Контакт</h2>
    `);

    // <button class="close" type="button"></button>
    const closeBtn = createButtonGroup([
      {
        className: 'close',
        type: 'button',
        title: 'Закрыть форму',
      },
    ]).btns[0];
    form.prepend(closeBtn);

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

    // form.append(...buttonGroup.btns);
    form.append(buttonGroup.btnWrapper);
    overlay.append(form);
    return {
      overlay,
      closeBtn,
      form,
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
        className: 'btn btn-primary mr-3 js-add',
        type: 'button',
        text: 'Добавить',
      },
      {
        className: 'btn btn-danger js-del',
        type: 'button',
        text: 'Удалить',
      },
    ]);
    const table = createTable();
    const form = createForm();
    const footer = createFooter();

    header.headerContainer.append(logo);
    main.mainContainer.append(buttonGroup.btnWrapper, table, form.overlay);
    main.append(form.overlay);
    footer.footerContainer.innerHTML = `Все права защищены &copy; ${title}`;
    app.append(header, main, footer);
    return {
      list: table.tbody,
      logo,
      btnAdd: buttonGroup.btns[0],
      btnDel: buttonGroup.btns[1],
      formOverlay: form.overlay,
      form: form.form,
      closeBtn: form.closeBtn,
    };
  };

  const createRow = ({name: firstname, surname, phone, id}) => {
    const tr = document.createElement('tr');
    tr.id = id; // id ряда конткта для идентификации
    tr.classList.add('tdRow');
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


  // * MAIN INIT *
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const phonebook = renderPhonebook(app, title);

    // обработка хэшей добавляем в массив объектов хэш
    data = origin.map((obj, index) => {
      const str = '' + index +
          Object.values(obj).reduce((accum, curr) => (accum + curr), '');
      obj.id = 'id' + hashCode(str);
      return obj;
    });


    const {list, logo, btnAdd, btnDel, formOverlay, closeBtn, form} = phonebook;

    // todo функционал here

    const allRow = renderContacts(list, data);

    hoverRow(allRow, logo);

    // можно использовать объект событий
    const objEvent = {
      handleEvent(event) {
        // просто пример
        if (event.ctrlKey) {
          this.makeGrey();
        } else {
          this.btnHandle(event.target);
        }
      },
      makeGrey() {
        document.body.style.backgroundColor = 'dimgrey';
        // alert('it was ctrl and click');
      },
      btnHandle(target) {
        if (target === btnAdd) {
          // здесь делаем видимым оверлай и модалку
          formOverlay.classList.add('is-visible');
          return;
        }
        if (target === btnDel) {
          // здесь находим все элементы .delete и делаем их видимыми
          // const dellCellAll = table.querySelectorAll('.delete');
          const dellCellAll = list.parentElement.querySelectorAll('.delete');
          dellCellAll.forEach(cell => {
            cell.classList.add('is-visible');
          });
          return;
        }
      },
    };

    // * handleEvent obj клики по кнопкам Добавить и Удалить
    btnAdd.addEventListener('click', objEvent);
    btnDel.addEventListener('click', objEvent);

    formOverlay.addEventListener('click', (event) => {
      const target = event.target;
      // console.log(event.target);
      // ** отрабатываем клик по кнокпе CLOSE
      if (target === closeBtn) {
        formOverlay.classList.remove('is-visible');
        return;
      }
      // блокируем клик по самой форме
      if (target.closest('.form')) {
        return;
      }
      // сделать невидимым оверлей
      formOverlay.classList.remove('is-visible');
    });

    list.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('del-icon')) {
        const targetRow = target.closest('.tdRow'); // clicked Row
        const dataID = targetRow.id; // data ID contact
        deteleDataContact(dataID);
        targetRow.remove();
        console.log(data);
        return;
      }
      console.log(target);
    });

    list.parentElement.addEventListener('click', e => {
      console.log('table click', e.target);
      if(e.target.closest('.table__cell_head')) {
        console.log('Ячейки заголовка', e.target.textContent);
      }
    });
  };


  window.phonebookInit = init;
}
