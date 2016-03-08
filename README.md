# Usage

## Installation

```sh
meteor add devian:navigation
```

## Create a menu

To create a menu simply call `new Menu()`

```javascript
import {Menu} from 'meteor/navigation'

const mainMenu = new Menu()
```

A menu consists of menu-items. To get the list of items in a menu, call `Menu.items()`

### Add routes as menu items

If you want to simultaneously define a route and add a corresponding menu item to your menu, use `Menu.route(...arguments)`. It works exactly the same as [FlowRouter.route(...arguments)](https://github.com/kadirahq/flow-router#routes-definition)

```javascript
mainMenu.route('/', {name: 'Home'})
mainMenu.route('/about', {name: 'About us'})
```

`Menu.route(...arguments)` returns a `FlowRouter.Route` object but it also creates a corresponding menu item and adds this item to the menu. Navigation uses the route names as title for the menu items.

### Add groups as sub-menus 

Just like creating items with the `Menu.route()` method you can create a sub menu with `Menu.group()`.

`Menu.group()` works the same as [FlowRouter.group()](https://github.com/kadirahq/flow-router#group-routes)

```javascript
const products = mainMenu.group({
  prefix: '/products',
  name: 'Products'
})

products.route('/iPodCase', {name: 'iPod Case'}})
products.route('/iPhoneCase', {name: 'iPhone Case'}})
```

In addition to creating and returning a `FlowRouter.Group`, `Menu.group()` creates a new `Menu` and adds it as a submenu.

Routes that are added to this group will trigger the creation of new menu-items that will be added to its corresponding submenu.

As explained in the FlowRouter manual, a group can also contain other groups. Nested groups won't trigger the creation of submenus unless you add routes to these nested groups.

```javascript
const laptopAccessories = products.group({
  prefix: '/laptopAccessories',
  name: 'Laptop accessories'
})
// You need to add routes to this group if you want it to automatically appear in the menu
laptopAccessories.route('/macbook-pro', {name: 'MacBook Pro'})
laptopAccessories.route('/macbook-air', {name: 'MacBook Air'})
```

