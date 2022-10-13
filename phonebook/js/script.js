import {
  dataStorage,
  KEY,
  getStorage,
  makeDataContactsHashes,
} from './modules/serviceStorage.js ';
import {
  hoverRow,
  modalControl,
  deleteControl,
  formControl,
} from './modules/control.js';

let data = dataStorage['data']; // так передаем ссылку на константу data
import {renderPhonebook, renderContacts} from './modules/render.js';
// import data from './modules/serviceStorage.js';

import {sortDataBy} from './modules/sort.js';

const SORT_KEY = 'phone-sort3';

{
  // * MAIN INIT *
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);

    console.log('begin data: ', data);
    // читаем данные контактов из Хранилища
    data = getStorage(KEY);
    console.log('getStorage data: ', data);
    // обновляем хэши id контактов
    data = makeDataContactsHashes(data);

    // читаем данные о сортировке
    let sortInfo = {};
    // let sortInfo = JSON.parse(localStorage.getItem(SORT_KEY)); //

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
    // init sort params: sortorder sortby
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
        console.log('начальные значения в хранилище sortInfo:', sortInfo);

        if (objEventBtns.isShown) {
          console.log('delete скрываем');
          head.querySelector('.delete').classList.remove('is-visible');
          objEventBtns.isShown = false;
        }

        // осктльные в таблице просто перерендерятся
        data = getStorage(KEY);
        // сортируем
        const sortData = sortDataBy(sortInfo.sortby, sortInfo.sortorder, data);
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
