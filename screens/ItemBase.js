import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { AppBar, Avatar, Button, DarkTheme, List, Checkbox, Provider as PaperProvider } from 'react-native-paper';
// import Store from '../store/store';
import base_items from '../data/base_items';


export function ItemBase(props) {

    // const []

    const navigateToEndgameSelection = (base) => {
        props.navigation.navigate('ItemEndgameSelection', {'item_base':base});
    }

    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>
                <ScrollView
                    style={{ flexGrow: 1 }}
                    contentContainerStyle={{ alignItems: 'stretch' }}>

                    { 
                        base_items ? (
                            base_items.map((item) => 
                                // <Text>{item.item_class}</Text>
                                <List.Accordion
                                    key={item.item_class}
                                    title={item.item_class}
                                    titleStyle={{fontSize: 20}}
                                    onPress={()=>{console.log('accordian pressed')}}
                                    // left={() => 
                                    //     <Avatar.Image 
                                    //         size={60} 
                                    //         source={item.image}
                                    //     />
                                    //     }
                                    >

                                {
                                    item.base_items.map((base)=>
                                        <List.Item 
                                            style={{paddingLeft: 30}}
                                            key={base.name}
                                            title={base.name} 
                                            onPress={() => navigateToEndgameSelection(base)}
                                            // left={()=>
                                            //     <Avatar.Image 
                                            //         size={60} 
                                            //         source={baseItem.image} 
                                            //     />
                                            // }
                                        />
                                    )
                                }
                            
                            </List.Accordion>
                            )
                    
                        ): <Text>Loading</Text>
                    }

                </ScrollView>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#1E2126'
    },
});
