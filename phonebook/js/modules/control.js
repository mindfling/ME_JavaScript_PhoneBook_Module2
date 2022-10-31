// * control
// логика управления элементами

import {
  // KEY as storageDataKey,
  addContactData as setStorage,
  removeContactData as removeStorage,
  getContactData as getStorage,
} from './serviceStorage.js';

import {renderContacts} from './render.js';


export const hoverRow = (allRow, logo) => {
  // меняет заголовок Logo при наведении на соответствующий контакт
  const text = logo?.textContent;
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

export const modalControl = ({
  btnAdd,
  closeBtn,
  formOverlay,
  objEvent,
}) => {
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
  // возвращаем функции формы
  return {
    openModal,
    closeModal,
  };
};

export const deleteControl = ({
  data,
  btnDel,
  list,
  objEvent,
  logo,
}) => {
  // handleEvent obj клики по кнопкам Добавить и Удалить
  btnDel.addEventListener('click', objEvent);

  list.addEventListener('click', (e) => {
    const target = e.target;
    // клик по клетке del
    if (target.closest('.del-icon')) {
      // ряд по которому кликнули
      const targetRow = target.closest('.contact');
      // id контакта из ряда
      const phoneID = targetRow.id;
      console.log('Удаляем контакт with phone: ', phoneID);
      removeStorage(phoneID); // удаляем из хранилища
      // выводим в консоль то что у нас вышло
      if (objEvent.isShown) {
        const head = list.parentElement.firstElementChild;
        head.querySelector('.delete').classList.remove('is-visible');
        objEvent.isShown = false;
      }
      data = getStorage();
      // перерендериваем все
      // // renderContacts(list, data);
      // перендериваем и вешаем обработчик на каждый контакт
      const allRows = renderContacts(list, data);
      hoverRow(allRows, logo); // навешиваем слушателей hover при инициализации
      return;
    }
  });
};

export const formControl = ({
  form,
  list,
  closeModal,
  logo,
}) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // предотвращение действия submit
    const formData = new FormData(e.target); // данные из формы
    // формируем объект контакт из значений полей формы
    const newContact = Object.fromEntries(formData);
    setStorage(newContact);
    // добавляем в DOM на страницу
    // addContactPage(newContact, list);
    const data = getStorage();
    // перерендериваем все
    // renderContacts(list, data);
    const allRows = renderContacts(list, data);
    hoverRow(allRows, logo); // навешиваем слушателей hover при инициализации
    form.reset(); // сброс очистка формы
    closeModal(); // закрываем модалку
  });
};
