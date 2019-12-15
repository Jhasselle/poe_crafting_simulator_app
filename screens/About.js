import React, { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Image, ImageBackground, Linking, StyleSheet, ScrollView, View } from 'react-native';
import { AppBar, Avatar, Button, DarkTheme, IconButton, List, Text, Checkbox, Provider as PaperProvider } from 'react-native-paper';


export function About(props) {

    const url = "https://github.com/Jhasselle/poe_crafting_simulator_app"

    let spinValue = new Animated.Value(0)

    Animated.timing(
        spinValue,
        {
            toValue: 10,
            duration: 100000,
            easing: Easing.linear
        }
    ).start()

    // Second interpolate beginning and end values (in this case 0 and 1)
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>
                <Text style={styles.text}>All graphics, game-data, and assets used are owned by Grinding Gear Games.</Text>
                
                <Animated.Image
                    style={{ transform: [{ rotate: spin }] }}
                    source={require('../img/images/CurrencyRerollRare.png')}
                />

                <Text style={styles.link} onPress={() => Linking.openURL(url)}>
                    github.com/Jhasselle/poe_crafting_simulator_app
                </Text>

                <Text style={styles.text}>hasselle.dev@gmail.com</Text>
            </View>
        </PaperProvider>
    );
}

About.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: () =>
            <Text
                style={{
                    fontSize: 24,
                    fontFamily: 'Fontin-SmallCaps',
                    color: 'white'
                }}>
                About
            </Text>,

        headerStyle: {
            backgroundColor: DarkTheme.colors.surface,
        },
        headerLeft: () =>
            <IconButton
                icon="arrow-left"
                onPress={() => navigation.pop()}
                style={{ flex: 1, color: 'white' }}
                color='white'
            />
    };
}


var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: width,
        height: height,
        backgroundColor: '#1E2126'
    },
    text: {
        fontSize: 20,
        fontFamily: 'Fontin-SmallCaps',
        textAlign: 'center'
    },
    link: {
        fontSize: 20,
        fontFamily: 'Fontin-SmallCaps',
        textAlign: 'center',
        color: 'rgba(136, 136, 255, 1)',
    }
});
