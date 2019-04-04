import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import Login from './../screens/Login';
import Register from './../screens/Register';
import Welcome from './../screens/Welcome';

import Home from './../screens/Home';

const appStackNavigator = createStackNavigator({
    Welcome : Welcome,
    Login : Login,
    Register : Register
});

const AppSwitchNavigator = createSwitchNavigator({
    Welcome : appStackNavigator,
    Home : Home
});

export default AppSwitchNavigator;