import React,{Component} from 'react';
import {StyleSheet,View,Text,TouchableWithoutFeedback,Animated} from 'react-native';
console.disableYellowBox=true;
export default class FloatingButton extends Component{
  constructor(props){
    super(props);
    this.state={
      clicked:true
    }
  }
  render(){
    return(
      <View style={styles.container}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.button,styles.menu]}>
                <Text style={{color:'white',backgroundColor:'green',fontSize:30}}>+</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
      alignItems:'center',
      position:'absolute',
  },
  button:{
      marginRight:20,
      width:60,
      height:60,
      borderRadius:60/2,
      alignItems:'center',
      justifyContent:'center',
      shadowRadius:10,
      shadowOpacity:0.3,
      shadowOffset:{height:10}
  },
  menu:{
    backgroundColor:'green'
  }
})
