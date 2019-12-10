// Old, deleted after references no longer needed 

import { AsyncStorage } from 'react-native';
import game_data from '../data/game_data';
import affix_data from '../data/rings';
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("test.db");

export default class Store {

    static instance = null;
    static isReady = false;
    static _constant_check_first_app_run = "initialized";


    static getInstance(requester = 'unknown') {
        if (Store.instance == null) {
            Store.initialize_store();
            Store.instance = new Store();
        }
        return this.instance;
    }

    static async initialize_store() {
        try {
            await Store.initialize_database_check()
            let value = await AsyncStorage.getItem(this._constant_check_first_app_run);
            if (value === null) {
                await AsyncStorage.setItem(this._constant_check_first_app_run, 'true');
            }
            this.isReady = true;
        }
        catch (error) {
            console.log('error:', error);
        }
    }

    // Checks to see if the app has been initialized.
    // The app as been initialized if the app_metadata table exists.
    // If it does not exist, then we create it.
    static async initialize_database_check() {
        db.transaction(tx => {
            tx.executeSql(
                `select * from sqlite_master where type='table' and name='app_metadata';`,
                [],
                (_, { rows: { _array } }) => {
                    if (_array.length == 0) {
                        Store.create_app_tables();
                    }
                },
                Store.fail
            );
        });
    }

    static async create_app_tables() {
        console.log('create_app_tables()');
        db.transaction(tx => {
            tx.executeSql(`create table if not exists app_metadata (id integer primary key not null, time_created int, user_id text, version float);`,
                [],
                Store.success,
                Store.fail
            );
            tx.executeSql(`create table if not exists items (id integer primary key not null, uid integer, name text, class text, base text, rarity text, endgame_type text, prefixes text, suffixes text, groups text, image text);`,
                [],
                Store.success,
                Store.fail
            );
            tx.executeSql(`create table if not exists item_json (id integer primary key not null, uid integer, data text);`,
                [],
                Store.success,
                Store.fail
            );
        });
    }

    createItem = async (itemClass, itemBase, endgameType, callback) => {

        var uid = Date.now();
        let name = itemBase.Name
        let rarity = 'normal'

        let groups = []
        let image = itemBase.image;
        db.transaction(tx => {
            tx.executeSql(
                `insert into items (uid, class, base, rarity, endgame_type) values (?, ?, ?, ?, ?);`,
                [uid, itemClass, JSON.stringify(itemBase), rarity, endgameType],
                callback(uid),
                (_, error) => { console.log(error) }
            );
            // tx.executeSql(
            //     `select * from items where uid = ?;`,
            //     [item_id],
            //     (_, { rows: { _array } }) => { 
            //         _array[0]['base'] = JSON.parse(_array[0]['base'])
            //         callback(_array[0])
            //     },
            //     // Store.success,
            //     Store.fail
            // );
        });
    }


    ////////////////////////////////////////////////////////////////////////////////////////////

    getRandomAffix = async (item) => {
        // console.log('getRandomAffix', item);
        sumOfWeight = 0;
        randomWeight = this.getRandomWeight(affix_data['total_weight']);

        for (let i = 0; i < affix_data['mods'].length; i++) {
            sumOfWeight += affix_data['mods'][i]['weight'];

            // 1) Check if the weight threshold has been met.
            if (sumOfWeight >= randomWeight) {

                // 2) Check to see if the random affix meets the following criteria:

                // 2.a) Does not exist in the "correct groups" set of the existing item.
                //      If it does, reroll.

                // 2.b) The item have space for a prefix or suffix.

                // 2.c) The item's shaper or elder properties are respected.

                // ??? What to do if we reach the end of the affix_data without a match? --> Reroll


                let key = affix_data['mods'][i]['affix']['stats'][0]['key'];
                let stat_id = game_data['stats'][key.toString()]['id'];

                if (affix_data.mods[i].affix.GenerationType == 1) {
                    item.prefixes.push(affix_data['mods'][i])
                    item.groups.push(affix_data.mods[i].affix.CorrectGroup)
                }
                else {
                    item.suffixes.push(affix_data['mods'][i])
                    item.groups.push(affix_data.mods[i].affix.CorrectGroup)
                }
                break
            }
        }

        // return item;
    }


    // affixType cases: 
    //      0 = look at item's state and determine affix type automatically
    //      1 = force prefix
    //      2 = force suffix
    getAffix = async (item, affixType, callback) => {

        if (item.prefixes.length == 3 && item.suffixes.length == 3) {
            return
        }

        if (affixType == 0) {
            if (item.prefixes.length == 3) {
                affixType = 2
            }
            else if (item.suffixes.length == 3) {
                affixType = 1
            }
            else {
                //not pigeon-holed, randomly decide
                affixType = this.getRandRangeTwo();
            }

        }

        console.log('getAffix')
        let sumOfWeight = 0;
        let randomWeight = this.getRandomWeight(affix_data['total_weight']);

        for (let i = 0; i < affix_data['mods'].length; i++) {

            sumOfWeight += affix_data['mods'][i]['weight'];
            // 1) Check if the weight threshold has been met.
            if (sumOfWeight >= randomWeight && affix_data.mods[i].affix.GenerationType == affixType) {

                
                // Does not exist in the "correct groups" set of the existing item.
                //  If it does, reroll.
                if (!item.groups.includes(affix_data.mods[i].affix.CorrectGroup)) {
                    // The item's shaper or elder properties are respected.


    


                    

                    let affixRolls = []
                    for (let i = 0; i < affix_data.mods[i].affix.stats.length; i++) {
                        affixRolls.push(this.getRange(affix_data.mods[i].affix.stats[0].min, affix_data.mods[i].affix.stats[0].max))
                    }


                    let key = affix_data['mods'][i]['affix']['stats'][0]['key'];
                    let stat_id = game_data['stats'][key.toString()]['id'];
                    let stats = { 
                        text: null,
                        rolls: null
                    }
        
                    
                    // console.log(stat_id)
                    // console.log(game_data.statDescriptions[stat_id].def.key.condCount)

                    for (let i = 0; i < game_data.statDescriptions[stat_id].def.key.condCount; i++) {
                        console.log('------------------------')

                        console.log(game_data.statDescriptions[stat_id].def.key);
                
                        if (game_data.statDescriptions[stat_id].def.key.conditions[0].param[0] == '1|#') {
                            console.log('before:', game_data.statDescriptions[stat_id].def.key.conditions[i].text)
                            let text = game_data.statDescriptions[stat_id].def.key.conditions[0].text.replace('%1%%', affixRolls[i])
                            console.log('after:', text)

                            let stats = {
                                text: text,
                                rolls: affixRolls
                            }
                            console.log(stats)
                        }
                        else if (game_data.statDescriptions[stat_id].def.key.conditions[0].param[0] == '#') {
                            let text = game_data.statDescriptions[stat_id].def.key.conditions[0].text.replace('%1$+d', '+' + affixRolls[i]);
                            
                            console.log('text:', text)       

                            stats = {
                                text: text,
                                rolls: affixRolls
                            }
                            console.log(stats)
                        }
                        else if (game_data.statDescriptions[stat_id].def.key.conditions[0].param[0] == '1|99') {
                            let text = game_data.statDescriptions[stat_id].def.key.conditions[0].text.replace('%1%%', affixRolls[i]);
                            
                            console.log('text:', text)       

                            stats = {
                                text: text,
                                rolls: affixRolls
                            }
                            console.log(stats)
                        }
                        else {
                            console.log('REEEEEEEEEEEEEEEEEEEEe:', )
                            let text = game_data.statDescriptions[stat_id].def.key.conditions[0].text
                            stats = {
                                text: text,
                                rolls: affixRolls
                            }

                            console.log(game_data.statDescriptions[stat_id].def.key.conditions[0].param[0])
                            console.log(game_data.statDescriptions[stat_id].def.key.conditions[0].text)
                        }
                    }

                    console.log('affix rolls:', affixRolls)



                    let newAffix = affix_data['mods'][i]
                    newAffix['rolls'] = stats;
                    
                    console.log(newAffix)

                    if (affixType == 1) {
                        item.prefixes.push(newAffix)
                    }
                    else {
                        item.suffixes.push(newAffix)
                    }

                    item.groups.push(affix_data.mods[i].affix.CorrectGroup)
                    await callback({ ...item})
                    break
                }
                else {
                    console.log(affix_data.mods[i].affix.CorrectGroup, ' already exists in item.group')
                }
            }

            // What to do if we reach the end of the affix_data without a match? --> Reroll
            if (i + 1 == affix_data['mods'].length) {
                return this.getAffix(item, affixType, callback);
            }
        }

        return item;

    }


    transmutation = async (item, callback) => {

        // console.log(item);

        if (item['rarity'] != 'normal') {
            return
        }
        else {

            item['rarity'] = 'magic'

            await this.getRandomAffix(item)

            let numOfAffixes = this.getRandRangeTwo()

            if (numOfAffixes == 2) {
                await this.augmentation(item, callback)
                return
            }
            else {
                await callback({ ...item });
                return
            }

            // db.transaction(tx => {
            //     tx.executeSql(
            //         `insert into items (uid, class, base, rarity, endgame_type) values (?, ?, ?, ?, ?);`,
            //         [uid, itemClass, JSON.stringify(itemBase), rarity, endgameType],
            //         callback(uid),
            //         (_, error)=>{console.log(error)}
            //     );
            // });

        }
    }

    augmentation = async (item, callback) => {
        if (item.rarity != 'magic') {
            console.log('augmentation() called BUT item.rarity is not magic')
            return
        }
        else {
            console.log('augmentation() called and item is magic')

            if (item.prefixes.length == 1 && item.suffixes.length == 0) {
                await this.getAffix(item, 2, callback);
            }
            else if (item.prefixes.length == 0 && item.suffixes.length == 1) {
                await this.getAffix(item, 1, callback);
            }
            else
                return
        }
    }

    alteration = async (item, callback) => {

        if (item.rarity != 'magic') {
            console.log('alteration() called BUT item.rarity is not magic')
            return
        }
        else {

            console.log('\tbefore:', item)
            await this.local_scour(item)
            console.log('\after:', item)
            await this.transmutation(item, callback);
            // await callback({...item})

            // if (item.prefixes.length == 1 && item.suffixes.length == 0) {
            //     await this.getAffix(item, 1, callback);
            // }
            // else if (item.prefixes.length == 0 && item.suffixes.length == 1) {
            //     await this.getAffix(item, 2, callback);
            // }
            // else
            //     return
        }
    }


    regal = async (item, callback) => {
        if (item.rarity != 'magic') {
            return
        }
        else {
            item.rarity = 'rare'
            let newAffixType = this.getRandRangeTwo();
            await this.getAffix(item, newAffixType, callback)
            // callback({...item})
        }
    }

    alchemy = async (item, callback) => {
        if (item.rarity != 'normal') {
            return
        }
        else {
            item.rarity = 'rare'
            // between 4 and 6 new affixes
            let numOfAffixes = this.getRandRange(3) + 4

            while (numOfAffixes > 0) {

                await this.getAffix(item, 0, callback)
                numOfAffixes--
            }
        }

    }

    chaos = async (item, callback) => {
        if (item.rarity != 'rare') {
            return
        }
        else {
            // choose between 3 and 6 affixes
            // console.log('chaos', item)
            console.log('chaos')
            await this.local_scour(item)
            await this.alchemy(item, callback)
        }
    }

    annul = async (item, callback) => {
        let prefixLength = item.prefixes.length
        let suffixLength = item.suffixes.length
        let totalLength = prefixLength + suffixLength
        let randomIndex = this.getRandRange(totalLength)
        let cont = true;
        let groupName = ''

        // console.log('annul', totalLength, randomIndex)

        for (var i = 0; i < prefixLength; i++) {
            if (i == randomIndex) {
                groupName = item.prefixes[i].affix.CorrectGroup
                console.log(item.prefixes[i].affix.CorrectGroup)
                console.log(item.groups)
                item.prefixes.splice(i, 1)
                cont = false;
                break;
               
            }
        }

        if (cont) {
            for (var j = 0; j < suffixLength; j++) {
                if (i + j == randomIndex) {
                    groupName = item.suffixes[j].affix.CorrectGroup
                    item.suffixes.splice(j, 1)
                    break;
                }
            }
        }

        for (var k = 0; k < item.groups.length; k++){
            console.log('test', item.groups[k])
            if (item.groups[k] == groupName) {
                item.groups.splice(k, 1);
                break;
            }
        }

        if (item.prefixes.length == 0 && item.suffixes.length == 0) {
            item.rarity = 'normal'
        }
        await callback({ ...item })
        return;
    }

    exalt = async (item, callback) => {
        if (item.rarity != 'rare') {
            return
        }
        else {
            await this.getAffix(item, 0, callback)
            // callback({...item})
        }
    }

    local_scour = async (item) => {
        item.prefixes = []
        item.suffixes = []
        item.groups = []
        item.rarity = 'normal'
    }

    scour = async (item, callback) => {
        item.prefixes = []
        item.suffixes = []
        item.groups = []
        item.rarity = 'normal'

        callback({ ...item })

        console.log('scour', item)
    }




    getItem = async (uid, setItem) => {
        db.transaction(tx => {
            tx.executeSql(
                `select * from items where uid = ?;`,
                [uid],
                (_, { rows: { _array } }) => {
                    _array[0]['base'] = JSON.parse(_array[0]['base'])
                    if (!_array[0]['groups']) {
                        _array[0]['groups'] = []
                    }
                    if (!_array[0]['prefixes']) {
                        _array[0]['prefixes'] = []
                    }
                    if (!_array[0]['suffixes']) {
                        _array[0]['suffixes'] = []
                    }
                    setItem(_array[0]);
                },
                // Store.success,
                Store.fail
            );
        });

    }

    getAllItems = async (callback) => {
        db.transaction(tx => {
            tx.executeSql(
                `select * from items;`,
                [],
                (_, { rows: { _array } }) => {
                    for (var i = 0; i < _array.length; i++) {
                        _array[i]['base'] = JSON.parse(_array[i]['base'])
                    }
                    callback(_array)
                },
                Store.fail
            );
        });
    }


    // Object {
    //     "$index": 607,
    //     "CorrectGroup": "PhysicalDamage",
    //     "Domain": 1,
    //     "GenerationType": 1,
    //     "Id": "AddedPhysicalDamage4",
    //     "Level": 28,
    //     "ModTypeKey": 14,
    //     "Name": "Honed",
    //     "stats": Array [
    //       Object {
    //         "key": 30,
    //         "max": 6,
    //         "min": 4,
    //       },
    //       Object {
    //         "key": 31,
    //         "max": 10,
    //         "min": 9,
    //       },
    //     ],
    // }

    getRandomMagicAffix = async (item) => {

        if (item.prefixes.length == 1 && item.prefixes.length == 1) {
            return;
        }
        else if (item.affixes.prefixes.length == 1) {
            this.getSuffix(item)
        }
        else if (item.affixes.suffixes.length == 1) {
            this.getPrefix(item)
        }
        else {
            this.getRandomAffix(item)
        }
    }


    // Helper functions
    getRandRangeTwo = () => {
        return Math.floor(Math.random() * Math.floor(2)) + 1;
    }

    getRandRange = (range) => {
        return Math.floor(Math.random() * Math.floor(range));
    }

    getRandomWeight = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }

    getRange = (min, max) => {
        return min + (Math.floor(Math.random() * Math.floor(max + 1 - min)));
    }



    // Helper functions

    // Returns a unique ID as a string.
    getUniqueID = async () => {
        try {
            value = null;

            while (value == null) {

                newID = String(Date.now());
                let value = await AsyncStorage.getItem(newID);

                if (value == null) {
                    return newID;
                }
            }
        }
        catch (error) {
            console.log(error)
        }
    }


    nukeDatabase = async () => {
        db.transaction(tx => {
            tx.executeSql("drop table if exists app_metadata;");
            tx.executeSql("drop table if exists items;");
        });
        await AsyncStorage.clear();
    }

    printAllTables = async () => {
        db.transaction(tx => {
            tx.executeSql(
                `select * from sqlite_master where type='table';`,
                [],
                (_, { rows: { _array } }) => { console.log(_array) },
                Store.fail
            );
        });
    }

    printAllItems = async () => {
        db.transaction(tx => {
            tx.executeSql(
                `select * from items;`,
                [],
                (_, { rows: { _array } }) => {
                    for (var i = 0; i < _array.length; i++) {
                        _array[i]['base'] = JSON.parse(_array[i]['base'])
                    }
                },
                Store.fail
            );
        });
    }

    static success() {
        console.log('success')
    }

    static fail() {
        console.log('fail');
    }
}

// Object {
    //     "base": Object {
    //       "$index": 2279,
    //       "DropLevel": 59,
    //       "Id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe17",
    //       "ItemClass": 11,
    //       "Name": "Siege Axe",
    //       "canSocket": true,
    //       "height": 3,
    //       "image": 66,
    //       "implicits": Array [],
    //       "maxSockets": 3,
    //       "stats": Object {
    //         "req": Object {
    //           "dex": 82,
    //           "int": 0,
    //           "str": 119,
    //         },
    //         "weapon": Object {
    //           "attackSpeed": 667,
    //           "crit": 500,
    //           "dMax": 70,
    //           "dMin": 38,
    //           "range": 11,
    //         },
    //       },
    //       "tags": Array [
    //         0,
    //         8,
    //         15,
    //         23,
    //         81,
    //       ],
    //       "width": 2,
    //     },
    //     "class": "One Hand Axe",
    //     "endgame_type": "shaper",
    //     "groups": null,
    //     "id": 8,
    //     "image": null,
    //     "name": null,
    //     "prefixes": null,
    //     "rarity": "normal",
    //     "suffixes": null,
    //     "uid": 1573712118589,
    //   }