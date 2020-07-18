import React,{Component} from 'react';
import {View} from 'react-native';
import Flux from './src/Flux.js';
import firebase from '@react-native-firebase/app';
console.disableYellowBox=true;
export default class App extends Component{
  componentDidMount(){
    var firebaseConfig = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: ""
    };
    if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }
  }
  render(){
    return(
      <View style={{flex:1}}>
        <Flux/>
      </View>
    )
  }
}
