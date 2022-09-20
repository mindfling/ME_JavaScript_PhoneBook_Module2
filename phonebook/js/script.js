'use strict';

// const origin = []; // перенести в отдельный файл

{
  let data = [];

  // * Returns a hash code from a string use it for hosh contocts
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

  // * sortDataBy
  const sortDataBy = (order) => {
    let sorted = [];
    switch (order) {
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
        <th class="table__cell_head" data-sortby="by-name" title="Сортировать по Имени">Имя</th>
        <th class="table__cell_head" data-sortby="by-surname" title="Сортировать по Фамилии">Фамилия</th>
        <th class="table__cell_head" data-sortby="by-phone" title="Сортировать по номеру телефона">Телефон</th>
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

  const closeAllDelete = (parent) => {
    // функция скрывает все видимые элементы .delete
    const dellCellAll = parent.querySelectorAll('.delete');
    dellCellAll.forEach(cell => {
      // все видимые .delete.is-visible элементы делаем невидимыми
      cell.classList.remove('is-visible');
    });
    return;
  };


  // * MAIN INIT * //
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

    const dataJSON = JSON.stringify(data);
    console.log('dataJSON: ', dataJSON);

    sessionStorage.setItem('phone1', dataJSON);


    data.forEach((contact, index, arr) => {
      const contactID = contact.id;
      console.log('contact.id: ', index, contactID);
      const contactJSON = JSON.stringify(contact);
      console.log('contactJSON: ', contactJSON);
      localStorage.setItem('phone_' + index + '_' + contactID, contactJSON);
    });


    const {list, logo, btnAdd, btnDel, formOverlay, closeBtn, form} = phonebook;

    // todo ФУНКЦИОНАЛ ЗДЕСЬ

    const allRow = renderContacts(list, data);

    hoverRow(allRow, logo);

    // можно использовать объект событий
    const objEvent = {
      visibleFlag: false,
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
          if (this.visibleFlag) {
            dellCellAll.forEach(cell => {
              // все видимые .delete.is-visible элементы делаем невидимыми
              this.visibleFlag = false;
              cell.classList.remove('is-visible');
            });
          } else {
            dellCellAll.forEach(cell => {
              // все невидимые .delete элем делаем видимыми
              cell.classList.add('is-visible');
              this.visibleFlag = true;
            });
          }
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

      if (objEvent.visibleFlag) {
        // если есть нескрытые элементы, то при любом клике
        // todo сразу же скрываем все видимые .delete элем
        closeAllDelete(list.parentElement);
        objEvent.visibleFlag = false;
        console.log('Скрываем элементы при открытом модальном окне');
      } else {
        // если нет открытых элементов
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
      }
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

    // клик по заголовкам таблицы Имя Фамилия Телефон
    list.parentElement.addEventListener('click', e => {
      const target = e.target;

      if (e.target.closest('.table__cell_head')) {
        // todo сразу же скрываем все видимые .delete элем
        closeAllDelete(list.parentElement);
        objEvent.visibleFlag = false;
        // порядок сортировки
        const order = target.dataset?.sortby;
        // сортируем
        const sortData = sortDataBy(order);

        // * clearContactList очищаем список контактов в DOM
        while (list.lastChild) {
          list.lastChild.remove();
        }
        // * перерисовка обновленного списка контактов
        renderContacts(list, sortData);
      }
    });
  };


  window.phonebookInit = init;
}
