'use strict';


// * sortDataBy
const sortDataBy = (sortby = '', sortorder = '', data) => {
  console.log('before sorted data: ', data);
  let sorted = [];
  switch (sortby) {
    case 'by-name':
      // сортировка по имени
      sorted = data.sort((prev, next) => {
        // ascending a, b, c, .. z order
        let namePrev = prev?.name;
        let nameNext = next?.name;
        if (sortorder === 'descending') {
          // descending z, y, x, .. a order
          namePrev = next?.name;
          nameNext = prev?.name;
        }
        if (namePrev > nameNext) {
          return 1;
        } else if (namePrev < nameNext) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case 'by-surname':
      // сортировка по фамилии
      sorted = data.sort((prev, next) => {
        // eslint-disable-next-line max-len
        const surnamePrev = (sortorder === 'ascending') ? prev.surname : next.surname;
        // eslint-disable-next-line max-len
        const surnameNext = (sortorder === 'ascending') ? next.surname : prev.surname;
        if (surnamePrev > surnameNext) {
          return 1;
        } else if (surnamePrev < surnameNext) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case 'by-phone':
      // сортировка по номеру телефона
      sorted = data.sort((prev, next) => {
        let prevPhone = '';
        let nextPhone = '';
        if (sortorder === 'ascending') {
          prevPhone = prev.phone;
          nextPhone = next.phone;
        } else {
          prevPhone = next.phone;
          nextPhone = prev.phone;
        }
        if (prevPhone > nextPhone) {
          return 1;
        } else if (prevPhone < nextPhone) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    default:
      console.log('по умолчанию');
      break;
  }
  // return data;
  return sorted;
};

module.exports = {
  sortDataBy,
};
