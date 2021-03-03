/**
 * Sample React Native App with Drawer, Toolbar and Navigator
 *
 *
 * @author Osmar Merlos 
 */
'use strict';

var React       = require('react-native');
var Icon        = require('react-native-vector-icons/FontAwesome');

var Drawer      = require('react-native-drawer');
var DrawerMenu  = require('./components/DrawerMenu');

var MenuItemExampleOne                  = require('./components/MenuItemExampleOne');
var MenuItemExampleTwoWithDetailButton  = require('./components/MenuItemExampleTwoWithDetailButton');
var DetailViewExample  = require('./components/DetailViewExample');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    ToolbarAndroid,
} = React;

var MENU_ITEMS = [{
    'title': 'Example screen one',
    'icon': 'mobile',
    'position': 0
}, {
    'title': 'Example screen two',
    'icon': 'info',
    'position': 1
}];

var toolbarMenu = [
    {title: 'Menu', icon: require('./images/fa-bars.png'), show: 'always'}
];

var App = React.createClass({


    getInitialState: function() {
        return {
            title: MENU_ITEMS[0].title,
            position: 0
        };
    },

    _showNewScreen: function(position, action) {

        var title = '';
        try {
            title = MENU_ITEMS[position].title;
        } catch (err) {

        }

        this._closeDrawer();

        switch (action) {
            case 'push':
                this._navigator.push({id: position, title: title});
                return;
            case 'replace':
                this._navigator.replace({id: position, title: title});
                return;
            default:
                this._navigator.replace({id: position, title: title});
                return;
        }
    },

    _setNavigatorRef: function(navigator) {
        if (navigator !== this._navigator) {
            this._navigator = navigator;

            if (navigator) {
                var callback = (event) => {
                    /*console.log(
                        `DrawerToolbarNavigator: event ${event.type}`,
                        {
                        route: JSON.stringify(event.data.route),
                        target: event.target,
                        type: event.type,
                        }
                    );*/
                };
                this._listeners = [
                    navigator.navigationContext.addListener('willfocus', callback),
                    navigator.navigationContext.addListener('didfocus', callback),
                ];
            }
        }
    },

    _renderScene: function(route, nav) {

        var toolBars = [];
        toolBars.push(
            <View style={styles.toolbarWrapper}>
                <ToolbarAndroid
                    actions={toolbarMenu}
                    onActionSelected={this._openDrawer}
                    style={styles.toolbar}
                    title={route.title} />
            </View>
        );

        switch (route.id) {
            case 0:
                return (
                    <View style={styles.container}>
                        {toolBars[0]}
                        <MenuItemExampleOne 
                            navigator={nav} 
                            redirect={this._showNewScreen} />
                    </View>
                );
            case 1:
                return (
                    <View style={styles.container}>
                        {toolBars[0]}
                        <MenuItemExampleTwoWithDetailButton 
                            navigator={nav} 
                            redirect={this._showNewScreen} />
                    </View>
                );
            case 'detailView':
                return (
                    <View style={styles.container}>
                        <DetailViewExample 
                            navigator={nav} 
                            goBack={this._goBack} />
                    </View>
                );
            default:
                return (
                    <View style={styles.container}>
                        {toolBars[0]}
                        <MenuItemExampleOne 
                            navigator={nav} 
                            redirect={this._showNewScreen} />
                    </View>
                );
        }
    },

    _goBack: function () {
        this._navigator.pop();
    },

    _openDrawer: function() {
        this.refs.drawer.open();
    },

    _closeDrawer: function() {
        this.refs.drawer.close();
    },


    render: function() {
        return ( 
            <Drawer
                ref="drawer"
                type="overlay"
                content={<DrawerMenu 
                            menuItems={MENU_ITEMS}
                            onSelect={this._showNewScreen} />}
                tapToClose={true}
                openDrawerOffset={0.25}
                panCloseMask={0.2}
                closedDrawerOffset={0}
                styles={{
                    drawer: {
                        shadowColor: '#000000', 
                        shadowOpacity: 0.8, 
                        shadowRadius: 3, 
                        backgroundColor: '#fff', 
                        borderRightWidth: 1,
                        borderRightColor: '#e0e0e0'},
                    main: {paddingLeft: 3}
                }}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                })}
                >
                <Navigator
                    ref={this._setNavigatorRef}                        
                    initialRoute={
                        {
                            id: this.state.position, 
                            title: MENU_ITEMS[this.state.position].title
                        }
                    }
                    configureScene={(route) => {
                        if (route.sceneConfig) {
                            return route.sceneConfig;
                        }
                        return Navigator.SceneConfigs.FloatFromBottom;
                    }}
                    renderScene={this._renderScene}                    
                 /> 
            </Drawer>  
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    toolbar: {
        backgroundColor: '#f5f5f5',
        height: 56,
    },
    toolbarWrapper: {
        borderBottomColor: '#e0e0e0',
        elevation: 3
    },
    row: {
        flexDirection: 'row',
    }
});

AppRegistry.registerComponent('DrawerToolbarNavigator', () => App);
