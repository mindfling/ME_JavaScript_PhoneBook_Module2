'use strict';

// GLOBAL KEYS and DATA
let data = [];
const KEY = 'phone-test';
// const KEY = 'phone-test2';
// const SORT_KEY = 'phone-sort3';

const {
  getContactHash,
} = require('./hash');

// читает и возвращает данные data из Хранилища
const getStorage = (storageKey) => {
  let result = JSON.parse(localStorage.getItem(KEY));
  if (!Array.isArray(result)) {
    result = [];
  }
  return result;
};

// читает данные из хранилища добавляет к ним контакт
const setStorage = (storageKey, contact = {}) => {
  // читаем текущие данные
  data = getStorage(KEY);
  // проверяем пустой ли и масив ли вообще
  if (!Array.isArray(data)) {
    data = [];
  }
  // проверка на имя полей name, surname, phone
  if (contact.name === undefined) {
    contact.name = '';
  }
  if (contact.surname === undefined) {
    contact.surname = '';
  }
  if (contact.phone === undefined) {
    contact.phone = '';
  }
  // дабавляем хэш
  if (contact.id === undefined) {
    contact.id = getContactHash(contact);
  }
  // дабавляем контакт в data
  data.push(contact);
  // и снова перезависывает данные в хранилище
  // обновляем данные в хранилище
  localStorage.setItem(storageKey, JSON.stringify(data));
};

// читаем данные удаляем обновляем и перезаписываем
const removeStorage = (storageKey, id) => {
  // читаем текущие данные
  data = getStorage(KEY);
  // удаляем из массива контакт с этим id
  data.forEach((contact, index, arr) => {
    if (contact.id === id) {
      data.splice(index, 1);
    }
  });
  // сохраняем обратно в хранилище
  localStorage.setItem(storageKey, JSON.stringify(data));
  return data;
};

//  генерирует добавляет .id для каждого контакта объкта в массиве data
// добавляет хэши в массив возвращает и перезаписывает в хранилище
const makeDataContactsHashes = (data) => {
  let result;
  if (Array.isArray(data) && data.length > 0) {
    result = data.map((contact, index) => {
      contact.id = getContactHash(contact);
      return contact;
    });
  } else {
    result = [];
  }
  // также сохраняем в хранилище
  localStorage.setItem(KEY, JSON.stringify(result));
  return result;
};


// * exports
module.exports = {
  data,
  KEY,
  getStorage,
  setStorage,
  removeStorage,
  makeDataContactsHashes,
};
