// Sandbox for new store singleton

import { AsyncStorage } from 'react-native';

import mods from '../data/mods';
// import base_items from '../data/base_items';
// import stats from '../data/stats_english'

import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("test.db");

export default class NewStore {

    static instance = null;
    static isReady = false;
    static _constant_check_first_app_run = "initialized";

    static currentItem = null;
    static possibleMods = null;

    static getInstance(requester = 'unknown') {
        if (NewStore.instance == null) {
            NewStore.initialize_store();
            NewStore.instance = new NewStore();
        }
        return this.instance;
    }

    static async initialize_store() {
        try {
            await NewStore.initialize_database_check()
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
                        NewStore.create_app_tables();
                    }
                },
                NewStore.fail
            );
        });
    }

    static async create_app_tables() {
        console.log('create_app_tables()');
        db.transaction(tx => {
            tx.executeSql(`create table if not exists app_metadata (id integer primary key not null, time_created int, user_id text, version float);`,
                [],
                NewStore.success,
                NewStore.fail
            );
            tx.executeSql(`create table if not exists items (id integer primary key not null, uid integer, name text, class text, base text, rarity text, endgame_type text, prefixes text, suffixes text, groups text, image text);`,
                [],
                NewStore.success,
                NewStore.fail
            );
            tx.executeSql(`create table if not exists item_json (id integer primary key not null, uid integer, data text);`,
                [],
                NewStore.success,
                NewStore.fail
            );
        });
    }

    // If item is going to have shaper, elder, etc tags, they must be included within itemTags
    static generateItemMods(itemTags) {

        let prefixArray = []
        let suffixArray = []
        let totalPrefixWeight = 0
        let totalSuffixWeight = 0

        for (var i = 0; i < mods.prefixes.length; i++) {

            let valid = false
            let restricted = false
            let affixWeight = 0
            
            // Iterate through a mod's tags
            for (var j = 0; j < mods.prefixes[i].spawn_weights.length; j++) {
                
                // Iterate through item's tags
                for (var k = 0; k < itemTags.length; k++) {
                    
                    if (mods.prefixes[i].spawn_weights[j].tag == itemTags[k]) {

                        if (mods.prefixes[i].spawn_weights[j].tag == 'default') {
                            if (mods.prefixes[i].spawn_weights[j].weight > 0) {
                                affixWeight += mods.prefixes[i].spawn_weights[j].weight
                                valid = true
                            }
                        }
                        // not default
                        else {
                            if (mods.prefixes[i].spawn_weights[j].weight == 0) {
                                restricted = true
                                break
                            }
                            else {
                                valid = true
                                affixWeight += mods.prefixes[i].spawn_weights[j].weight
                            }
                        }
                    }
                }

                if (restricted) {
                    valid = false
                    break
                }
            }

            if (valid) {
                totalPrefixWeight += affixWeight
                let mod = {
                    'mod': mods.prefixes[i],
                    'weight': affixWeight
                }
                prefixArray.push(mod)
            }
        }

        for (var i = 0; i < mods.suffixes.length; i++) {

            let valid = false
            let restricted = false
            let affixWeight = 0
            
            // Iterate through a mod's tags
            for (var j = 0; j < mods.suffixes[i].spawn_weights.length; j++) {
                
                // Iterate through item's tags
                for (var k = 0; k < itemTags.length; k++) {
                    
                    if (mods.suffixes[i].spawn_weights[j].tag == itemTags[k]) {

                        if (mods.suffixes[i].spawn_weights[j].tag == 'default') {
                            if (mods.suffixes[i].spawn_weights[j].weight > 0) {
                                valid = true
                                affixWeight += mods.suffixes[i].spawn_weights[j].weight
                            }
                        }
                        // not default
                        else {
                            if (mods.suffixes[i].spawn_weights[j].weight == 0) {
                                restricted = true
                                break
                            }
                            else {
                                valid = true
                                affixWeight += mods.suffixes[i].spawn_weights[j].weight
                            }
                        }
                    }
                }

                if (restricted) {
                    valid = false
                    break
                }
            }

            if (valid) {
                totalSuffixWeight += affixWeight
                let mod = {
                    'mod': mods.suffixes[i],
                    'weight': affixWeight
                }
                suffixArray.push(mod)
            }
        }

        let prefixes = {
            'prefixArray':prefixArray,
            'totalWeight':totalPrefixWeight
        }

        let suffixes = {
            'suffixArray':suffixArray,
            'totalWeight':totalSuffixWeight
        }

        let result = {
            'prefixes':prefixes,
            'suffixes':suffixes
        }
     
        NewStore.possibleMods = {'prefixes':prefixes, 'suffixes':suffixes}
        console.log(NewStore.possibleMods.prefixes.prefixArray.length)
        console.log(NewStore.possibleMods.prefixes.totalWeight)
        console.log(NewStore.possibleMods.suffixes.suffixArray.length)
        console.log(NewStore.possibleMods.suffixes.totalWeight)
    }

    focusItem = async (item_uid, navCallback) => {
        // get item from db

        db.transaction(tx => {
            tx.executeSql(
                `select * from items where uid = ?;`,
                [item_uid],
                (_, _array) => { 
                    NewStore.currentItem = _array[0]; 
                    // This will be replaced with the item retrieved
                    let tags = [ 
                        "not_for_sale",
                        "atlas_base_type",
                        "ringatlas1",
                        "ring",
                        "default"
                    ]
                    NewStore.generateItemMods(tags)
                    navCallback(item_uid)
                },
                (_, error) => { console.log('focusItem cannot find item') }
            );
        });
    }

    createItem = async (itemClass, itemBase, endgameType, navCallback) => {

        // itemBase should be the only key needed, making itemClass unnecessary

        var uid = Date.now();
        let name = itemBase.Name
        let rarity = 'normal'

        let groups = []
        let image = itemBase.image;

        db.transaction(tx => {
            tx.executeSql(
                `insert into items (uid, class, base, rarity, endgame_type) values (?, ?, ?, ?, ?);`,
                [uid, itemClass, JSON.stringify(itemBase), rarity, endgameType],
                (_, _array) => {
                    NewStore.focusItem(uid, navCallback)
                },
                (_, error) => { console.log(error) }
            );
        });
    }


//  Crafting methods

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
                    

                    for (let i = 0; i < game_data.statDescriptions[stat_id].def.key.condCount; i++) {
                
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
                // NewStore.success,
                NewStore.fail
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
                NewStore.fail
            );
        });
    }

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
                NewStore.fail
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
                NewStore.fail
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