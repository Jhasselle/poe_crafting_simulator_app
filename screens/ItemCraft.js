import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BackHandler, Dimensions, TouchableHighlight, TouchableOpacity, Image, ImageBackground, StyleSheet, View } from 'react-native';
import { AppBar, Button, Colors, DarkTheme, Text, Provider as PaperProvider } from 'react-native-paper';
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
    const [currencyGroup, setCurrencyGroup] = useState('orb')
    const [itemImage, setItemImage] = useState(null)

    // listen for item updates
    useEffect(() => {
        if (item) {
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
            
            <ImageBackground 
                source={require('../img/frame/atlas_background.png')} 
                style={styles.background}
                imageStyle={{ resizeMode: 'stretch' }}>
            
            {/* <View style={styles.background}> */}
                {/* Top Info */}
                <TouchableOpacity 
                    style={styles.ItemContainer} 
                    activeOpacity={0.9}
                    onPress={useCurrency}>

                    <View style={styles.itemBox}>
                    
                        <ItemHeader item={item} />

                        <Text>Prefixes</Text>
                        { item && item.prefixes ? 
                            item.prefixes.map((prefix) => 
                                prefix.rolls.description.text.map((line, index) => 
                                    <Text style={styles.prefix} key={index}>{line}</Text>
                        )): null}


                        <Text>Suffixes</Text>
                        {item && item.suffixes ? 
                            item.suffixes.map((suffix) =>
                                suffix.rolls.description.text.map((line, index) => 
                                    <Text style={styles.suffix} key={index}>{line}</Text>
                        )): null}


                        <View style={styles.itemImageBox}>
                            <Image 
                                style={styles.image} 
                                source={require('../img/frame/item_socket.png')} 
                            />
                            {   itemImage 
                                ?   <Image 
                                        style={{position: 'absolute' }} 
                                        source={itemImage}/>
                                : null}
                        </View>
                        
                    </View>
                </TouchableOpacity>

                <CurrencyTray 
                    currencySelected={currencySelected} 
                    setCurrencySelected={setCurrencySelected} 
                    currencyGroup={currencyGroup}
                    setCurrencyGroup={setCurrencyGroup}
                />

            {/* </View> */}
            </ImageBackground>
        </PaperProvider>
    );


    async function useCurrency() {
        if (currencyGroup == 'orb') {
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
        else if (currencyGroup == 'essence' && currencySelected) {
            console.log('essence pressed')
        }
        // ... else if (currencyGroup == 'craft') ...
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

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    image: {
        position: 'absolute',
        width: width
    },
    background: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#1E2126'
    },
    ItemContainer: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    itemBox: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor: 'black',
    },
    itemImageBox: {
        position: 'absolute', 
        top: '55%', 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignContent: 'center',
        alignItems: 'center',
    },
    prefix: {
        fontFamily: 'Fontin-SmallCaps',
        fontSize: 17,
        color: 'rgba(136, 136, 255, 1)',
        textAlign: 'center'
    },
    suffix: {
        fontFamily: 'Fontin-SmallCaps',
        fontSize: 17,
        color: 'rgba(136, 136, 255, 1)',
        textAlign: 'center'
    },
    crafted:{
        fontFamily: 'Fontin-SmallCaps',
        color: Colors.blue300
    }
});
