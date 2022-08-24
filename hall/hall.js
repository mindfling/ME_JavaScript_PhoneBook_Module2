'use strict';

{
  const app = document.querySelector('#app');
  
  let countArea = 0; // счетчик наших залов
  let countSeat = 0;

  const createSeat = (y, i) => {
    const seat = document.createElement('div');
    seat.classList.add('seat');
    seat.dataset.seatNumber = ++countSeat;
    // seat.dataset.x = x;
    // seat.dataset.y = y;
    // seat.title = `Ряд ${y}, Место ${x}`;
    // seat.textContent = ++countSeat;
    // seat.textContent = '' + y + ' ' + x;
    return seat;
  }

  const createLine = (countLine, y) => {
    const line = document.createElement('div');
    line.classList.add('line');
    line.dataset.lineNumber = countLine;

    for (let i = 1; i <= y; i++) {
      line.append(createSeat(i, y));
    }
    
    return line;
  }
  
  const createArea = (x, y) => {
    countArea++;
    countSeat = 0;
    const area = document.createElement('div');
    area.classList.add('area');
    area.dataset.areaNumber = countArea;
    // area.title = 'Залл номер ' + ++countArea;

    for (let i = 1; i <= x; i++) {
      area.append(createLine(i, y));
    }
    
    return area;
  }

  // создаем залы
  app.append(createArea(5, 6));
  app.append(createArea(8, 6));
  app.append(createArea(6, 6));


  // * вешаем слушатель ДЕЛЕГИРУЕМ
  app.addEventListener('click', (e) => {
    const target = e.target;
    if(target.classList.contains('seat')) {
      console.log('target.dataset.seatNumber: ', target.dataset.seatNumber);
      // target.style.opacity = 0.4;
      target.style.backgroundColor = 'tomato';
      const seat = target.dataset.seatNumber;
      const line = target.closest('.line').dataset.lineNumber;
      const area = target.closest('.area').dataset.areaNumber;
      console.log('Залл ' + area + ' ряд ' + line + ' место ' + seat);
      alert('Залл ' + area + ' ряд ' + line + ' место ' + seat);
      return;
    }
    console.log('target: ', target);
  })

}