import assert from 'assert'
import Alt from '../dist/alt-with-runtime'

let alt = new Alt()

let actions = alt.generateActions('fire', 'nothing')

class MyStore {
  constructor() {
    this.foo = 1
    this.bindListeners({ increment: actions.FIRE, nothing: actions.NOTHING })
  }

  increment() {
    this.retVal = this.setState({ foo: this.foo + 1 })
    return this.retVal
  }

  nothing() {
    this.setState()
  }
}

let myStore = alt.createStore(MyStore)

export default {
  'using setState to set the state'() {
    actions.fire()

    let changes = 0
    let fart = () => {
      changes += 1
      assert.equal(changes, 1, 'listen was fired once')
    }

    myStore.listen(fart)

    assert.equal(myStore.getState().foo, 2, 'foo was incremented')
    assert.equal(myStore.getState().retVal, false, 'return value of setState is false')

    myStore.unlisten(fart)

    // calling set state without anything doesn't make things crash and burn
    actions.nothing()
  }
}
