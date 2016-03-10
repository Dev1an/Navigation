Did you ever use [kadira's flowrouter](https://github.com/kadirahq/flow-router) for your app and wished it had a feature to automatically generate menu bars based on your FlowRouter routes and groups? That's just what this package does.

# Usage

## Installation

```sh
meteor add devian:navigation
```

## Create a menu

To create a menu, simply call `new Menu()`

```javascript
import {Menu} from 'meteor/devian:navigation'

const mainMenu = new Menu()
```

### Add routes as menu items

If you want to simultaneously define a route and add a corresponding menu item to your menu, use `Menu.route(...)`. It works exactly the same as [FlowRouter.route(...)](https://github.com/kadirahq/flow-router#routes-definition)

```javascript
mainMenu.route('/', {name: 'Home'})
mainMenu.route('/about', {name: 'About us'})
```

`Menu.route(...)` returns a *FlowRouter.Route* object but it also creates a corresponding menu item and adds this item to the menu. Navigation uses the route names as title for the menu items.

### Add groups as sub-menus 

Just like creating items with the `Menu.route(...)` method you can create a sub menu with `Menu.group(...)`.

`Menu.group()` works the same as [FlowRouter.group()](https://github.com/kadirahq/flow-router#group-routes)

```javascript
const products = mainMenu.group({
  prefix: '/products',
  name: 'Products'
})

products.route('/iPodCase', {name: 'iPod Case'}})
products.route('/iPhoneCase', {name: 'iPhone Case'}})
```

In addition to creating and returning a *FlowRouter.Group*, `Menu.group(...)` creates a new *Menu* and adds it as a submenu.

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

### Submenu routes

It is also possible to assign a route to a submenu. For example, consider the following menu structure:

-   About
-   Products
    -   Product A
    -   Product B

You might want to assign a route to the *Products* menu item that leads you to some overview page with all your products. This can be achieved by adding the `menuRoute` property to the options object in a `FlowRouter.route()` call and setting it to true.

```javascript
laptopAccessories.route('/overview', {menuRoute: true})
```

Note that this only works when you add a route to a *FlowRouter.Group*

### Retreive menu items

A menu consists of items. To retrieve them: call `Menu.items()`. This returns a list of *Item* objects.

An *Item* has the following structure:

-   `title` *String* — the title of the menu
-   `isActive()` *Boolean* — a reactive function that returns a *Boolean* representing the current state of the item

There are two types of items (they are subclasses of *Item*):

-   *RouteItem* is an item that is coupled to a route. It extends *Item* with the following properties:
    -   `route` *FlowRouter.Route* — the corresponding route
    -   `visit()` *void* — a method that will go to the corresponding route using `FlowRouter.go(…)`.
-   *MenuItem* is an item that is coupled to to another *Menu*. You can think of this as a "submenu".
    -   `menu` *Menu* — the corresponding submenu

## Render using spacebars

To render a menu in a UI, you can use the spacebars `#eachMenu` block tag, that's provided by this package.

```html
<body>{{> menuList mainMenu}}</body>

<template name="menuList">
    <ul>
        {{#eachMenu items}}
            <li>{{title}} {{#if isActive}}X{{/if}}:</li>
            {{> menuList link}}
        {{else}}
            <li class="route">
                {{title}}
                {{#if isActive}}X{{/if}}
            </li>
        {{/eachMenu}}
    </ul>
</template>
```

`#eachMenu` works like the `#each` block but it separates submenu items form normal items.

For each submenu in the list, the *main block* will be rendered. And for the normal menu items, the *else block*  will be rendered.

## Advanced API for fine grained control

The `route` and `group` helpers on the `Menu` objects are nice and easy to use but if you want to have more control over your menu's and their coupling with FlowRouter routes, you may can also use the underlying API.

### Manually adding menu items

#### Adding *route* items

You can add a route as a menu item using `Menu.addItem(link[, title])`

-   **link** *FlowRouter.Route* The route you want to add
-   **title** *String* (optional) The title of your new menu item. If omitted the name of the route will be used

Example:

```javascript
const mainMenu = new Menu()
const homeRoute = FlowRouter.route('/')

mainMenu.addItem(homeRoute, 'Home')
```

#### Adding *submenus*

You can add a menu as an item of another menu using `Menu.addItem(link, title)`.

-   **link** *Menu* The menu you want to add
-   **title** *String* The title of your new menu item.

Example:

```javascript
const mainMenu = new Menu()
const subMenu = new Menu()

mainMenu.addItem(subMenu, 'Products')
```
##### Submenu routes

To create a submenu with a route, supply the route as a property with key `route` to the first argument of the menu constructor.

```javascript
const myRoute = FlowRouter.route('/submenu/overview')
const navigatableSubMenu = new Menu({
  route: myRoute
})
```
