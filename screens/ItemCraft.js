import React, { useState, useEffect, useRef } from 'react';
import { BackHandler, TouchableHighlight, Image, StyleSheet, View } from 'react-native';
import { AppBar, Button, DarkTheme, Text, Provider as PaperProvider } from 'react-native-paper';
import { HomeBottomAppBar, HomeTopAppBar } from '../components/HomeAppBar';
import { Feed } from '../components/Feed';
import { ItemHeader } from '../components/ItemHeader';
import { CurrencyTray } from '../components/CurrencyTray';
import Store from '../store/store';

export function ItemCraft(props) {

    const [loaded, setLoaded] = useState(false);
    const store = Store.getInstance();
    const item_id = props['navigation']['state']['params']['item_id'];
    const [item, setItem] = useState(null);
    const [currencySelected, setCurrencySelected] = useState(null);

    useEffect(() => {
        // console.log('ItemCraft');
        // console.log(item)
        if (!loaded) {
            store.getItem(item_id, setItem);
            setLoaded(true);
        }
    });

    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>

                {/* Top Info */}
                <TouchableHighlight style={styles.background} onPress={useCurrency}>
                    <View style={styles.itemBox}>

                        {item ? (
                            <Text style={(item.rarity == 'normal') ? styles.normal : (item.rarity == 'magic') ? styles.magic : styles.rare}>{item.base.Name}</Text>
                        )
                         : null
                        }

                        <Text>Prefixes</Text>
                        {item ? (
                            item.prefixes ? (
                                item.prefixes.map((prefix) =>

                                    {prefix.rolls ? 
                                        <Text style={{color: 'cyan'}} key={prefix.affix.$index}>{prefix.rolls.text}</Text> 
                                        :<Text>no prefix rolls</Text>
                                    }           
                                )
                            ) : <Text>no prefixes</Text>

                        ) : null}

                        <Text>Suffixes</Text>
                        {item ? (
                            item.suffixes ? (
                                item.suffixes.map((suffix) =>
                                    
                                        {suffix.rolls ? 
                                            <Text style={{color: 'orange'}} key={suffix.affix.$index}>{suffix.rolls.text}</Text> 
                                            :<Text>no suffix rolls</Text>
                                        }           
                                    
                                )
                            ) : <Text>no suffixes</Text>

                        ) : null}

                    <Text>Groups</Text>
                        {item ? (
                            item.groups ? (
                                item.groups.map((group) =>
                                    <Text style={{color: 'green'}} key={group}> {group} </Text>
                                )
                            ) : <Text>no suffixes</Text>

                        ) : null}

                    </View>
                </TouchableHighlight>
                <CurrencyTray currencySelected={currencySelected} setCurrencySelected={setCurrencySelected} />
            </View>
        </PaperProvider>
    );

    async function useCurrency() {
        switch (currencySelected) {
            case null:
                console.log(currencySelected);
                break;
            case 'transmutation':
                await(store.transmutation(item, setItem));
                break;
            case 'alteration':
                await(store.alteration(item, setItem));
                break;
            case 'augmentation':
                await(store.augmentation(item, setItem));
                break;
            case 'regal':
                await(store.regal(item, setItem));
                break;
            case 'alchemy':
                await(store.alchemy(item, setItem));
                break;
            case 'chaos':
                await(store.chaos(item, setItem));
                break;
            case 'annul':
                await(store.annul(item, setItem));
                break;
            case 'exalt':
                await(store.exalt(item, setItem));
                break;
            case 'scour':
                await(store.scour(item, setItem));
                break;
        }
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#1E2126'
    },
    itemBox: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    normal: {
        color: '#ffffff'
    },
    magic: {
        color: 'blue'
    },
    rare: {
        color: 'yellow'
    },
});
