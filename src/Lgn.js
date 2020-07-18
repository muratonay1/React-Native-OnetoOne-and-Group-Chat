import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    ImageBackground,
    Image,
    Dimensions,
    TouchableOpacity,
    CheckBox,
    AsyncStorage,
    Alert
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
console.disableYellowBox = true;
require('react-native').unstable_enableLogBox();
import database from '@react-native-firebase/database';
import User from './User';
export default class Lgn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCheckBox: false,
            state_UserPhone: '',
            state_UserName: '',
            state_UserLastname: '',
            state_UserPassword: ''
        }
    }
    setToggleCheckBox(params) {
        this.setState({ toggleCheckBox: params })
    }
    storeData = async () => {
        await AsyncStorage.setItem('userPhone', this.state.state_UserPhone);
        await AsyncStorage.setItem('userName', this.state.state_UserName);
        await AsyncStorage.setItem('userLast', this.state.state_UserLastname);
        await AsyncStorage.setItem('userPassword', this.state.state_UserPassword);
    }
    loginUser() {
        database().ref('users/' + this.state.state_UserPhone).once('value', (data) => {
            //the condition of not null text area
            if (this.state.state_UserName != "" && this.state.state_UserLastname != '' && this.state.state_UserPassword != "" && this.state.state_UserPhone != "") {
                console.log(usrPass);
                //the condition of firebase data is not null
                if (data.toJSON() != null) {
                    var json = data.toJSON();
                    //if the fields we want are empty
                    if (json.username != null || json.password != null) {
                        var usrName = json.username;
                        var userLast = json.lastname;
                        var usrPass = json.password;
                        var usrPhone = json.phone;
                        // the condition of entering information control
                        if (usrPass == this.state.state_UserPassword && usrName == this.state.state_UserName && userLast == this.state.state_UserLastname && usrPhone == this.state.state_UserPhone) {
                            //remember me checkbox control
                            if (this.state.toggleCheckBox) {
                                //register asyncstore
                                Alert.alert("Information!", "This user will be remembered on the next login")
                                User._USERNAME = this.state.state_UserName;
                                User._LASTNAME = this.state.state_UserLastname;
                                User._PASSWORD = this.state.state_UserPassword;
                                User._PHONE = this.state.state_UserPhone;
                                this.storeData();
                                Actions.Main();
                            }
                            else {
                                User._USERNAME = this.state.state_UserName;
                                User._LASTNAME = this.state.state_UserLastname;
                                User._PASSWORD = this.state.state_UserPassword;
                                User._PHONE = this.state.state_UserPhone;
                                Actions.Main();
                            }
                        }
                        else {
                            Alert.alert("Information!", "Incorrect");
                        }
                    }
                    else {
                        console.log("null hatasında")
                        Alert.alert("Information!", "Unknown user action!");
                    }
                }
                else {
                    Alert.alert("Information!", "Unknown user action!");
                }
            }
            else {
                Alert.alert("Information!", "This area is not null");
            }
        })
    }
    render() {
        return (
            <ImageBackground source={require('../src/p_lib/backgroundImage.jpg')} style={{ flex: 1 }}>
                <StatusBar backgroundColor="#87CEFA" />
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 0.05 }}></View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => Actions.Sgn()}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, textShadowColor: 'red', textDecorationColor: 'blue', fontWeight: 'bold' }}>SIGN UP</Text>
                                    <Image
                                        source={require('../src/p_lib/add.png')}
                                        style={{ width: 60, height: 60, opacity: 0.7 }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 5 }}>
                            <View style={{ flex: 1, backgroundColor: 'white' }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18 }}>Login</Text>
                                </View>
                                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../src/p_lib/login.png')}
                                        style={{ width: width * 0.2, height: height * 0.12 }}
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flex: 0.85, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <TextInput
                                        style={{ backgroundColor: '#dddddd', height: 40, flex: 1, marginLeft: 6 }}
                                        placeholder="  First Name"
                                        onChangeText={input => this.setState({ state_UserName: input })}
                                        maxLength={15} />
                                    <View style={{ flex: 0.01, backgroundColor: 'white' }}></View>
                                    <TextInput
                                        style={{ backgroundColor: '#dddddd', height: 40, flex: 1, marginRight: 6 }}
                                        placeholder="  Last Name"
                                        onChangeText={input => this.setState({ state_UserLastname: input })}
                                        maxLength={15} />
                                </View>
                                <TextInput
                                    style={{ width: width - 50, height: 40, marginTop: 10, backgroundColor: '#dddddd' }}
                                    placeholder="  Phone"
                                    onChangeText={input => this.setState({ state_UserPhone: input })}
                                    maxLength={10}
                                />
                                <TextInput
                                    style={{ width: width - 50, height: 40, marginTop: 10, backgroundColor: '#dddddd' }}
                                    placeholder="  Password"
                                    onChangeText={input => this.setState({ state_UserPassword: input })}
                                    maxLength={15}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 10 }}>
                                    <CheckBox
                                        disabled={false}
                                        value={this.state.toggleCheckBox}
                                        onValueChange={() => this.state.toggleCheckBox ? this.setToggleCheckBox(false) : this.setToggleCheckBox(true)}
                                    />
                                    <Text style={{ marginTop: 5 }}>Remember Me</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <TouchableOpacity style={styles.loginButton} onPress={() => this.loginUser()}>
                                    <Text style={{ color: 'white', fontSize: 14 }}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.githubButton}>
                                    <View style={{ flex: 1 }}></View>
                                    <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: 14, textDecorationLine: 'underline' }}>Go to source code on GİTHUB </Text>
                                        <Image
                                            source={require('../src/p_lib/github.jpg')}
                                            style={{ width: width * 0.15, height: height * 0.04, marginTop: 5 }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}></View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flex: 0.05 }}></View>
                    </View>
                    <View style={{ flex: 0.05 }}></View>
                </View>
            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({

    loginButton: {
        width: width - 50,
        height: 40,
        backgroundColor: '#ff4301',
        marginLeft: 5,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    githubButton: {
        width: width - 50,
        height: height * 0.09,
        backgroundColor: '#3c58ad',
        marginLeft: 5,
        marginTop: 10,
        flexDirection: 'column'
    }
})
