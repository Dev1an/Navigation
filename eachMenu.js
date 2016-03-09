import {Menu} from './navigation'

Template.eachMenu.helpers({
    isMenu: link => link instanceof Menu
})