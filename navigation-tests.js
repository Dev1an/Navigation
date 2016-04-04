import { chai } from 'meteor/practicalmeteor:chai'

// Import and rename a variable exported by navigation.js.
import {FlowRouter} from "meteor/kadira:flow-router"
import {Menu} from "meteor/devian:navigation"

describe('New menu', function() {
  it('should have no items', function() {
    const menu = new Menu()
    chai.assert.equal(menu.items().length, 0)
  })
})

describe('New menu with route', () => {
  it('should contain route', () => {
  const route = FlowRouter.route('/menu')
  const menu = new Menu({route})

  chai.assert.equal(menu.route, route)
  })
})