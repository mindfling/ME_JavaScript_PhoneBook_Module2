'use strict';

// // GLOBAL KEYS and DATA
// let data = [];
// const KEY = 'phone-test2';
const SORT_KEY = 'phone-sort3';


{
  // const {getContactHash} = require('./modules/hash');
  // let data = [];
  let {data} = require('./modules/serviceStorage');
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

    // читаем данные контактов из Хранилища
    data = getStorage(KEY);
    // обновляем хэши id контактов
    makeDataContactsHashes(data);
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

    // initial sorting
    for (const child of head.firstElementChild.children) {
      // ? child.classList.remove('ascending');
      // ? child.classList.remove('descending');
      // ? child.dataset.sortorder = '';
      if (child.dataset.sortby === sortInfo.sortby) {
        child.classList.add(sortInfo.sortorder);
        child.dataset.sortorder = sortInfo.sortorder; // flag
      }
    }

    data = sortDataBy(sortInfo.sortby, sortInfo.sortorder, data);
    // сначала удаляем из DOM
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
    deleteControl({btnDel, list, objEvent: objEventBtns});
    formControl({form, list, closeModal});
  };


  window.phonebookInit = init;
}
