import React, { useState, useEffect, useRef } from 'react';
import { BackHandler, Image, ImageBackground, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { AppBar, BottomNavigation, Button, Colors, DarkTheme, Provider as PaperProvider } from 'react-native-paper';

export function TrayOrbs({currencySelected, pressed}) {

    return (
        <View style={styles.background}>

            <View style={styles.row}>

                <TouchableOpacity onPress={() => pressed('transmutation')}>
                    <View style={(currencySelected == 'transmutation') ? styles.on : styles.off}> 
                            <Image 
                                style={{position: 'absolute' }}
                                source={require('../img/frame/currency_socket.png')} 
                            />
                            <Image source={require('../img/images/CurrencyUpgradeToMagic.png')} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => pressed('augmentation')}>
                    <View style={(currencySelected == 'augmentation') ? styles.on : styles.off}> 
                            <Image 
                                style={{position: 'absolute' }}
                                source={require('../img/frame/currency_socket.png')} 
                            />
                            <Image source={require('../img/images/CurrencyAddModToMagic.png')} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => pressed('alteration')}>
                    <View style={(currencySelected == 'alteration') ? styles.on : styles.off}> 
                            <Image 
                                style={{position: 'absolute' }}
                                source={require('../img/frame/currency_socket.png')} 
                            />
                            <Image source={require('../img/images/CurrencyRerollMagic.png')} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => pressed('regal')}>
                    <View style={(currencySelected == 'regal') ? styles.on : styles.off}> 
                            <Image 
                                style={{position: 'absolute' }}
                                source={require('../img/frame/currency_socket.png')} 
                            />
                            <Image source={require('../img/images/CurrencyUpgradeMagicToRare.png')} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Bottom Row of Currency */}
            <View style={styles.row}>
            
                <TouchableOpacity onPress={() => pressed('alchemy')}>
                    <View style={(currencySelected == 'alchemy') ? styles.on : styles.off}> 
                            <Image 
                                style={{position: 'absolute' }}
                                source={require('../img/frame/currency_socket.png')} 
                            />
                            <Image source={require('../img/images/CurrencyUpgradeToRare.png')} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => pressed('chaos')}>
                    <View style={(currencySelected == 'chaos') ? styles.on : styles.off}> 
                            <Image 
                                style={{position: 'absolute' }}
                                source={require('../img/frame/currency_socket.png')} 
                            />
                            <Image source={require('../img/images/CurrencyRerollRare.png')} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => pressed('annul')}>
                    <View style={(currencySelected == 'annul') ? styles.on : styles.off}> 
                            <Image 
                                style={{position: 'absolute' }}
                                source={require('../img/frame/currency_socket.png')} 
                            />
                            <Image source={require('../img/images/AnnullOrb.png')} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => pressed('exalt')}>
                    <View style={(currencySelected == 'exalt') ? styles.on : styles.off}> 
                        <Image 
                            style={{position: 'absolute' }}
                            source={require('../img/frame/currency_socket.png')} 
                        />
                        <Image source={require('../img/images/CurrencyAddModToRare.png')} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => pressed('scour')}>
                    <View style={(currencySelected == 'scour') ? styles.on : styles.off}> 
                        <Image 
                            style={{position: 'absolute' }}
                            source={require('../img/frame/currency_socket.png')} 
                        />
                        <Image source={require('../img/images/CurrencyConvertToNormal.png')} />
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 6,
        // justifyContent: 'space-between',
        // alignItems: 'center'
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
        backgroundColor: Colors.blue600,
        borderRadius: 10,
    },
    off: {
        // backgroundColor: 'black'
    }
});
