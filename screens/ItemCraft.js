import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BackHandler, TouchableHighlight, Image, StyleSheet, View } from 'react-native';
import { AppBar, Button, DarkTheme, Text, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation, useFocusEffect, useFocusState} from 'react-navigation-hooks'
import { HomeBottomAppBar, HomeTopAppBar } from '../components/HomeAppBar';
import { ItemHeader } from '../components/ItemHeader';
import { CurrencyTray } from '../components/CurrencyTray';
import img_dictionary from '../data/img_dictionary';
import Store from '../store/store';

export function ItemCraft(props) {

    const store = Store.getInstance();
    const item_uid = props['navigation']['state']['params']['item_uid'];
    const [item, setItem] = useState(null);
    const [currencySelected, setCurrencySelected] = useState(null);
    const [itemImage, setItemImage] = useState(null)

    // listen for item updates
    useEffect(() => {
        console.log('hehe', item)
        if (item) {
            console.log(item.item_base)
            setItemImage(img_dictionary[item.item_base.visual_identity.id])
        }
        
    }, [item]);

    useEffect(() => {
        store.getItem(item_uid, setItem)
    }, [props]);

    // https://github.com/react-navigation/hooks how wunderbar.
    // This and backHandler are to override the android hardward back button functionality
    useFocusEffect(useCallback(() => {
            const subscription = BackHandler.addEventListener('hardwareBackPress', backHandler);
            return () => {
                subscription.remove();
            }
    },[]));

    const backHandler = () => {
        props.navigation.popToTop()
        return true
    }


    return (
        <PaperProvider theme={DarkTheme}>
            <View style={styles.background}>

                {/* Top Info */}
                <TouchableHighlight style={styles.background} onPress={useCurrency}>
                    <View style={styles.itemBox}>

                        <ItemHeader item={item} />

                        <Text>Prefixes</Text>
                        {item ? (
                            item.prefixes ? (
                                item.prefixes.map((prefix) =>
                                    <Text style={{ color: 'orange' }} key={prefix.name}>{prefix.rolls.description}</Text>
                                )
                            ) : <Text>no prefixes</Text>

                        ) : null}

                        <Text>Suffixes</Text>
                        {item ? (
                            item.suffixes ? (
                                item.suffixes.map((suffix) =>
                                    <Text style={{ color: 'cyan' }} key={suffix.name}>{suffix.rolls.description}</Text>
                                )
                            ) : <Text>no suffixes</Text>
                        ) : null}

                        <View>
                            {itemImage ? <Image source={itemImage}/>
                            : null}
                        </View>
                        
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
                await (store.transmutation(item, setItem));
                break;
            case 'alteration':
                await (store.alteration(item, setItem));
                break;
            case 'augmentation':
                await (store.augmentation(item, setItem));
                break;
            case 'regal':
                await (store.regal(item, setItem));
                break;
            case 'alchemy':
                await (store.alchemy(item, setItem));
                break;
            case 'chaos':
                await (store.chaos(item, setItem));
                break;
            case 'annul':
                await (store.annul(item, setItem));
                break;
            case 'exalt':
                await (store.exalt(item, setItem));
                break;
            case 'scour':
                await (store.scour(item, setItem));
                break;
        }
    }
}

ItemCraft.navigationOptions = ({ navigation }) => {
    return {
        //   headerTitle: () => <Text>yo</Text>,
        headerLeft: () => (
            <Button onPress={() => navigation.popToTop()}>Home</Button>
        ),
    };
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
});
