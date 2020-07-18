import React,{Component} from 'react';
import {StyleSheet,View,Text,AsyncStorage,Dimensions,TouchableOpacity,Image} from 'react-native';
import User from './User';
import { Actions } from 'react-native-router-flux';
console.disableYellowBox=true;
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
export default class Setting extends Component{
  //asyns store clear
  exitApp=async()=>{
    //await AsyncStorage.clear();
    await AsyncStorage.setItem('userName','');
    await AsyncStorage.setItem('userLast','');
    await AsyncStorage.setItem('userPhone','');
    await AsyncStorage.setItem('userPassword','');
    Actions.Lgn();
  }
  //user setting
  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flex:1,justifyContent:'center'}}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={()=>Actions.Main()}
          >
          <Image
            source={require('../src/p_lib/back.png')}
            style={{width:40,height:40}}
          />
          <Text>Back</Text>   
         </TouchableOpacity>
        </View>
        <View style={{flex:5}}>
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={{flex:1,flexDirection:'column',justifyContent:'center'}}>
              <Text style={styles.header}>Username:  </Text>
              <Text style={styles.header}> Password:  </Text>
              <Text style={styles.header}>Phone:  </Text>
            </View>
            <View style={{flex:2.7,justifyContent:'center'}}>
              <Text style={styles.value}>{User._USERNAME}</Text>
              <Text style={styles.value}>{User._PASSWORD}</Text>
              <Text style={styles.value}>{User._PHONE}</Text>
            </View>
          </View>
        </View>
        <View style={{flex:5}}>
          <View style={{flex:1,alignItems:'center'}}>
            <TouchableOpacity 
              style={styles.logOutButton}
              onPress={()=>this.exitApp()}> 
                <Text style={{color:'white'}}>Logout Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  header:{
    backgroundColor:'#1E90FF',
    height:height*0.1,
    borderRadius:0,
    textAlign:'right',
    textAlignVertical:'center',
    borderWidth:2,
    borderColor:'white',
    color:'white'
  },
  value:{
    backgroundColor:'#1E90FF',
    height:height*0.1,
    borderRadius:0,
    textAlign:'center',
    textAlignVertical:'center',
    borderWidth:2,
    borderColor:'white',
    color:'white',
  },
  backButton:{
    justifyContent:'center',
    alignItems:'center',
    marginLeft:5,
    borderRadius:20,
    width:width*0.15,
    height:height*0.080,
    flexDirection:'row'
  },
  logOutButton:{
    width:width*0.8,
    height:height*0.08,
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    backgroundColor:'#DB4437'
  }
})
