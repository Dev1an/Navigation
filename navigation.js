const Navigation = {
    group() {
        const group = FlowRouter.group(...arguments)
        group.options.menu = new Menu()
        return group
    }
}

export default Navigation

export class Menu {
    constructor({route} = {}) {
        this._items = []
        this._activeItems = 0
        this._coupledItems = []

        if (route instanceof FlowRouter.Route)
            this.route = route
    }

    addItem(link, title) {
        var item
        if      (link instanceof FlowRouter.Route) item = new RouteItem(link, title)
        else if (link instanceof Menu)             item = new MenuItem(link,  title)
        else if (link instanceof Item)             item = link

        this._items.push(item)
        item.parentMenu = this
    }

    items()     { return this._items.slice(0) }
    item(index) { return this._items[index] }

    _increaseActiveItems() {
        if (++this._activeItems > 0 && this._coupledItems.length > 0)
            for (let item of this._coupledItems) item.enter()
    }

    _decreaseActiveItems() {
        if (--this._activeItems == 0 && this._coupledItems.length > 0)
            for (let item of this._coupledItems) item.exit()
    }

    group() {
        const result = FlowRouter.group(...arguments)
        result.options.menu = new Menu()
        this.addItem(result.options.menu, result.options.name)
        return result
    }

    route() {
        const result = FlowRouter.route(...arguments)
        this.addItem(result)
        return result
    }
}

class Item {
    constructor(title) {
        check(title, Match.OneOf(String, Match.Where(x=> (typeof x == 'function') )))
        this.title = title
        this.parentMenu = undefined

        this._isActive = new ReactiveVar(false) //TODO check current route
        this.isActive = () => this._isActive.get()
    }

    enter() {
        this._isActive.set(true)
        if (this.parentMenu)
            this.parentMenu._increaseActiveItems()
    }

    exit() {
        this._isActive.set(false)
        if (this.parentMenu)
            this.parentMenu._decreaseActiveItems()
    }

    visit() {
        if (this.hasRoute())
            FlowRouter.go(this.route.path)
        else
            throw Meteor.Error('This menu item has no route')
    }

    hasRoute() {return this.route instanceof FlowRouter.Route}

    _coupleTriggers(route) {
        if (Meteor.isClient) {
            route._triggersEnter.push(() => this.enter())
            route._triggersExit.push(() => this.exit())
        }
    }
}

export class RouteItem extends Item {
    constructor(route, title = route.options.name) {
        super(title)
        check(route, FlowRouter.Route)
        this.route = route

        this._coupleTriggers(route)
    }
}

export class MenuItem extends Item {
    constructor(menu, title) {
        super(title)
        check(menu, Menu)
        this.menu = menu

        if (menu.route instanceof FlowRouter.Route)
            this._coupleRoute(menu.route)

        menu._coupledItems.push(this)
    }

    _coupleRoute(route) {
        this.route = route
        this._coupleTriggers(this.route)
    }
}

FlowRouter.onRouteRegister(addRouteToMenu)
function addRouteToMenu(routeInfo) {
    const route = FlowRouter._routes.find(route => route.pathDef == routeInfo.pathDef)

    if (route.options.menuRoute) {
        createMenuForGroup(route.group)
        route.group.options.menu.route = route
        for (let item of route.group.options.menu._coupledItems)
            item._coupleRoute(route)
    }
    else if (route.group != undefined){
        createMenuForGroup(route.group)
        route.group.options.menu.addItem(route)
    }
}

function createMenuForGroup(group) {
    if (!(group.options.menu instanceof Menu)) {
        group.options.menu = new Menu()
        if (group.parent != undefined) {
            createMenuForGroup(group.parent)
            group.parent.options.menu.addItem(group.options.menu, group.options.name)
        }
    }
}