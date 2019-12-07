import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import { Splash } from './screens/Splash';
// import { Loading } from './screens/Loading';
// import { Home } from './screens/Home';
// import { ItemBase } from './screens/ItemBase';
// import { ItemCraft } from './screens/ItemCraft';
import { StoreTest } from './screens/StoreTest';

const AppNavigator = createStackNavigator({
        // Splash: {
        //     screen: Splash,
        //     navigationOptions: {
        //         header: null,
        //     }
        // },
        // Loading: {
        //     screen: Loading,
        //     navigationOptions: {
        //         header: null,
        //     }
        // },
        // Home: {
        //     screen: Home,
        //     navigationOptions: {
        //         header: null,
        //     }
        // },
        // ItemBase: {
        //     screen: ItemBase
        // },
        // ItemCraft: {
        //     screen: ItemCraft
        // },
        StoreTest: {
            screen: StoreTest,
            navigationOptions: {
                header: null,
            }
        }
    },
    {
        initialRouteName: 'StoreTest'
    }
);

export default createAppContainer(AppNavigator);

