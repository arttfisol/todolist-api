import _ from 'lodash'

export interface Task {
  id: string
  title: string
  desc: string
  is_done: boolean
  created_time: Date
}

class Cache {
  data: Task[] // in-memory database
  count: number

  constructor () {
    this.data = [] // initial value. If value isn't empty, must sort by created_time (desc)
    this.count = 1
  }

  get (id: string): Task | undefined {
    return _.find(this.data, (datum) => {
      return datum.id === id
    })
  }

  list (skip: number, limit: number): Task [] {
    return this.data.slice(skip, limit === 0 ? undefined : skip + limit)
  }

  create (payload: Task): void {
    const index = this.data.findIndex(datum => datum.created_time <= payload.created_time)
    if (index === -1) {
      this.data.push(payload)
    } else {
      this.data.splice(index, 0, payload)
    }
    ++this.count
  }

  update (payload: Task): void {
    const index = this.data.findIndex(datum => datum.id <= payload.id)
    if (index !== -1) {
      this.data.splice(index, 1, payload)
    }
  }

  remove (id: string): void {
    const index = this.data.findIndex(datum => datum.id <= id)
    if (index !== -1) {
      this.data.splice(index, 1)
    }
  }
}

export default new Cache()
