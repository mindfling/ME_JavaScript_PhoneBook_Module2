'use strict';

const data = [
  {
    name: 'Иван',
    surname: 'Петров',
    phone: '8(951)4545454',
  },
  {
    name: 'Игорь',
    surname: 'Семёнов',
    phone: '8(999)9999999',
  },
  {
    name: 'Семён',
    surname: 'Иванов',
    phone: '8(980)0252525',
  },
  {
    name: 'Мария',
    surname: 'Попова',
    phone: '8(987)6543210',
  },
];

{
/** 
 * * используем hash функцию для генерации id контактов
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
  function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }  

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

    const btns = params.map(({className, type, text}) => {
      const button = document.createElement('button');
      button.type = type;
      button.textContent = text;
      button.className = className;
      // button.classList.add(className);
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
      <tr>
        <th class="delete">Удалить</th>
        <th>Имя</th>
        <th>Фамилия</th>
        <th>Телефон</th>
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
    form.insertAdjacentHTML('beforeend', `
      <button class="close" type="button"></button>
      <h2 class="form-title">Добавить Контакты</h2>
      <div class="form-group">
        <label class="form-lable" for="name">Имя</label>
        <input class="form-input" name="name"
            id="name" type="text" required>
      </div>
      <div class="form-group">
        <label class="form-lable" for="surname">Фамилия</label>
        <input class="form-input" name="surname"
            id="surname" type="text" required>
      </div>
      <div class="form-group">
        <label class="form-lable" for="phone">Телефон</label>
        <input class="form-input" name="phone"
            id="phone" type="text" required>
      </div>
    `);

    const buttonGroupForm = createButtonGroup([
      {
        className: 'btn btn-primary mr-3',
        type: 'submit',
        text: 'Добавить',
      },
      {
        className: 'btn btn-danger',
        type: 'reset',
        text: 'Очистить',
      },
    ]);

    form.append(...buttonGroupForm.btns);
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
    const buttonGroupMenu = createButtonGroup([
      {
        className: 'btn btn-primary mr-3 js-add',
        type: 'button',
        text: 'Добавить',
        title: 'Добавить новыый контакт',
      },
      {
        className: 'btn btn-danger js-del',
        type: 'button',
        text: 'Удалить/Редактировать',
        title: 'Редактировать существующий контакт',
      },
    ]);
    const table = createTable();
    const form = createForm();
    const footer = createFooter();

    header.headerContainer.append(logo);
    main.mainContainer.append(buttonGroupMenu.btnWrapper, table, form.overlay);
    // footer.footerContainer.innerHTML = 'Все права защищены &copy; Автор';
    footer.footerContainer.innerHTML = 'Все права защищены &copy; ' + title;
    app.append(header, main, footer);

    return {
      list: table.tbody,
      logo,
      btnAdd: buttonGroupMenu.btns[0],
      btnDel: buttonGroupMenu.btns[1],
      formOverlay: form.overlay,
      form: form.form,
      table,
    };
  };

  const createRow = ({name: firstname, surname, phone}) => {
    const tr = document.createElement('tr');
    tr.classList.add('trRow');
    // * добавляем hash код для id контакта
    tr.id = 'id' + hashCode(firstname + surname + phone);
    tr.title = firstname + surname + phone;

    const tdDel = document.createElement('td');
    tdDel.classList.add('delete');
    const buttonDel = document.createElement('button');
    buttonDel.classList.add('del-icon');
    buttonDel.title = 'Удалить этот контакт';
    const buttonRedact = document.createElement('button');
    buttonRedact.classList.add('edit-icon');
    buttonRedact.title = 'Редактировать этот контакт';
    // tdDel.style.display = 'flex';
    tdDel.append(buttonDel, buttonRedact);

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

    // const redactBtn = createButtonGroup([
    //   {
    //     className: 'btn btn-success ml-3 redact-btn',
    //     type: 'button',
    //     text: 'редактировать',
    //   },
    // ]);
    // const tdRedact = document.createElement('td');
    // tdRedact.classList.add('delete');
    // tdRedact.append(...redactBtn.btns);

    // tr.append(tdDel, tdName, tdSurname, tdPhone, tdRedact);
    tr.append(tdDel, tdName, tdSurname, tdPhone);

    return tr;
  };

  const renderContacts = (list, data) => {
    const allRows = data.map(createRow);
    // console.log('allRows renderContacts: ', allRows);
    list.append(...allRows);
    return allRows;
  };


  // * practice working lesson05
  const hoverRow = (allRow, logo) => {
    const text = logo.textContent;

    allRow.forEach(contact => {
      contact.addEventListener('mouseenter', (e) => {
        logo.textContent = 'Номер ' + contact.phoneLink?.textContent;
      });
      contact.addEventListener('mouseleave', () => {
        logo.textContent = text;
      });
    });
    return ;
  };

  // // * working lesson05 TEMP
  // const bubblingCapturing = () => {
  //   const btnAdd = document.querySelector('.js-add');
  //   const btnDel = document.querySelector('.js-del');
  //   const btnWrapper = document.querySelector('.btn-wrapper');
  //   const main = document.querySelector('main');
  //   const app = document.querySelector('#app');
  //   const body = document.querySelector('body');

  //   // const containersAll = document.querySelectorAll('.container');
  //   document.querySelectorAll('.container').forEach( (container, i) => {
  //     container.addEventListener('click', e => {
  //       console.log(e.target.closest('.container'), 'container numb: ' + i);
  //     });
  //   })
    
    
  //   btnAdd.addEventListener('click', (e) => {
  //     console.log('add');
  //   }, false);
  //   // * false default в обработчике - значит событие срабатывает на всплытие
  //   // * true - на погружение
  //   btnDel.addEventListener('click', (e) => {
  //     console.log('del');
  //   }, false);
  //   btnWrapper.addEventListener('click', (e) => {
  //     console.log('btnWrapper');
  //   }, false);
  //   main.addEventListener('click', (e) => {
  //     console.log('main');
  //   }, false);
  //   app.addEventListener('click', (e) => {
  //     console.log('app');
  //   }, false);
  //   body.addEventListener('click', (e) => {
  //     console.log('body');
  //   }, false);

  //   window.addEventListener('click', (e) => {
  //     console.log('window');
  //   });
  //   document.addEventListener('click', (e) => {
  //     console.log('document');
  //   });
  //   document.documentElement.addEventListener('click', (e) => {
  //     console.log('html documentElement');
  //   });

  //   return ;
  // }


  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const phonebook = renderPhonebook(app, title);

    // деструктуризируем переменные из объекта
    const {list, logo, btnAdd, btnDel, formOverlay, form, table} = phonebook;
    
    // без хеша
    console.log('data: ', JSON.stringify(data));
    // todo функционал here createHashData
    // добавляем id в массив к каждому объкту используем hash
    data.forEach((obj, index) => {
      let str = '';
      for (const key in obj) {
        str += '' + obj[key];
      }
      obj.id = 'hash' + hashCode(str);
    });
    console.log('data: ', data);


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
            cellDelete.classList.toggle('is-visible');
          });
        }
        // console.log('target', event.target);
      },
    };

    btnAdd.addEventListener('click', objEvent);
    btnDel.addEventListener('click', objEvent);


    list.addEventListener('click', e => {
      const target = e.target;
      // удалить ближайший ряд
      if (target.classList.contains('del-icon')) {
        const closestRow = target.closest('.trRow');
        console.log('Удалить', closestRow);
        closestRow.remove();
        return;
      }
      // редактировать ряд
      if (target.classList.contains('edit-icon')) {
        console.log('Редактировать', target);
        return;
      }
      console.log(target);
    });
    
    // * при клике на оверлай скрывем модалку
    formOverlay.addEventListener('click', (event) => {
      // отрабатываем клик по кнокпе close
      // if (event.target === form.querySelector('.close')) {
      //   formOverlay.classList.remove('is-visible');
      //   return;
      // }
      if (event.target.closest('.close')) {
        formOverlay.classList.remove('is-visible');
        return;
      }
      // блокируем клик по самой форме
      if (event.target.closest('.form')) {
        return;
      }
      formOverlay.classList.remove('is-visible');
    });
  };

  window.phonebookInit = init;
}
