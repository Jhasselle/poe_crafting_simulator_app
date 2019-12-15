import React, { useState, useEffect } from 'react';
import { Animated, Easing, View, StyleSheet, StatusBar} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { DarkTheme, Text, Provider as PaperProvider } from 'react-native-paper';
import * as Font from 'expo-font';

StatusBar.setHidden(true, 'none');

const goHome = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
});

export function Splash(props) {

    const [fontIsLoad, setFontIsLoaded] = useState(false)

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
        const loadFont = async () => {
            await Font.loadAsync({
                'Fontin-SmallCaps': require('../assets/fonts/FontinSmallCaps.ttf'),
            });
            setFontIsLoaded(true)
        }
        loadFont()
    }, [])

    useEffect(() => {
        console.log(fontIsLoad)
        fontIsLoad 
            ?   props.navigation.dispatch(goHome)
            :   null
    }, [fontIsLoad]);
    

    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>
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
});
