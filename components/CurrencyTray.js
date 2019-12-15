import React, { useState, useEffect, useRef } from 'react';
import { BackHandler, Image, ImageBackground, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { AppBar, BottomNavigation, Button, Colors, DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { TrayOrbs } from './TrayOrbs' 
import { TraySearch } from './TraySearch'
import { TrayPinned } from './TrayPinned'

export function CurrencyTray(props) {

    const changeCurrencyGroup = (group) => {
        group == 'orb' || group == 'search' || group == 'pinned'
            ?   props.setCurrencyGroup(group)
            :   null
    }

    function pressed(currency) {
        if (currency == props.currencySelected) {
            props.setCurrencySelected(null);
        }
        else {
            props.setCurrencySelected(currency);
        }
    }

    return (
        <ImageBackground 
            source={require('../img/frame/currency_tray_background.png')} 
            style={styles.background}
            imageStyle={{ resizeMode: 'stretch' }}>
            
            <View style={styles.row}>
                <Button onPress={()=>changeCurrencyGroup('orb')}></Button>
                {/* <Button onPress={()=>changeCurrencyGroup('search')}>search</Button>
                <Button onPress={()=>changeCurrencyGroup('pinned')}>pinned</Button> */}
            </View>

            {props.currencyGroup == 'orb'
                ?   <TrayOrbs 
                        currencySelected={props.currencySelected}
                        pressed={pressed}
                    />
                :   props.currencyGroup == 'search'
                    ?   <TraySearch
                            currencySelected={props.currencySelected}
                            pressed={pressed}
                        />
                    :   props.currencyGroup == 'pinned'
                        ?   <TrayPinned
                                currencySelected={props.currencySelected}
                                pressed={pressed}
                            />
                        :   null
            }
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
        // alignContent: 'flex-start'
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
