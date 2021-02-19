import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputChangeEventData, View } from 'react-native';
import 'react-native-gesture-handler';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

class App extends React.Component {
  emptyUser =  {
    username: '',
    password: ''
  }

  constructor(props:any) {
    super(props)
    this.state = {isLoading:true, user: this.emptyUser, token: null}
    this.handleChange = this.handleChange.bind(this);
  }


  handleSubmit = () => {
    const {user} = this.state;
    fetch('https://localhost:5001/api/auth/login', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(user)
    })
    .then(response => {
      if(response.ok) {
        response.json()
        .then(data => this.setState({token: data}));
      } else {
        console.error(response.status)
      }
    })
  }

  handleChange(name:string, event:NativeSyntheticEvent<TextInputChangeEventData>) {
    let user = {...this.state.user};
    user[name] = event.nativeEvent.text;
    this.setState({user: user})
    console.log(JSON.stringify(user));
  }


  render() {
    const {token} = this.state;
    return(
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <TextInput placeholder="placeholder" onChange={(event) => this.handleChange("username", event)} returnKeyLabel="username"/>
        <TextInput placeholder="placeholder" onChange={(event) => this.handleChange("password", event)} returnKeyLabel="password"/>
        <Button title="Submit" onPress={this.handleSubmit} label="password">Submit</Button>
        <Text>{token}</Text>
      </View>
    )
  }
}
export default App