'use strict';

const debug = require('debug')('script');
const request = require('request');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');

class QueryData {
    constructor() {
        this.CACHE = {}
    }

    formatFileName(id) {
        return path.join(__dirname, '../data/P279/' + id + '.json');
    }

    getCacheIds(id) {
        if (this.CACHE[id]) {
            debug('ids from CACHE');
            return this.CACHE[id];
        }
        const file = this.formatFileName(id);
        try {
            const stats = fs.statSync(file);
            // is expired:
            if (stats.ctimeMs < Date.now() - 1000 * 60 * 60 * 24 * 14) {
                debug('file cache is expired');
                return null;
            }
            debug('ids from file');
            return this.CACHE[id] = JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (e) {
            debug('error ' + e.message);
            return null;
        }
    }

    setCacheIds(id, ids) {
        fs.writeFileSync(this.formatFileName(id), JSON.stringify(ids), 'utf8');
    }

    query(id) {
        let ids = this.getCacheIds(id);
        if (ids) {
            return Promise.resolve(ids);
        }
        return Promise.delay(1000 * 0.2)
            .then(() => new Promise((resolve, reject) => {
                request({
                    url: 'https://query.wikidata.org/bigdata/namespace/wdq/sparql',
                    method: 'GET',
                    qs: {
                        query: `SELECT DISTINCT ?item ?itemLabel
    WHERE
    {
        ?item wdt:P279 wd:${id} .
        SERVICE wikibase:label {
            bd:serviceParam wikibase:language "en,de,fr,ru,es" 
        }
    }
    ORDER BY ?item
    limit 1000`
                    },
                    json: true
                }, (error, response, json) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!json.results || !json.results.bindings || !json.results.bindings.length) {
                        // console.log('result is null', json);
                        return resolve([]);
                    }

                    const ids = json.results.bindings.filter(it => it.itemLabel && it.itemLabel['xml:lang'] && it.itemLabel.value)
                        .map(it => it.item.value.substr(it.item.value.indexOf('/entity/') + 8));
                    // ids.unshift(id);
                    this.setCacheIds(id, ids);
                    resolve(ids);
                });
            }));
    }
}

const queryData = new QueryData();

const DATA_MAP = {
    // Events: Event, 
    E: { list: ['Q1656682', 'Q1190554'], deep: 3 },
    // Persons: Human
    H: { list: ['Q5'], deep: 3 },
    // Organizations: Organization (Q43229), TV chanel(Q2001305), radio chanel (Q28114677)
    O: { list: ['Q43229', 'Q2001305', 'Q28114677'], deep: 4 },
    // Locations: Location (Q17334923), political teritory entity (Q1048835), administrative territorial entity (Q56061), place of worship (Q1370598), natural geographic object(Q35145263), landform(Q271669), venue(Q17350442)
    L: { list: ['Q17334923', 'Q1048835', 'Q56061', 'Q1370598', 'Q35145263', 'Q271669', 'Q1076486'], deep: 4 },
    // Works: work (Q386724), intellectual work (Q15621286), creative work (Q17537576), fictitious entity (Q14897293), fictional character (Q95074), mythical character (Q4271324), publication (Q732577)
    // Products: product (Q2424752), brand (Q431289), model (Q17444171), award (Q15229207), service on internet(Q1668024)
    P: { list: ['Q2424752', 'Q431289', 'Q17444171', 'Q1668024'], deep: 4 }
};

function unique(list) {
    return list.filter(function (item, pos, self) {
        return self.indexOf(item) === pos;
    });
}

function exploreIds(ids, deep, mainList, loopCount) {
    debug('eploring ids:', ids);
    mainList = mainList || [];
    loopCount = loopCount || 0;

    if (ids.length === 0 || loopCount === deep) {
        return unique(mainList);
    }

    return Promise.map(ids, (id) => queryData.query(id), { concurrency: 1 })
        .then(function (lists) {
            for (var i = 1; i < lists.length; i++) {
                lists[0] = lists[0].concat(lists[i]);
            }
            return unique(lists[0]);
        })
        .delay(1000 * 2)
        .then(function (list) {
            return exploreIds(list, deep, mainList.concat(list), 1 + loopCount);
        });
}

function buildResult() {
    const props = {};

    Object.keys(DATA_MAP).forEach(function (key) {
        props[key] = exploreIds(DATA_MAP[key].list, DATA_MAP[key].deep)
            .then(list => list.concat(DATA_MAP[key].list))
            .then(unique);
    });

    return Promise.props(props);
}

function saveResult(result) {
    try {
        fs.writeFileSync(path.join(__dirname, '../data/entity_types.json'), JSON.stringify(result), { encoding: 'utf8' });
    } catch (e) {
        return Promise.reject(e);
    }
    return Promise.resolve();
}

function run() {
    return buildResult().then(saveResult);
}

run()
    .then(function () {
        console.log('OK');
    })
    .catch(function (error) {
        console.error(error);
    });


