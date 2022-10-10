'use strict';

const {
  // createContainer,
  // createHeader,
  // createLogo,
  // createMain,
  // createButtonGroup,
  // createTable,
  // createForm,
  // createFooter,
  createRow,
} = require('./createElement');

// let {data} = require('./serviceStorage');
// const {data} = require('./serviceStorage');

const {
  KEY,
  // getStorage,
  setStorage,
  // makeDataContactsHashes,
  removeStorage,
  getStorage,
} = require('./serviceStorage');

let {data} = require('./serviceStorage');

const {
  renderContacts,
} = require('./render');

// добавляем на каждый ряд слушателей
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

const deleteControl = ({data, btnDel, list, objEvent}) => {
  // handleEvent obj клики по кнопкам Добавить и Удалить
  btnDel.addEventListener('click', objEvent);

  list.addEventListener('click', (e) => {
    const target = e.target;
    // клик по клетке del
    if (target.closest('.del-icon')) {
      // ряд по которому кликнули
      const targetRow = target.closest('.contact');
      // id контакта из ряда
      const dataID = targetRow.id;
      // deteleDataContact(dataID);
      data = removeStorage(KEY, dataID); // удаляем из хранилища
      // targetRow.remove(); // удаляем строку из DOM
      // выводим в консоль то что у нас вышло
      console.log('del row from data: ', data);

      // todo скрываем .delete в заголовке таблицы
      if (objEvent.isShown) {
        const head = list.parentElement.firstElementChild;
        head.querySelector('.delete').classList.remove('is-visible');
        objEvent.isShown = false;
      }

      renderContacts(list, data);
      return;
    }
  });
};

// добавляем новую строку с контактом в тело таблицы table.tbody
const addContactPage = (contact, list) => {
  list.append(createRow(contact));
};

const formControl = ({form, list, closeModal}) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // данные из формы
    // формируем объект контакт из значений полей формы
    const newContact = Object.fromEntries(formData);
    // записываем в локальное хранилище
    setStorage(KEY, newContact);
    // добавляем в DOM на страницу
    // addContactPage(newContact, list);
    data = getStorage(KEY);
    renderContacts(list, data);

    form.reset();
    closeModal();
  });
};


module.exports = {
  hoverRow,
  modalControl,
  deleteControl,
  formControl,
};
