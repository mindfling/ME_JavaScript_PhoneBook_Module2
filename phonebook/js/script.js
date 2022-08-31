'use strict';

/** 
 * * Returns a hash code from a string use it for hosh contocts
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

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
  {
    name: 'Dmitry',
    surname: 'Vasylivi4',
    phone: '+79001234567',
  },
  {
    name: 'Иван',
    surname: 'Петров',
    phone: '+79514545454',
  },
  {
    name: 'Иван',
    surname: 'Петров',
    phone: '+79514545454',
    id: 'id67492487',
    title: '0ИванПетров+79514545454',
  },
  {
    name: 'Иван',
    surname: 'Петров',
    phone: '+79514545454',
    id: 'id67492487',
    title: 'title0ИванПетров+79514545454',
  },
];

// * копия данных
let data = JSON.parse(JSON.stringify(origin));

// * обработка хэшей добавляем в массив объектов хэш
  data = data.map((obj, index) => {
    let str = index.toString() + Object.values(obj).reduce((accum, curr) => (accum + curr), '');
    obj.id = 'id' + hashCode(str);
    obj.title = 'title' + str;
    return obj;
  });
  
// * пример данных после обработки хэшей
const modData = [
  {
    name: 'Иван',
    surname: 'Петров',
    phone: '+79514545454',
  },
  {
    name: 'Иван',
    surname: 'Петров',
    phone: '+79514545454',
    id: 'id67492487',
    title: '0ИванПетров+79514545454',
  },
  {
    name: 'Иван',
    surname: 'Петров',
    phone: '+79514545454',
    id: 'id67492487',
    title: 'title0ИванПетров+79514545454',
  },
  {
    /*
    name: 'Игорь',
    surname: 'Семёнов',
    phone: '+79999999999',
    id: 'id20614058',
    title: '1ИгорьСемёнов+79999999999',
  },
  {
    name: 'Семён',
    surname: 'Иванов',
    phone: '+79800252525',
    id: 'id2126516655',
    title: '2СемёнИванов+79800252525',
  },
  {
    name: 'Мария',
    surname: 'Попова',
    phone: '+79876543210',
    id: 'id758408749',
    title: '3МарияПопова+79876543210',
  },
  {
    name: 'Dmitry',
    surname: 'Vasylivi4',
    phone: '+79001234567',
    id: 'id1150705461',
    title: '4DmitryVasylivi4+79001234567',
    */
  },
];



// * наш модуль приложение
{

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

    const btns = params.map(({className, type, text}) => {
      const button = document.createElement('button');
      button.type = type;
      button.textContent = text;
      button.classList = className;
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

  // todo ФОРМА
  // * createForm
  const createForm = () => {
    const overlay = document.createElement('div');
    overlay.classList.add('form-overlay');

    const form = document.createElement('form');
    form.classList.add('form');
    let formTitle = 'Редактировать контакт';
    formTitle = 'Добавить контакт';
    form.insertAdjacentHTML('beforeend', `
    <button class="close" type="button"></button>

    <h2 class="form-title">${formTitle}</h2>
  
  
    <div class="form-group row">
      <!-- <label class="form-lable col-sm-4" for="name">Имя</label> -->
      <div class="col-sm-8">
        <input class="form-input" name="name" placeholder="Введите имя" id="name" type="text" required>
      </div>
    </div>

    <div class="form-group row">
      <!-- <label class="form-lable col-sm-4" for="surname">Фамилия</label> -->
      <div class="col-sm-8">
        <input class="form-input" name="surname" placeholder="Введите фамилию" id="surname" type="text" required>
      </div>
    </div>

    <div class="form-group row">
      <!-- <label class="form-lable col-sm-4" for="phone">Телефон</label> -->
      <div class="col-sm-8">
        <input class="form-input" name="phone" placeholder="Номер телефона" id="phone" type="text" required>
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
    return {
      overlay,
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
    // footer.footerContainer.innerHTML = 'Все права защищены &copy; Автор';
    footer.footerContainer.innerHTML = 'Все права защищены &copy; ' + title;
    app.append(header, main, footer);
    return {
      list: table.tbody,
      logo,
      btnAdd: buttonGroup.btns[0],
      btnDel: buttonGroup.btns[1],
      formOverlay: form.overlay,
      form: form.form,
      table,
    };
  };

  const createRow = ({name: firstname, surname, phone, id, title}) => {
    const tr = document.createElement('tr');
    tr.classList.add('tdRow');
    tr.id = id;
    // tr.title = title;

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
      },
    ]);
    tdRedact.classList.add('redact');
    tdRedact.append(...redactBtn.btns);
    tr.append(tdDel, tdName, tdSurname, tdPhone, tdRedact);
    return tr;
  };

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
    return ;
  };


  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const phonebook = renderPhonebook(app, title);

    // деструктуризируем переменные из объекта
    const {list, logo, btnAdd, btnDel, formOverlay, form, table} = phonebook;


    const allRow = renderContacts(list, data);
    hoverRow(allRow, logo);

    const objEvent = {
      handleEvent(event) {
        const target = event.target;
        // здесь делаем видимым оверлай и модалку
        if (target === btnAdd) {
          formOverlay.classList.add('is-visible');
        } else if (target === btnDel) {
          const cellDeleteAll = table.querySelectorAll('.delete');
          cellDeleteAll.forEach(cellDelete => {
            // cellDelete.classList.toggle('is-visible');
            cellDelete.classList.add('is-visible');
          });
        }
      },
    };

    btnAdd.addEventListener('click', objEvent);
    btnDel.addEventListener('click', objEvent);

    
    // при клике на оверлай скрывем модалку
    formOverlay.addEventListener('click', (event) => {
      // отрабатываем клик по кнокпе close
      if (event.target === form.querySelector('.close')) {
        formOverlay.classList.remove('is-visible');
        return;
      }
      // блокируем клик по самой форме
      if (event.target.closest('.form')) {
        return;
      }
      formOverlay.classList.remove('is-visible');
    });


    list.addEventListener('click', e => {
      const target = e.target;

      if (target.classList.contains('redact-btn')) {
        const targetRow = target.closest('.tdRow');
        const dataID = targetRow?.id;
        console.log('redact', targetRow.id);
        // formOverlay.classList.add('is-visible'); // todo передачу данных в форму редакттирования

        // todo HERE data обработку данных
        data.forEach((contact, index, arr) => {
          if (contact.id === dataID) {
            console.log('here is: ', contact.title, 'at index: ', index);
            console.log(data[index]);
            data.splice(index, 1); // todo редактирование этого элем из массива
          }
          console.log(data);
          list.innerHTML = '';
          list.append(document.createElement('div'));
          renderContacts(list, data);
        })
      }
    })

    // list = table.tbody
    list.addEventListener('click', e => {
      const trg = e.target;
      if (trg.classList.contains('del-icon')) {
        const trgRow = trg.closest('.tdRow');
        // id контакта для удаления
        const dataID = trgRow.id;
        // удалить строку из DOM
        trgRow.remove();
        // todo удалить этот элем из массива
        data.forEach((contact, index, arr) => {
          if (contact.id === dataID) {
            data.splice(index, 1);
          }
        });        
        // проверка данных в массве
        console.log(data.length, JSON.stringify(data));
      }
    });
  };

  window.phonebookInit = init;
}
