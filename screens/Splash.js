import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar} from 'react-native';
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
                <ActivityIndicator animating={true} color={Colors.red600} size='large'/>
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
