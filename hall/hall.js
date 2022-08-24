'use strict';

{
  const app = document.querySelector('#app');
  
  let countArea = 0; // счетчик наших залов
  let countSeat = 0; 

  const createSeat = (x, y) => {
    const seat = document.createElement('div');
    seat.classList.add('seat');
    seat.dataset.x = x;
    seat.dataset.y = y;
    seat.title = `Ряд ${y}, Место ${x}`;
    // seat.textContent = ++countSeat;
    // seat.textContent = '' + y + ' ' + x;
    return seat;
  }

  const createLine = (x, y) => {
    const line = document.createElement('div');
    line.classList.add('line');
    for (let i = 1; i <= x; i++) {
      line.append(createSeat(i, y));
    }
    
    return line;
  }
  
  const createArea = (x, y) => {
    countSeat = 0;
    const area = document.createElement('div');
    area.title = 'Залл номер ' + ++countArea;
    area.classList.add('area');
    for (let j = 1; j <= y; j++) {
      area.append(createLine(x, j));
    }
    
    return area;
  }

  // создаем залы
  app.append(createArea(3, 2));
  app.append(createArea(6, 8));
  app.append(createArea(5, 7));

}