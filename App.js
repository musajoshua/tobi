import React from "react";
import { createAppContainer } from "react-navigation";
import appSwitchNavigator from './src/routes/routes';

class App extends React.Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}

const AppNavigator = createAppContainer(appSwitchNavigator);
export default App;