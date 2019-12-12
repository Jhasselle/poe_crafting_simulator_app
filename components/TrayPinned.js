import React, { useState, useEffect, useRef } from 'react';
import { BackHandler, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppBar, BottomNavigation, Button, Colors, Text, DarkTheme, Provider as PaperProvider } from 'react-native-paper';

export function TrayPinned(props) {

    useEffect(()=>{

    })

    function pressed(currency) {
        if (currency == props.currencySelected) {
            props.setCurrencySelected(null);
        }
        else {
            props.setCurrencySelected(currency);
        }
    }

    return (
        <View style={styles.background}>
            <Text style={styles.text}>Pinned</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontFamily: 'Fontin-SmallCaps',
        fontSize: 24
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    socket: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    on: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.red900,
        borderRadius: 20,
    },
    off: {
        // backgroundColor: 'black'
    }
});
