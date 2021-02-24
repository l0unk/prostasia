import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, TextInput, NativeSyntheticEvent, StyleSheet, Text, TextInputChangeEventData, View, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import Cookies from 'js-cookie';
import PasswordList from './PasswordList';

class Home extends React.Component {
  emptyUser =  {
    username: '',
    password: ''
  }

  constructor(props) {
    super(props);
    this.state = {isLoading:true, user: this.emptyUser, token: null};
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = () => {
    this.setState({isLoading: false})
  }


  handleSubmit = ({navigation}) => {
    const {user} = this.state;
    //Cookies.remove('session');
    this.setState({isLoading: true});
    if(user == this.emptyUser) {
      this.setState({message: "Invalid username/password, please try again", isLoading: false});
      return;
    }

    fetch('https://ihateym.pagekite.me/api/auth/login', {
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
        .then(data => {
          this.setState({message: "you've succesfully logged in as: " + user['username']})
          Cookies.set('session', data);
          navigation.
          navigator.navigate('PassList');
        });
      } else if(response.status == 403) {
        this.setState({message: "Invalid username/password, please try again"});
      }
      else {
        this.setState({message: "An error has occurred (" + response.status + ")", isLoading: false})
        console.error(response.status)
      }
    })
    .then(() => this.setState({isLoading: false, user: this.emptyUser}));
    navigation.navigate(PasswordList);
  }

  handleChange(name:string, event:NativeSyntheticEvent<TextInputChangeEventData>) {
    let user = {...this.state.user};
    user[name] = event.nativeEvent.text;
    this.setState({user: user})
    console.log(JSON.stringify(user));
  }


  render() {
    const {message, isLoading} = this.state;
    const button = ({navigation}) => {
      return <Button onPress={navigation.navigate('PassList')} title="Click me"/>;
    }
    const styles = StyleSheet.create({
      button: {
        backgroundColor: 'green'
      },
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      inputField: {
        padding: 5,
        margin: 20,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 6
      },
      inputLabel: {
      },
      h1: {
        fontSize:45,
        margin: 25
      }
    });
    if(isLoading) {
      return(
        <ScrollView contentContainerStyle={styles.container}>
          <ActivityIndicator size="large" />
      </ScrollView>
      )
    }
    return(
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>Welcome to Prostasia, please log in.</Text>
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput style={styles.inputField} placeholder="placeholder" onChange={(event) => this.handleChange("username", event)} returnKeyLabel="username"/>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput style={styles.inputField} placeholder="placeholder" onChange={(event) => this.handleChange("password", event)} returnKeyLabel="password"/>
        <Button color="#000" title="Log in" onPress={this.handleSubmit}/>
        <Text>{message}</Text>
        {button}
      </ScrollView>
    )
  }


}
export default Home