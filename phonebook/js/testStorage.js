'use strict';

console.log('test Session');
const ssKey = 'testa';
sessionStorage.setItem(ssKey, 12341234212424);

const ss = sessionStorage.getItem(ssKey);
console.log('obtain sstorage', ss);


console.log();


console.log('test Local');
localStorage.setItem('test1', 12341234);
localStorage.setItem('test2', 123422);
localStorage.setItem('test1', 'aoeu');


/*
 * DEMO *
 */
const color = document.querySelector('.demo');
const block = document.querySelector('.demo__storage');
console.log('color: ', color);
console.log('block: ', block);

const textSize = document.querySelector('#session-font');
const text = document.querySelector('.demo__text');
console.log('textSize: ', textSize);
console.log('text: ', text);


color.addEventListener('change', e => {
  const target = e.target;
  console.log(target.value);
  block.style.backgroundColor = target.value;
});

textSize.addEventListener('change', e => {
  const target = e.target;
  console.log(target.value);
  text.style.fontSize = target.value + 'px';
});

const init = () => {
  console.log('init app');
  // todo all what Maksim do in Lesson7
  return;
};

init();
