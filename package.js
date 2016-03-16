Package.describe({
    name: 'devian:navigation',
    version: '0.0.3',
    // Brief, one-line summary of the package.
    summary: 'Helps creating navigation or menu bars based on FlowRouter routes and groups',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/Dev1an/Navigation.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.3-beta.16');
    api.use(['ecmascript', 'check', 'mongo', 'templating', 'reactive-var']);
    api.use(['kadira:flow-router@2.10.1'])
    api.addFiles(['eachMenu.html', 'eachMenu.js'], 'client')
    api.mainModule('navigation.js');
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('devian:navigation');
    api.mainModule('navigation-tests.js');
});
