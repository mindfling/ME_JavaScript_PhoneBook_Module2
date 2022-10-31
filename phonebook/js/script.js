// * PhoneBook module2lesson10

import {
  // addContactData as setStorage,
  // removeContactData as removeStorage,
  getContactData as getStorage,
} from './modules/serviceStorage.js';

import {
  hoverRow,
  modalControl,
  deleteControl,
  formControl,
} from './modules/control.js';

import {
  renderPhonebook,
  renderContacts,
} from './modules/render.js';


{
  // * MAIN INIT *
  const init = (selectorApp, title) => {
    // корневой селектор приложения
    const app = document.querySelector(selectorApp);
    // читаем данные контактов из Хранилища
    // // const data = getContactData(); // или
    const data = getStorage();
    console.log('data in localstorage: ', data);

    const {
      head, // ? table thead for sort
      list, // table tbody
      logo,
      btnAdd,
      btnDel,
      formOverlay,
      closeBtn,
      form,
    } = renderPhonebook(app, title);


    // * ФУНКЦИОНАЛ ЗДЕСЬ

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

    const allRow = renderContacts(list, data);

    hoverRow(allRow, logo); // навешиваем слушателей hover при инициализации

    const {closeModal} = modalControl({
      formOverlay,
      btnAdd,
      closeBtn,
      objEvent: objEventBtns,
    });

    deleteControl({
      data,
      btnDel,
      list,
      logo,
      objEvent: objEventBtns,
    });

    formControl({
      form,
      list,
      logo,
      closeModal,
    });
  };


  window.phonebookInit = init;
}
