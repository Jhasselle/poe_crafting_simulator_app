import React, { useState, useEffect, useRef } from 'react';
import { BackHandler, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppBar, BottomNavigation, Button, Colors, Text, TextInput, DarkTheme, Provider as PaperProvider } from 'react-native-paper';

export function TraySearch(props) {

    const [searchText, setSearchText] = useState('')

    return (
        <View style={styles.background}>
            <TextInput 
                value={searchText}
                onChangeText={text => setSearchText(text)}
                // onFocus={}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 7,
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
