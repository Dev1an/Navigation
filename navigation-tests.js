// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by navigation.js.
import {FlowRouter} from "meteor/kadira:flow-router"
import {Menu} from "meteor/devian:navigation"

Tinytest.add('Core - Newly created menu has no items', function (test) {
  const menu = new Menu()

  test.equal(menu.items().length, 0)
});

Tinytest.add('Core - New menu with route, contains menu', function(test) {
  const route = FlowRouter.route('/menu')
  const menu = new Menu({route})

  test.equal(menu.route, route)
})

