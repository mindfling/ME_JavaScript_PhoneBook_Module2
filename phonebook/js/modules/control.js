import {createRow} from './createElement.js';
import {
  KEY,
  setStorage,
  removeStorage,
  getStorage,
} from './serviceStorage.js';

let data = [];

import {renderContacts} from './render.js';

export const hoverRow = (allRow, logo) => {
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

export const modalControl = ({btnAdd, formOverlay, closeBtn, objEvent}) => {
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
  // клик на кнопку Закрыть модалку
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

export const deleteControl = ({data, btnDel, list, objEvent}) => {
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
      data = removeStorage(KEY, dataID); // удаляем из хранилища
      // выводим в консоль то что у нас вышло
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

export const addContactPage = (contact, list) => {
  list.append(createRow(contact));
};

export const formControl = ({form, list, closeModal}) => {
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
