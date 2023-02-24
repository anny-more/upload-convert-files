import {GetData} from '../middleware/files.controller';

class Queue {
  queue: GetData[];

  constructor() {
    this.queue = [];
  };

  addTask = (item: GetData) => {
    item.status = 'wait to convert';
    this.queue.push(item);
  };
  doTask = () => {
    while (this.queue.length) {
      const item = this.queue.pop();
      item!.convert();
    }
  };
  doQueue = () => {
    this.doTask();
    setTimeout(this.doQueue, 1000);
  };
}

export const mainQueue = new Queue();
mainQueue.doQueue();
