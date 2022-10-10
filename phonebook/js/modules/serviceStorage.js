'use strict';

// GLOBAL KEYS and DATA
let data = [];
const KEY = 'phone-test2';
// const SORT_KEY = 'phone-sort3';

const {getContactHash} = require('./hash');

// читает и возвращает данные data из Хранилища
const getStorage = (storageKey) => {
  let result = JSON.parse(localStorage.getItem(KEY));
  if (!Array.isArray(result)) {
    result = [];
  }
  return result;
};

// читает данные из хранилища добавляет к ним контакт
// и снова перезависывает данные в хранилище
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
  // обновляем данные в хранилище
  localStorage.setItem(storageKey, JSON.stringify(data));
};

//  генерирует добавляет .id для каждого контакта объкта в массиве data
const makeDataContactsHashes = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data.map((contact, index) => {
      contact.id = getContactHash(contact);
    });
  } else {
    return [];
  }
};

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
};


// * exports
module.exports = {
  data,
  KEY,
  getStorage,
  setStorage,
  makeDataContactsHashes,
  removeStorage,
};
