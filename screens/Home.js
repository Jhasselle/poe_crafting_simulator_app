import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppBar, Button, Colors, DarkTheme, Provider as PaperProvider  } from 'react-native-paper';
import { HomeHeader } from '../components/HomeHeader'
import { HomeBottomAppBar } from '../components/HomeAppBar';
import { Feed } from '../components/Feed';
import Store from '../store/store';

export function Home(props) {

    const store = Store.getInstance()
    const [items, setItems] = useState(null)
    const [inEditMode, setInEditMode] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    
    useEffect(()=>{
        // store.nukeDatabase()
        props.navigation.addListener( 
            'willFocus',
            () => {
                store.getAllItems(setItems)
            }
        );
        store.getAllItems(setItems)
    },[props])

    useEffect(()=> {
        setSelectedItems([])
    }, [inEditMode])

    function deleteItems() {
        console.log('deleteItems()')
        store.deleteItems(selectedItems, setItems)
        setInEditMode(false)
        setSelectedItems([])
    }

    return (
        <PaperProvider theme={DarkTheme}>
                {/* <HomeHeader /> */}
                <View style={styles.background}>
                    <Feed             
                        navigation={props.navigation}
                        items={items} 
                        inEditMode={inEditMode}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        />
                </View>
                <HomeBottomAppBar 
                    inEditMode={inEditMode}
                    setInEditMode={setInEditMode}
                    navigation={props.navigation}
                    deleteItems={deleteItems}
                />
        </PaperProvider>
    );
}

Home.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: () => 
        <>
            <Text 
                style={{
                    flex: 2,
                    fontSize: 24,
                    fontFamily: 'Fontin-SmallCaps',
                    color: 'white'
                }}>
                    PoE Crafting Sim
            </Text>
            <Button 
                onPress={() => navigation.navigate('About')}
                style={{flex:1}}
                color={DarkTheme.colors.primary} >
                    about
            </Button>
        </>, 
        headerStyle: {
            backgroundColor: DarkTheme.colors.surface,
        },
        headerLeft: () => <View></View>

    };
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#1E2126'
    },
});
