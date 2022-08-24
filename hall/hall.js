'use strict';

{
  const app = document.querySelector('#app');
  
  let countArea = 0; // счетчик наших залов

  const createSeat = (y, i) => {
    const seat = document.createElement('div');
    seat.classList.add('seat');
    seat.dataset.seatNumber = i;
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

}