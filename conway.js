'use strict';

const field = {
  FIELD_NODE: document.getElementById('field'),
  FIELD_ARRAY: null,
  
  WIDTH: 0,
  HEIGHT: 0,
  
  interval: null,
  
  generate(width, height) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.FIELD_ARRAY = new Array(height);
    
    for(let j = 0; j < height; j++) {
      this.FIELD_ARRAY[j] = new Array(width);
      for(let i = 0; i < width; i++) {
        this.FIELD_ARRAY[j][i] = new Cell(i, j);
        if(Math.random() < .5) this.FIELD_ARRAY[j][i].makeAlive();
      }
    }
    
    this.display();
  },
  
  display(field) {
    this.FIELD_NODE.innerHTML = '';

    this.FIELD_ARRAY.forEach(row => {
      const rowNode = document.createElement('div');
      rowNode.classList.add('row');

      row.forEach(cell => rowNode.appendChild(cell.node));

      this.FIELD_NODE.appendChild(rowNode);
    });
  },
  
  getCell(x, y) {
    if(x < this.WIDTH && x >= 0 && y < this.HEIGHT && y >= 0)
      return this.FIELD_ARRAY[y][x];
    else
      throw Error('There is no cell with these coordinates!');
  },
  
  startGame(interval) {
    this.interval = setInterval(this.iteration, interval);
  },
  
  stopGame() {
    clearInterval(this.interval);
  },
  
  checkLiveExistence() {
    let result = false;
    this.FIELD_ARRAY.forEach(row => row.forEach(cell => {if(cell.alive) result = true;}));
    return result;
  },
  
  calculateCountOfSiblings() {
    field.FIELD_ARRAY.forEach(row => row.forEach(cell => {
      cell.countOfSiblings = cell.getCountOfAliveSiblings();
    }));
  },
  
  performFirstRule() {
    field.FIELD_ARRAY.forEach(row => row.forEach(cell => {
      if(cell.countOfSiblings == 3) cell.makeAlive();
    }));
  },
  
  performSecondRule() {
    field.FIELD_ARRAY.forEach(row => row.forEach(cell => {
      if(cell.countOfSiblings < 2 || cell.countOfSiblings > 3) cell.kill();
    }));
  },
  
  iteration() {
    if(field.checkLiveExistence()) {
      field.calculateCountOfSiblings();
      
      field.performFirstRule();
      field.performSecondRule();
    }
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alive = 0;
    this.node = document.createElement('div');
    this.node.classList.add('cell');
    let cellObj = this;
    this.node.onclick = function() {
      if(cellObj.alive) 
        cellObj.kill();
      else
        cellObj.makeAlive();
    };
  }
  
  makeAlive() {
    if(!this.alive) {
      this.alive = 1;
      this.node.classList.add('alive');
    }
  }
  
  kill() {
    if(this.alive) {
      this.alive = 0;
      this.node.classList.remove('alive');
    }
  }
  
  getCountOfAliveSiblings() {
    let count = 0;
    const area = {
      top: (this.y) ? this.y - 1 : 0,
      left: (this.x) ? this.x - 1 : 0,
      bottom: (this.y < field.HEIGHT - 1) ? this.y + 1 : field.HEIGHT - 1,
      right: (this.x < field.WIDTH - 1) ? this.x + 1 : field.WIDTH - 1
    }; 
    
    for(let j = area.top; j <= area.bottom; j++)
      for(let i = area.left; i <= area.right; i++)
        if(i != this.x || j != this.y) count += field.getCell(i, j).alive;
    
    return count;
  }
}


//main
field.generate(100, 100);

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
startButton.onclick = field.startGame.bind(field, 40);
stopButton.onclick = field.stopGame.bind(field);