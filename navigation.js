const Navigation = {
    group() {
        const group = FlowRouter.group(...arguments)
        group.options.menu = new Menu()
        return group
    }
}

export default Navigation

export class Menu {
    constructor() {
        this._items = []
    }

    addItem(link, title = link.options.name) {
        check(title, String)
        check(link, Match.OneOf(FlowRouter.Route, Menu))
        this._items.push({link, title})
    }

    items()     { return this._items }
    item(index) { return this._items[index] }

    group() {
        const group = FlowRouter.group(...arguments)
        group.options.menu = new Menu()
        this.addItem(group.options.menu, group.options.name)
        return group
    }

    route() {
        const route = FlowRouter.route(...arguments)
        this.addItem(route)
        return route
    }
}

FlowRouter.onRouteRegister(addRouteToMenu)
function addRouteToMenu(routeInfo) {
    const route = FlowRouter._routes.find(route => route.pathDef == routeInfo.pathDef)

    if (route.group != undefined){
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
