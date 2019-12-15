import React, { useState, useEffect } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { DarkTheme, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import Store from '../store/store';

const goItemCraft = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'ItemCraft' })],
});

export function Loading(props) {

    const [store] = useState(Store.getInstance())
    const item_uid = props['navigation']['state']['params']['item_uid'];

    let spinValue = new Animated.Value(0)

    Animated.timing(
        spinValue,
      {
        toValue: 5,
        duration: 10000,
        easing: Easing.linear
      }
    ).start()
    
    // Second interpolate beginning and end values (in this case 0 and 1)
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    useEffect(() => {
        // console.log('Loading Screen')
        store.focusItem(item_uid, navigationCallback)
    }, []);

    function navigationCallback(item_uid){
        props.navigation.navigate('ItemCraft', {'item_uid':item_uid});
    }
    
    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>
                <Text style={styles.text}>Generating Item Mods</Text>
                <Animated.Image
                    style={{transform: [{rotate: spin}] }}
                    source={require('../img/images/CurrencyRerollRare.png')} 
                />
            </View>
        </PaperProvider>
    
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2126'
    },
    text: {
        fontFamily: 'Fontin-SmallCaps',
        fontSize: 24,
        fontWeight: 'normal',
        color: 'white'
    }
});
