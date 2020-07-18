import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import Lgn from './Lgn.js';
import Main from './Main.js';
import Sgn from './Sgn.js';
import Msg from './Msg.js';
import Setting from './Setting.js';
import Group from './Group.js';
import { AsyncStorage } from 'react-native';
import User from './User.js';
import GroupMsg from './GroupMsg.js';
export default class Flux extends Component {
  constructor(props){
    super(props);
    this._setInitial();
    this.state={
      initialLogin:false,
      initialMain:false,
      initialSignUp:false,
      initialMessage:false,
      initialSetting:false,
      initialGroup:false,
      initialGroupMsg:false,
      local_username:'',
      local_password:'',
      local_phone:''
    }
  }
  _setInitial=async()=>{
    //initial routing (login or Main) According to the information in AsyncStore
    User._USERNAME=await AsyncStorage.getItem('userName');
    User._LASTNAME =  await AsyncStorage.getItem('userLast');
    User._PHONE=await AsyncStorage.getItem('userPhone');
    User._PASSWORD=await AsyncStorage.getItem('userPassword');
    console.log(User._USERNAME)
    if(User._PHONE.length!=0){
      this.setState({initialLogin:false,initialMain:true});
    }
    else{
      this.setState({initialLogin:true,initialMain:false});
    }
  }
  render() {
    return (
      <Router >
        <Scene key='Root'>
            <Scene key="Lgn" component={Lgn}  initial={this.state.initialLogin}  hideNavBar />
            <Scene key="Main" component={Main} initial={this.state.initialMain}   hideNavBar />
            <Scene key="Sgn" component={Sgn} initial={this.state.initialSignUp}   hideNavBar />
            <Scene key="Msg" component={Msg}  initial={this.state.initialMessage}  hideNavBar />
            <Scene key="Setting" component={Setting}  initial={this.state.initialMessage}  hideNavBar />
            <Scene key="Group" component={Group}  initial={this.state.initialGroup}  hideNavBar />
            <Scene key="GroupMsg" component={GroupMsg}  initial={this.state.initialGroupMsg}  hideNavBar />
        </Scene>
      </Router>
    )
  }
}