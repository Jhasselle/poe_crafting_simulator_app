// Sandbox for new store singleton

import { AsyncStorage } from 'react-native';
import _mods from '../data/mods';
import _stats from '../data/stats';
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


    //  Crafting methods


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

        affixType == 1 ? this._getPrefix(item, callback) : this._getSuffix(item, callback)
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

    // TODO: refactor commented out code
    rollModStats = (mod) => {

        let stat_description = ''
        let rolls = []

        for (let i = 0; i < mod.stats.length; i++) {
            if (mod.stats[i].id in _stats) {

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

                i == 0 ? stat_description = _stats[mod.stats[i].id].English[0].string : stat_description += '\n' + _stats[mod.stats[i].id].English[0].string
            }
        }

        // meme.isThisSpaghetti?
        if (rolls.length == 1) {
            stat_description = stat_description.replace('{0}', rolls[0])
        }
        else if (rolls.length == 2) {
            stat_description = stat_description.replace('{0}', rolls[0])
            stat_description = stat_description.replace('{1}', rolls[1])
        }
        else if (rolls.length == 4) {
            stat_description = stat_description.replace('{0}', rolls[0])
            stat_description = stat_description.replace('{0}', rolls[1])
        }

        let stat = {
            'description': stat_description,
        }

        return stat
    }

    transmutation = async (item, callback) => {

        if (item['rarity'] != 'normal') {
            return
        }
        else {

            item['rarity'] = 'magic'

            let numOfAffixes = this.getRandRangeTwo()
            let initialAffixType = this.getRandRangeTwo();

            // initial affix is randomly a prefix or suffix
            await this.getAffix(item, initialAffixType, callback)

            if (numOfAffixes > 1) {
                // agumentation will be sure to select the affix type that is not the initial
                this.augmentation(item, callback)
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
                        _array[i]['item_base'] = JSON.parse(_array[i]['item_base'])
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