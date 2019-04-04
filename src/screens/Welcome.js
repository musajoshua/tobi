import React, { Component } from 'react';
import { AsyncStorage, StyleSheet} from 'react-native';
import CONFIG from './../config';
import Spinner from 'react-native-loading-spinner-overlay';
import background from './../../images/background.jpg';
import logo from './../../images/logo.png';
import {
    View,
    ImageBackground,
    Image,
    Text,
    Button
} from '@shoutem/ui';

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false
        }
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount(){
        this.setState({
            spinnerVisible: true
        });
        AsyncStorage.getItem(CONFIG.KEY)
        .then((value) => {
            this.setState({
                spinnerVisible: false
            });
            if (value != null) {
                this.props.navigation.navigate("Home");
            }
        });
        // this.props.navigation.navigate("Home");
    }

    render() {
        return (
                
                <View styleName="fill-parent">
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={'Loading...'}
                    textStyle={{ color: '#F3F3F3' }}
                />
                <ImageBackground source={background} styleName="featured">
                    <Image
                        style={{marginTop: 250}}
                        styleName="medium-avatar"
                        source={logo}
                    />
                </ImageBackground>

                <View style={styles.container}>
                    <Text style={styles.welcomeText}>Welcome !</Text>
                    <Button styleName="large" onPress={() => this.props.navigation.navigate("Login")}>
                        <Text>Login</Text>
                    </Button>
                    <Button onPress={() => this.props.navigation.navigate("Register")}>
                        <Text>Signup</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    welcomeText: {
        fontSize: 30,
        color: '#4C535B'
    }
});
