import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Alert} from "react-native";
import RNSpeedometer from 'react-native-speedometer';
import { Location, Permissions, ScreenOrientation } from 'expo';
import CONFIG from './../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header, Right, Container } from "native-base";
import Spinner from 'react-native-loading-spinner-overlay';

export default class Home extends Component {
  state = {
    start : true,
    speed: 0,
    average_speed: 0,
    top_speed: 0,
    direction : 0,
    no_of_turns: 0,
    no_of_collisions: 0,
    previous_direction : 0,
    previous_speed: 0,
    counter: 0,
    interval_id : '',
    spinnerVisible: false,
    spinnerText: "Logging out..."
  };

  componentWillMount = async() => {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
  };

  findCoordinates = async() => {
    this.setState({
      counter: this.state.counter + 1
    })

    let compass = await Location.getHeadingAsync({
      accuracy: 3
    });

    this.setState({
      previous_direction: this.state.direction,
      direction: Math.round(compass.magHeading)
    });

    if (Math.abs(this.state.previous_direction - this.state.direction) > 90) {
      this.setState({
        no_of_turns: this.state.no_of_turns + 1
      })
    }

    let position = await Location.getCurrentPositionAsync({
      accuracy: 6
    });

    let speed = position.coords.speed < 0 ? 0 : Math.round(position.coords.speed) * 3.6;
    let topSpeed = speed > this.state.top_speed ? speed : this.state.top_speed;
    let average_speed = ((this.state.average_speed * (this.state.counter - 1)) + speed) / this.state.counter;

    this.setState({
      previous_speed: this.state.speed,
      speed: speed,
      top_speed: topSpeed,
      average_speed: average_speed
    });

    if (Math.abs(this.state.previous_speed - this.state.speed) > 45) {
      this.setState({
        no_of_collisions: this.state.no_of_collisions + 1
      })
    }
  };

  logout = async() => {
    this.setState({
      spinnerVisible : true,
      spinnerText: "Logging out..."
    });

    value = await AsyncStorage.getItem(CONFIG.KEY);
    value = JSON.parse(value);

    fetch(CONFIG.URL + '/logout', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + value.token,
          'Content-Type': 'application/json',
        }
      })
      .then(res => res.json())
      .then(async (response) => {
        this.setState({
          spinnerVisible: false
        });
        
        if(response.status){
          setTimeout(() => {
            Alert.alert(
              "Success",
              response.message,
              {
                cancelable: false
              }
            );
          }, 500);
          AsyncStorage.removeItem(CONFIG.KEY)
          .then(() => {
            this.props.navigation.navigate("Welcome");
          });
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

  _startTrip = async() => {
    this.setState({
        start: false,
        speed: 0,
        average_speed: 0,
        top_speed: 0,
        direction: 0,
        no_of_turns: 0,
        no_of_collisions: 0,
        previous_direction: 0,
        previous_speed: 0,
        counter: 0,
    });
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert("Permission to access location was denied")
    }
    let id = setInterval(this.findCoordinates, 2500);
    this.setState({
      interval_id : id
    });
  }

  _endTrip = async() => {
    this.setState({
      start: true,
      spinnerVisible : true,
      spinnerText : "sending feedback"
    });
    clearInterval(this.state.interval_id);

    value = await AsyncStorage.getItem(CONFIG.KEY);
    value = JSON.parse(value);

    const { no_of_collisions, no_of_turns, average_speed, top_speed } = this.state;
    const body = { no_of_collisions, no_of_turns, average_speed, top_speed };
    fetch(CONFIG.URL + '/new_feedback', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + value.token,
          'Content-Type': 'application/json',
        }
      })
      .then(res => res.json())
      .then(async (response) => {
        this.setState({
          spinnerVisible: false
        });
        if (response.status) {
          setTimeout(() => {
            Alert.alert(
              "Success",
              "Feeback sent to Community Transport Manager",
              {
                cancelable: false
              },
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

  _renderButton =  function () {
        if (this.state.start) {
            return (
                <View>
                  <TouchableOpacity onPress={this._startTrip}>
                    <Text style={styles.welcome}>
                      Start Trip
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.instructions}>
                    speed : {this.state.speed.toFixed(2)} km/hr
                  </Text>
                  <Text style={styles.instructions}>
                    Top Speed : {this.state.top_speed.toFixed(2)} km/hr
                  </Text>
                  <Text style={styles.instructions}>
                    Average Speed : {this.state.average_speed.toFixed(2)} km/hr
                  </Text>
                  <Text style={styles.instructions}>
                    No. of Turns : {this.state.no_of_turns}
                  </Text>
                  <Text style={styles.instructions}>
                    No. of Collisions : {this.state.no_of_collisions}
                  </Text>  
                </View>
            );
        } else {
            return (
                  <View>
                    <TouchableOpacity onPress={this._endTrip}>
                      <Text style={styles.welcome}>
                        End Trip
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.instructions}>
                      speed : {this.state.speed.toFixed(2)} km/hr
                    </Text>
                    <Text style={styles.instructions}>
                      Top Speed : {this.state.top_speed.toFixed(2)} km/hr
                    </Text>
                    <Text style={styles.instructions}>
                      Average Speed : {this.state.average_speed.toFixed(2)} km/hr
                    </Text>
                    <Text style={styles.instructions}>
                      No. of Turns : {this.state.no_of_turns}
                    </Text>
                    <Text style={styles.instructions}>
                      No. of Collisions : {this.state.no_of_collisions}
                    </Text>
                    <RNSpeedometer value={this.state.speed} size={200}/>
                  </View>
                
            );
        }
    }

  render() {
    return (
      <Container>
        <Spinner
            visible={this.state.spinnerVisible}
            textContent={this.state.spinnerText}
            textStyle={{ color: '#F3F3F3' }}
        />
        <Header style={{backgroundColor: "#F5FCFF"}}>
          <Right>
            <TouchableOpacity onPress={this.logout}>
              <MaterialCommunityIcons size={30} name="logout"/>
            </TouchableOpacity>
          </Right>
        </Header>
        <View style={styles.container}>
            {this._renderButton()}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});