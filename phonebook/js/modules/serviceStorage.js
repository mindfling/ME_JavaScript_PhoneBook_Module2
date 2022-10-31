export const KEY = 'phonebook9';

/*
* maks
export const getContactData = () => (localStorage.getItem(KEY) ?
JSON.parse(localStorage.getItem(KEY)) : []);
*/

// получаем текущие данные из хранилища
export const getContactData = () => {
  const storageData = localStorage.getItem(KEY);
  return (storageData ? JSON.parse(storageData) : []);
};

// сохраняем данные обратно в хранилище
export const setContactData = (data) =>
  localStorage.setItem(KEY, JSON.stringify(data));

// добавляем контакт к данным
export const addContactData = (contact) => {
  const data = getContactData(KEY);
  data.push(contact);
  setContactData(data);
};

// удаляем контакт из хранилища по номеру телефона
export const removeContactData = phone => {
  const data = getContactData(KEY);
  const newData = data.filter(item => item.phone !== phone); // фильтруем
  setContactData(newData);
};
