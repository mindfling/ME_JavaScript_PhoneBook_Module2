'use strict';

// * js module using CJS for hash
//  возвращает hashCode по строке str
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// возвращает сгенерированый hash id для контакта
// учитывая имя поля id
const getContactHash = (contact = {}) => {
  const hashID = Object.entries(contact)
      .reduce((accum, curr, index, arr) => {
        const currName = curr[0];
        const currVal = curr[1];
        if (currName === 'id') {
          // поле с именем id не учитывается!
          return accum;
        } else {
          return `${accum}x${hashCode(currVal).toString(32)}`;
        }
      },
      'id');
  return hashID;
};

// * экспортируем в составе модуля
module.exports = {
  getContactHash,
};
