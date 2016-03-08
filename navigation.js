export default class Menu {
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
}