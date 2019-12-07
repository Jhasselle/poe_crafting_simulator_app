import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { DarkTheme, Text, Provider as PaperProvider } from 'react-native-paper';

const goHome = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
});


export function Splash(props) {

    useEffect(() => {
        props.navigation.dispatch(goHome);
    }, []);
    

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
