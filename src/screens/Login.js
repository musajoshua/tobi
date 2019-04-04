import React, { Component } from 'react';
import { Alert, AsyncStorage, StyleSheet,Dimensions} from 'react-native';
// import config from './../config';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Button,
    Text
}
from 'native-base';
import CONFIG from './../config';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            user : {
                email : '',
                password : ''
            }
        };
    }

    _handleChange = (data, name) => {
        const { user } = this.state;
        user[name] = data;

        this.setState({
            ...this.state,
            user
        });
        this._handleCheck();
    }
    _handleCheck = () => {
        if(this.state.user.email == '' || this.state.user.password == ''){
            return true;
        }else{
            return false;
        }
    }

    _handleSubmit = async() => {
        this.setState({
            spinnerVisible: true
        });
        let { user } = this.state;
        fetch(CONFIG.URL + '/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(async(response) => {
            this.setState({
                spinnerVisible: false
            });
            if (response.status === "success") {
                AsyncStorage.setItem(CONFIG.KEY, JSON.stringify({ token: response.success.token }));
                this.props.navigation.navigate('Home');
            }else{
                setTimeout(() => {
                    Alert.alert(
                        "Error",
                        response.message,
                        [{
                            text: "Try Again",
                            onPress: () => console.log('OK Pressed')
                        }], {
                            cancelable: false
                        }
                    );
                }, 500);
                
            }
        })
        .catch((error) => {
            this.setState({
                spinnerVisible: false
            });
            setTimeout(() => {
                Alert.alert(
                    "Error",
                    "An error occurred, please ensure you are connected to the internet and try again",
                    [{
                        text: "Try Again",
                        onPress: () => console.log('OK Pressed')
                    }], {
                        cancelable: true
                    }
                );
            }, 500);
        });
    }

    render() {
        return (
            <Container>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={'Logging...'}
                    textStyle={{ color: '#F3F3F3' }}
                />
                <Content>
                    <Form Form style={{marginTop: 50,}}>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                value={this.state.user.email}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Email"
                                onChangeText={(text) => this._handleChange(text, 'email')}
                            />
                        </Item>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                secureTextEntry={true}
                                value={this.state.user.password}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Password"
                                onChangeText={(text) => this._handleChange(text, 'password')}
                            />
                        </Item>
                    </Form>
                    <Button dark disabled={this._handleCheck()} onPress={this._handleSubmit} style={{ alignSelf: 'center' }}>
                        <Text> Login </Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingRight: 5,
        paddingLeft: 5,
        marginRight: "auto",
        marginLeft: "auto",
        marginTop: 10,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    formGroup: {
        marginBottom: 10,
        // justifyContent: "center",
        // alignItems: "center"
    }
});
