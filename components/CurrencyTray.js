import React, { useState, useEffect, useRef } from 'react';
import { BackHandler, Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { AppBar, Button, Colors, DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { HomeBottomAppBar, HomeTopAppBar } from '../components/HomeAppBar';
import { Feed } from '../components/Feed';
import { ItemHeader } from '../components/ItemHeader';

export function CurrencyTray(props) {

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
            <View style={styles.row}>
                <TouchableOpacity style={(props.currencySelected == 'transmutation') ? styles.on : styles.off} onPress={() => pressed('transmutation')}>
                    <Image source={require('../img/images/CurrencyUpgradeToMagic.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={(props.currencySelected == 'augmentation') ? styles.on : styles.off} onPress={() => pressed('augmentation')}>
                    <Image source={require('../img/images/CurrencyAddModToMagic.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={(props.currencySelected == 'alteration') ? styles.on : styles.off} onPress={() => pressed('alteration')}>
                    <Image source={require('../img/images/CurrencyRerollMagic.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={(props.currencySelected == 'regal') ? styles.on : styles.off} onPress={() => pressed('regal')}>
                    <Image source={require('../img/images/CurrencyUpgradeMagicToRare.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={(props.currencySelected == 'alchemy') ? styles.on : styles.off} onPress={() => pressed('alchemy')}>
                    <Image source={require('../img/images/CurrencyUpgradeToRare.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={(props.currencySelected == 'chaos') ? styles.on : styles.off} onPress={() => pressed('chaos')}>
                    <Image source={require('../img/images/CurrencyRerollRare.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={(props.currencySelected == 'annul') ? styles.on : styles.off} onPress={() => pressed('annul')}>
                    <Image source={require('../img/images/AnnullOrb.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={(props.currencySelected == 'exalt') ? styles.on : styles.off} onPress={() => pressed('exalt')}>
                    <Image source={require('../img/images/CurrencyAddModToRare.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={(props.currencySelected == 'scour') ? styles.on : styles.off} onPress={() => pressed('scour')}>
                    <Image source={require('../img/images/CurrencyConvertToNormal.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2126'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    on: {
        backgroundColor: Colors.blue600,
    },
    off: {
        // backgroundColor: 'black'
    }
});
