function GenerateID() {
    let array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    let id = '';
    array.forEach(function (s) {
        let z = s.toString(16);
        if (z.length == 1) {
            z = '0' + z;
        }
        id += z;
    });
    return id;
}
;
class Queue {
    constructor() {
        this.queue = [];
        this.offset = 0;
    }
    getLength() {
        return (this.queue.length - this.offset);
    }
    isEmpty() {
        return (this.queue.length == 0);
    }
    enqueue(item) {
        this.queue.push(item);
    }
    dequeue() {
        // if the queue is empty, return immediately
        if (this.queue.length == 0)
            return undefined;
        // store the item at the front of the queue
        let item = this.queue[this.offset];
        // increment the offset and remove the free space if necessary
        if (++this.offset * 2 >= this.queue.length) {
            this.queue = this.queue.slice(this.offset);
            this.offset = 0;
        }
        // return the dequeued item
        return item;
    }
    peek() {
        return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
    }
}
