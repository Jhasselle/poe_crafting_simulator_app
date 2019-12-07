import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { AppBar, Avatar, Button, DarkTheme, List, Checkbox, Provider as PaperProvider } from 'react-native-paper';
import { Feed } from '../components/Feed';
import itemClasses from '../data/item_classes';

export function ItemBase(props) {



    useEffect(() => {

    })

    function navigationCallback() {

    }

    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>
                {/* <Button onPress={() => props.navigation.navigate('ItemCraft')}>
                    go to ItemCraft
                </Button> */}
                <ScrollView
                    style={{ flexGrow: 1 }}
                    contentContainerStyle={{ alignItems: 'stretch' }}>

                    {itemClasses ? (
                        itemClasses.map((item) =>
                            <List.Accordion
                                key={item.index}
                                title={item.name}
                                left={() => 
                                    <Avatar.Image 
                                        size={60} 
                                        source={item.image}/>
                                }>

                                {
                                    item.baseItems.map((baseItem)=>
                                        <List.Item 
                                            key={baseItem.$index}
                                            title={baseItem.Name} 
                                            onPress={() => props.navigation.navigate('Loading', {itemClass:item.Id, itemBase:baseItem, endgameType:'shaper'})}
                                            left={()=>
                                                <Avatar.Image 
                                                    size={60} 
                                                    source={baseItem.image} 
                                                />
                                            }
                                        />
                                    )
                                }
                            
                            </List.Accordion>

                        )) : <Text>Empty</Text>
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
