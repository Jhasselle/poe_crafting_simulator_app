// Sandbox for new store singleton

import { AsyncStorage } from 'react-native';
import _mods from '../data/mods';
import _stats from '../data/stats';
import _names from '../data/rare_names';
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("test.db");


export default class Store {

    static instance = null;
    static isReady = false;
    static _constant_check_first_app_run = "initialized";
    static currentItem = null;
    static possibleMods = null;

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
            tx.executeSql(`create table if not exists items (id integer primary key not null, uid integer, name text, item_base text, rarity text, endgame_tags text, prefixes text, suffixes text, groups text, image text);`,
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

    // If item is going to have shaper, elder, etc tags, they must be included within itemTags
    static generateItemMods(itemTags) {

        let prefixArray = []
        let suffixArray = []
        let totalPrefixWeight = 0
        let totalSuffixWeight = 0

        for (var i = 0; i < _mods.prefixes.length; i++) {

            let valid = false
            let restricted = false
            let affixWeight = 0

            // Iterate through a mod's tags
            for (var j = 0; j < _mods.prefixes[i].spawn_weights.length; j++) {

                // Iterate through item's tags
                for (var k = 0; k < itemTags.length; k++) {

                    if (_mods.prefixes[i].spawn_weights[j].tag == itemTags[k]) {

                        if (_mods.prefixes[i].spawn_weights[j].tag == 'default') {
                            if (_mods.prefixes[i].spawn_weights[j].weight > 0) {
                                affixWeight += _mods.prefixes[i].spawn_weights[j].weight
                                valid = true
                            }
                        }
                        // not default
                        else {
                            if (_mods.prefixes[i].spawn_weights[j].weight == 0) {
                                restricted = true
                                break
                            }
                            else {
                                valid = true
                                affixWeight += _mods.prefixes[i].spawn_weights[j].weight
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
                    'mod': _mods.prefixes[i],
                    'weight': affixWeight
                }
                prefixArray.push(mod)
            }
        }

        for (var i = 0; i < _mods.suffixes.length; i++) {

            let valid = false
            let restricted = false
            let affixWeight = 0

            // Iterate through a mod's tags
            for (var j = 0; j < _mods.suffixes[i].spawn_weights.length; j++) {

                // Iterate through item's tags
                for (var k = 0; k < itemTags.length; k++) {

                    if (_mods.suffixes[i].spawn_weights[j].tag == itemTags[k]) {

                        if (_mods.suffixes[i].spawn_weights[j].tag == 'default') {
                            if (_mods.suffixes[i].spawn_weights[j].weight > 0) {
                                valid = true
                                affixWeight += _mods.suffixes[i].spawn_weights[j].weight
                            }
                        }
                        // not default
                        else {
                            if (_mods.suffixes[i].spawn_weights[j].weight == 0) {
                                restricted = true
                                break
                            }
                            else {
                                valid = true
                                affixWeight += _mods.suffixes[i].spawn_weights[j].weight
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
                    'mod': _mods.suffixes[i],
                    'weight': affixWeight
                }
                suffixArray.push(mod)
            }
        }

        let prefixes = {
            'prefixArray': prefixArray,
            'totalWeight': totalPrefixWeight
        }

        let suffixes = {
            'suffixArray': suffixArray,
            'totalWeight': totalSuffixWeight
        }

        let result = {
            'prefixes': prefixes,
            'suffixes': suffixes
        }

        Store.possibleMods = { 'prefixes': prefixes, 'suffixes': suffixes }
    }

    focusItem = async (item_uid, navigation_callback) => {
        // get item from db

        db.transaction(tx => {
            tx.executeSql(
                `select * from items where uid = ? limit 1;`,
                [item_uid],
                (_, { rows: { _array } }) => {
                    let item_base = JSON.parse(_array[0]['item_base'])
                    // let endgame_tags = JSON.parse(_array[0]['endgame_tags'])
                    let tags = item_base.tags
                    Store.generateItemMods(tags)
                    navigation_callback(item_uid)
                },
                (_, error) => { console.log('focusItem cannot find item') }
            );
        });
    }

    // TODO: find what endgame type an item is based on its tags
    createItem = async (item_base, endgame_tags, navigation_callback) => {

        let item_uid = Date.now()
        let name = ''
        let rarity = 'normal'
        let groups = []
        // let image = item_base.image;

        db.transaction(tx => {
            tx.executeSql(
                `insert into items (uid, item_base, name, rarity, endgame_tags) values (?, ?, ?, ?, ?);`,
                [item_uid, JSON.stringify(item_base), name, rarity, JSON.stringify(endgame_tags)],
                (_, _array) => {
                    // Navigates to loading screen
                    navigation_callback(item_uid)
                },
                (_, error) => { console.log(error) }
            );
        });
    }

    // TODO: 1) have this be a single source to determine whether prefixes or suffixes are allowed
    //       2) don't allow forcing
    //  affixType cases: 
    //      0 = look at item's state and determine affix type automatically
    //      1 = force prefix
    //      2 = force suffix
    getAffix = async (item, affixType = 0, callback) => {

        if (item.prefixes.length == 3 && item.suffixes.length == 3) {
            // Has maximum affixes
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

        affixType == 1 
            ? this._getPrefix(item, callback) 
            : this._getSuffix(item, callback)
    }


    _getPrefix = async (item, callback) => {

        let found = false

        while (!found) {

            let sumOfWeight = 0
            let affixTotalWeight = Store.possibleMods.prefixes.totalWeight
            let randomWeight = this.getRandomWeight(affixTotalWeight)

            for (let i = 0; i < Store.possibleMods.prefixes.prefixArray.length; i++) {

                sumOfWeight += Store.possibleMods.prefixes.prefixArray[i].weight
    
                if (sumOfWeight >= randomWeight) {
    
                    if (!item.groups.includes(Store.possibleMods.prefixes.prefixArray[i].mod.group)) {
    
                        let newAffix = Store.possibleMods.prefixes.prefixArray[i].mod
                        let stats = this.rollModStats(newAffix)
    
                        newAffix['rolls'] = stats;
                        item.prefixes.push(newAffix)
                        item.groups.push(Store.possibleMods.prefixes.prefixArray[i].mod.group)
                        await callback({ ...item })
                        found = true

                        db.transaction(tx => {
                            tx.executeSql(
                                `update items set item_base=?, name=?, rarity=?, endgame_tags=?, prefixes=?, suffixes=? where uid=?;`,
                                [JSON.stringify(item.item_base), item.name, item.rarity, JSON.stringify(item.endgame_tags), JSON.stringify(item.prefixes), JSON.stringify(item.suffixes), item.uid]
                            );
                        });

                        break
                    }
                }
            }
        }
    }


    _getSuffix = async (item, callback) => {

        let found = false

        while (!found) {

            let sumOfWeight = 0
            let affixTotalWeight = Store.possibleMods.suffixes.totalWeight
            let randomWeight = this.getRandomWeight(affixTotalWeight)

            for (let i = 0; i < Store.possibleMods.suffixes.suffixArray.length; i++) {

                sumOfWeight += Store.possibleMods.suffixes.suffixArray[i].weight
    
                if (sumOfWeight >= randomWeight) {
    
                    if (!item.groups.includes(Store.possibleMods.suffixes.suffixArray[i].mod.group)) {
    
                        let newAffix = Store.possibleMods.suffixes.suffixArray[i].mod
                        let stats = this.rollModStats(newAffix)
                        
                        newAffix['rolls'] = stats;
                        item.suffixes.push(newAffix)
                        item.groups.push(Store.possibleMods.suffixes.suffixArray[i].mod.group)
                        await callback({ ...item })
                        found = true

                        db.transaction(tx => {
                            tx.executeSql(
                                `update items set item_base=?, name=?, rarity=?, endgame_tags=?, prefixes=?, suffixes=? where uid=?;`,
                                [JSON.stringify(item.item_base), item.name, item.rarity, JSON.stringify(item.endgame_tags), JSON.stringify(item.prefixes), JSON.stringify(item.suffixes), item.uid]
                            );
                        });

                        break
                    }
                }
            }
        }
    }

    // TODO:
    // Add rolls stat object (to accomodate divine orb functionality).
    rollModStats = (mod) => {

        let descriptions = {text:[], rolls:[]} 
        let rolls = []

        for (let i = 0; i < mod.stats.length; i++) {
            
            if (mod.stats[i].id in _stats) {

                rolls = []

                for (let j = 0; j < mod.stats.length; j++) {

                    
                    let roll = this.getRange(mod.stats[j].min, mod.stats[j].max)

                    if (_stats[mod.stats[i].id].English[0].index_handlers[0][0] == 'divide_by_one_hundred') {
                        roll = roll / 100

                    }
                    else if (_stats[mod.stats[i].id].English[0].index_handlers[0][0] == 'per_minute_to_per_second') {
                        roll = (roll / 60).toFixed(2)
                    }

                    rolls.push(roll)
                }
                descriptions.text.push(_stats[mod.stats[i].id].English[0].string)
            }
            descriptions.rolls = rolls
        }


        if (descriptions.text.length >= 1) {
            if (descriptions.rolls.length == 1) {
               
                switch(_stats[mod.stats[0].id].English[0].format[0]) {
                    case '+#%': 
                        descriptions.text[0] = descriptions.text[0].replace('{0}', '+' + descriptions.rolls[0] + '%')
                        break
                    case '+#': 
                        descriptions.text[0] = descriptions.text[0].replace('{0}', '+' + descriptions.rolls[0])
                        break
                    default: 
                        descriptions.text[0] = descriptions.text[0].replace('{0}', descriptions.rolls[0])
                }
                
            }
            else if (descriptions.rolls.length == 2) {
                if (descriptions.rolls[1] == 0) {
                    descriptions.text.pop()
                }
                    descriptions.text[0] = descriptions.text[0].replace('{0}', descriptions.rolls[0])
                    descriptions.text[0] = descriptions.text[0].replace('{1}', descriptions.rolls[1])
                    if (descriptions.text.length > 1) {
                        if (_stats[mod.stats[0].id].English[0].format == '#') {
                            descriptions.text[1] = descriptions.text[1].replace('{0}', + descriptions.rolls[1])
                        }
                        else {
                            descriptions.text[1] = descriptions.text[1].replace('{0}', '+' + descriptions.rolls[1])
                        }
                    }
            }
            else if (descriptions.rolls.length == 3) {
                console.log(descriptions)
                console.log(mod.stats)
                console.log(_stats[mod.stats[0].id].English[0].format)


                if (_stats[mod.stats[0].id].English[0].format.length == 2 && _stats[mod.stats[0].id].English[0].format[0] != 'ignore') {
                    if (_stats[mod.stats[0].id].English[0].format[1] != 'ignore') {
                        descriptions.text[0] = descriptions.text[0].replace('{0}', descriptions.rolls[0])
                        descriptions.text[0] = descriptions.text[0].replace('{1}', descriptions.rolls[1])
                        descriptions.text[1] = descriptions.text[1].replace('{0}', + descriptions.rolls[2]) 
                    }
                    else {
                        descriptions.text[0] = descriptions.text[0].replace('{0}', descriptions.rolls[0])
                        descriptions.text[1] = descriptions.text[1].replace('{0}', descriptions.rolls[1])
                        descriptions.text[1] = descriptions.text[1].replace('{1}', + descriptions.rolls[2]) 
                    }   
                }
                else {
                    descriptions.text[0] = descriptions.text[0].replace('{0}', descriptions.rolls[0])
                    descriptions.text[1] = descriptions.text[1].replace('{0}', descriptions.rolls[1])
                    descriptions.text[1] = descriptions.text[1].replace('{1}', + descriptions.rolls[2])
                }
            }
        }       

        let stat = {
            'description': descriptions,
            'added_phys': 0,
            'increased_phys': 0,
            'increased_speed': 0,
            'increased_crit': 0
        }

        return stat
    }


    transmutation = async (item, callback) => {
        if (item.rarity != 'normal') {
            return
        }
        else {
            item.rarity = 'magic'
            let numOfAffixes = this.getRandRangeTwo()
            let initialAffixType = this.getRandRangeTwo();

            // initial affix is randomly a prefix or suffix
            await this.getAffix(item, initialAffixType, callback)

            if (numOfAffixes > 1) {
                // augmentation will be sure to select the affix type that is not the initial
                this.augmentation(item, callback)
            }
            else {
                // augmentation will call this as well
                await this.generateMagicName(item, callback)
            }
            
        }
    }


    augmentation = async (item, callback) => {
        if (item.rarity != 'magic') {
            return
        }
        else {
            if (item.prefixes.length == 1 && item.suffixes.length == 0) {
                await this.getAffix(item, 2, callback);
                await this.generateMagicName(item, callback)
            }
            else if (item.prefixes.length == 0 && item.suffixes.length == 1) {
                await this.getAffix(item, 1, callback);
                await this.generateMagicName(item, callback)
            }
        }
    }


    alteration = async (item, callback) => {

        if (item.rarity != 'magic') {
            return
        }
        else {
            await this.local_scour(item)
            await this.transmutation(item, callback);
        }
    }


    regal = async (item, callback) => {
        if (item.rarity != 'magic') {
            return
        }
        else {
            item.name = this.getRareName()
            item.rarity = 'rare'
            let newAffixType = this.getRandRangeTwo();
            await this.getAffix(item, newAffixType, callback)
        }
    }


    alchemy = async (item, callback) => {
        if (item.rarity != 'normal') {
            return
        }
        else {
            item.name = this.getRareName()
            item.rarity = 'rare'
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
            await this.local_scour(item)
            await this.alchemy(item, callback)
        }
    }


    // TODO: optimize how affix to remove is selected
    annul = async (item, callback) => {
        let prefixLength = item.prefixes.length
        let suffixLength = item.suffixes.length
        let totalLength = prefixLength + suffixLength
        let cont = true;
        let groupName = ''
        let randomIndex = this.getRandRange(totalLength)

        // Prefixes and Suffixes are in two different arrays,
        // This can be optimized
        for (var i = 0; i < prefixLength; i++) {
            if (i == randomIndex) {
                groupName = item.prefixes[i].group
                item.prefixes.splice(i, 1)
                cont = false;
                break;
            }
        }
        if (cont) {
            for (var j = 0; j < suffixLength; j++) {
                if (i + j == randomIndex) {
                    groupName = item.suffixes[j].group
                    item.suffixes.splice(j, 1)
                    break;
                }
            }
        }

        for (var k = 0; k < item.groups.length; k++) {
            if (item.groups[k] == groupName) {
                item.groups.splice(k, 1);
                break;
            }
        }

        if (item.prefixes.length == 0 && item.suffixes.length == 0) {
            item.rarity = 'normal'
        }

        // Save
        db.transaction(tx => {
            tx.executeSql(
                `update items set item_base=?, name=?, rarity=?, endgame_tags=?, prefixes=?, suffixes=? where uid=?;`,
                [JSON.stringify(item.item_base), item.name, item.rarity, JSON.stringify(item.endgame_tags), JSON.stringify(item.prefixes), JSON.stringify(item.suffixes), item.uid],
                callback({ ...item }) // updates item state from perspective of user
            );
        });

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
        item.name = ''
        item.rarity = 'normal'

        callback({ ...item })
    }

    getItem = async (item_uid, setItem) => {
        db.transaction(tx => {
            tx.executeSql(
                `select * from items where uid = ?;`,
                [item_uid],
                (_, { rows: { _array } }) => {
                    _array[0]['endgame_tags'] = JSON.parse(_array[0]['endgame_tags'])
                    _array[0]['item_base'] = JSON.parse(_array[0]['item_base'])

                    if (!_array[0]['groups']) {
                        _array[0]['groups'] = []
                    }

                    if (!_array[0]['prefixes']) {
                        _array[0]['prefixes'] = []
                    }
                    else {
                        _array[0]['prefixes'] = JSON.parse(_array[0]['prefixes'])
                    }

                    if (!_array[0]['suffixes']) {
                        _array[0]['suffixes'] = []
                    }
                    else {
                        _array[0]['suffixes'] = JSON.parse(_array[0]['suffixes'])
                    }
                    setItem(_array[0]);
                },
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
                        _array[i]['endgame_tags'] = JSON.parse(_array[i]['endgame_tags'])
                        _array[i]['item_base'] = JSON.parse(_array[i]['item_base'])
                        _array[i]['prefixes'] = JSON.parse(_array[i]['prefixes'])
                        _array[i]['suffixes'] = JSON.parse(_array[i]['suffixes'])
                    }
                    callback(_array)
                },
                Store.fail
            );
        });
    }

    getRareName = () => {
        return _names.prefixes[this.getRandRange(_names.prefixes.length)] + ' ' + _names.suffixes[this.getRandRange(_names.suffixes.length)]
    }

    generateMagicName = async (item, callback) => {
        let result = item.item_base.name

        item.prefixes.length == 1
            ?   result = item.prefixes[0].name + ' ' + result
            :   null

        item.suffixes.length == 1
            ?   result = result + ' ' + item.suffixes[0].name
            :   null

        item.name = result           
        callback({...item})
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

    // Returns a unique ID as string.
    getUniqueID = async () => {
        try {
            let value = null;

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

    deleteItems = async (selectedItems, setItems) => {
        db.transaction(tx => {
            for (let i = 0; i < selectedItems.length; i++){
                tx.executeSql(
                    "delete from items where uid=?;",
                    [selectedItems[i]]
                )
            }
            tx.executeSql(
                `select * from items;`,
                [],
                (_, { rows: { _array } }) => {
                    for (var i = 0; i < _array.length; i++) {
                        _array[i]['endgame_tags'] = JSON.parse(_array[i]['endgame_tags'])
                        _array[i]['item_base'] = JSON.parse(_array[i]['item_base'])
                        _array[i]['prefixes'] = JSON.parse(_array[i]['prefixes'])
                        _array[i]['suffixes'] = JSON.parse(_array[i]['suffixes'])
                    }
                    setItems(_array)
                },
                Store.fail
            );
        });
        
    }

    nukeDatabase = async () => {
        console.log('Nuclear launch detected...')
        db.transaction(tx => {
            tx.executeSql("drop table if exists app_metadata;");
            tx.executeSql("drop table if exists items;");
        });
        await AsyncStorage.clear();
    }

    static success() {
        console.log('success')
    }

    static fail() {
        console.log('fail');
    }
}