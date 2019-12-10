import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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

    useEffect(() => {
        // console.log('Loading Screen')
        store.focusItem(item_uid, navigationCallback)
    }, []);

    function navigationCallback(item_uid){
        // props.navigation.dispatch(goItemCraft, {'item_uid':item_uid});
        props.navigation.navigate('ItemCraft', {'item_uid':item_uid});
    }
    
    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>
                <Text>Generating Affixes</Text>
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
