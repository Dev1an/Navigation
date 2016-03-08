// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by navigation.js.
import {FlowRouter} from "meteor/kadira:flow-router"
import {Menu} from "meteor/devian:navigation"

Tinytest.add('navigation - addItem registers a FlowRouter route', function (test) {
  const name = 'My Page'
  const myPageRoute = FlowRouter.route('/myPage', {name})
  const mainMenu = new Menu()

  mainMenu.addItem(myPageRoute)

  test.equal(mainMenu.item(0).link,    myPageRoute)
  test.equal(mainMenu.item(0).title, name)
});
