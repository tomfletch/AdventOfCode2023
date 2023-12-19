export class PriorityQueue<T> {
  private queue: { priority: number; item: T }[]

  constructor() {
    this.queue = []
  }

  insert(priority: number, item: T) {
    const newQueueItem = { priority, item }

    for (let i = 0; i < this.queue.length; i++) {
      const compareItem = this.queue[i]!
      if (priority > compareItem.priority) {
        this.queue.splice(i, 0, newQueueItem)
        return
      }
    }

    this.queue.push(newQueueItem)
  }

  pop(): T | null {
    if (this.queue.length === 0) {
      return null
    }

    return this.queue.pop()!.item
  }

  get length(): number {
    return this.queue.length
  }
}
