import React, { Component } from 'react';
import {StyleSheet, Dimensions, Alert} from 'react-native';
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

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            user: {
                name: '',
                email: '',
                phone_no: '',
                age: '',
                sex: '',
                password: '',
                c_password: '',
                role : 0,
            }
        }
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
        if (this.state.user.name == '' || this.state.user.email == '' || this.state.user.phone_no == ''
            || this.state.user.age == ''
            || this.state.user.sex == ''
            || this.state.user.password == '' || this.state.user.c_password == '') {
            return true;
        } else {
            return false;
        }
    }

    _handleSubmit = async() => {
        this.setState({
            spinnerVisible: true
        });
        const { user } = this.state;
        fetch(CONFIG.URL + '/register', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(res => res.json())
            .then(response => {
                this.setState({
                    spinnerVisible: false
                });
                if (response.status === "success") {
                    setTimeout(() => {
                        Alert.alert(
                            "Success",
                            response.message.success, {
                                cancelable: false
                            }
                        );
                    }, 500);
                } else {
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
            .catch(error => {
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
                    textContent={'Registering...'}
                    textStyle={{ color: '#F3F3F3' }}
                />
                <Content>
                    <Form>
                        <Item rounded style={{marginTop: 10, marginBottom: 10,}}>
                            <Input
                                value={this.state.user.name}
                                // autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Full Name"
                                onChangeText={(text) => this._handleChange(text, 'name')}
                            />
                        </Item>
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
                                value={this.state.user.phone_no}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Phone No."
                                onChangeText={(text) => this._handleChange(text, 'phone_no')}
                            />
                        </Item>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                value={this.state.user.age}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Age"
                                onChangeText={(text) => this._handleChange(text, 'age')}
                            />
                        </Item>
                        <Item rounded style={styles.formGroup}>
                            <Input
                                value={this.state.user.sex}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Sex"
                                onChangeText={(text) => this._handleChange(text, 'sex')}
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
                        <Item rounded style={styles.formGroup}>
                            <Input
                                secureTextEntry={true}
                                value={this.state.user.c_password}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Confrim Password"
                                onChangeText={(text) => this._handleChange(text, 'c_password')}
                            />
                        </Item>
                    </Form>
                    <Button dark disabled={this._handleCheck()} onPress={this._handleSubmit} style={{ alignSelf: 'center' }}>
                        <Text> Save </Text>
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
