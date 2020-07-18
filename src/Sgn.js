import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, ImageBackground, Image, Dimensions, TouchableOpacity, Alert, Linking } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import database from '@react-native-firebase/database';
import User from './User.js';
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
console.disableYellowBox = true;
require('react-native').unstable_enableLogBox();

export default class Sgn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputUsername: null,
            inputLastname: null,
            inputPhone: null,
            inputPassword: null,
            inputConfirmPassword: null,
            borderColor: '',
            borderWidth: 0,
            deneme: '',
            users: [],
            check: false
        }
    }
    //sign up event
    _fecSIGN = () => {
        if (this.state.inputUsername != null && this.state.inputLastname != null && this.state.inputPhone != null && this.state.inputPassword != null && this.state.inputConfirmPassword != null) {
            if (this.state.inputPassword == this.state.inputConfirmPassword) {
                User._USERNAME = this.state.inputUsername.trim();
                User._PHONE = this.state.inputPhone.trim();
                User._PASSWORD = this.state.inputPassword.trim();
                User._LASTNAME = this.state.inputLastname.trim();
                database().ref('users/' + User._PHONE).set({ username: User._USERNAME, lastname: User._LASTNAME, password: User._PASSWORD, phone: User._PHONE });
                var text = User._USERNAME + " " + User._LASTNAME;
                Alert.alert("Hello " + text, "\n\nWelcome to the FEC Chat World! \nNow, lets go to the Sing In Page!");
            }
            else {
                Alert.alert("ERROR PASSWORD CONFIRM", "Password confirm is not correct!")
            }
        }
        else {
            Alert.alert("ERROR LENGTH", "LESS THAN 3 AND EQUAL TO 0");
        }
    }
    //routing my github page
    githubClick = async () => {
        const url = "https://github.com/muratonay1";
        const supported = await Linking.canOpenURL(url);
        await Alert.alert(
            "Routing Github",
            "Don't forget to follow, Thanks! :)",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => supported ? Linking.openURL(url) : Alert.alert("Internet Connection Error") }
            ],
            { cancelable: false }
        );
    }
    render() {
        return (
            <ImageBackground source={require('../src/p_lib/backgroundImage.jpg')} style={{ flex: 1 }}>
                <StatusBar backgroundColor="#87CEFA" />
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 0.05 }}></View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.gotoSignIn} onPress={() => Actions.Lgn()}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 5 }}>
                            <View style={{ flex: 1, backgroundColor: 'white' }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18 }}>Sing Up</Text>
                                </View>
                                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../src/p_lib/login.png')}
                                        style={{ width: width * 0.2, height: height * 0.12 }} />
                                </View>
                            </View>
                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flex: 0.54, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <TextInput
                                        style={{ backgroundColor: '#dddddd', height: 40, flex: 1, marginLeft: 6 }}
                                        placeholder="  First Name"
                                        onChangeText={input => this.setState({ inputUsername: input })}
                                        maxLength={15} />
                                    <View style={{ flex: 0.01, backgroundColor: 'white' }}></View>
                                    <TextInput
                                        style={{ backgroundColor: '#dddddd', height: 40, flex: 1, marginRight: 6 }}
                                        placeholder="  Last Name"
                                        onChangeText={input => this.setState({ inputLastname: input })}
                                        maxLength={15} />
                                </View>

                                <TextInput
                                    style={{ width: width - 50, height: 40, marginTop: 20, backgroundColor: '#dddddd', borderWidth: 0, borderColor: '' }}
                                    placeholder="  Phone Ex:(5xxxxxxxxx)"
                                    onChangeText={input => this.setState({ inputPhone: input })}
                                    keyboardType="phone-pad"
                                    dataDetectorTypes="phoneNumber"
                                    maxLength={10}
                                />
                                <TextInput
                                    style={{ width: width - 50, height: 40, marginTop: 10, backgroundColor: '#dddddd' }}
                                    placeholder="  Password"
                                    onChangeText={input => this.setState({ inputPassword: input })}
                                    maxLength={15} />
                                <TextInput
                                    style={{ width: width - 50, height: 40, marginTop: 10, backgroundColor: '#dddddd' }}
                                    placeholder="  Confirm Password"
                                    onChangeText={input => this.setState({ inputConfirmPassword: input })}
                                    maxLength={15} />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <TouchableOpacity style={styles.loginButton} onPress={() => this._fecSIGN()}>
                                    <Text style={{ color: 'white', fontSize: 14 }}>Sign Up</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.githubButton} onPress={() => this.githubClick()}>
                                    <View style={{ flex: 1 }}></View>
                                    <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: 14, textDecorationLine: 'underline' }}>Go to source code on GİTHUB </Text>
                                        <Image
                                            source={require('../src/p_lib/github.jpg')}
                                            style={{ width: width * 0.15, height: height * 0.04, marginTop: 5 }} />
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
        height: 60,
        backgroundColor: '#3c58ad',
        marginLeft: 5,
        marginTop: 10,
        flexDirection: 'column'
    },
    gotoSignIn: {
        width: width * 0.5,
        height: height * 0.06,
        backgroundColor: 'royalblue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        opacity: 0.7
    }
})
