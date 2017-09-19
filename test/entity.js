'use strict';

const fromWikiEntity = require('../lib').fromWikiEntity;
const Entity = require('entitizer.entities').Entity;
const wikiEntity = require('wiki-entity');
const assert = require('assert');

describe('EntityBuilder', function () {
    it('fromWikiEntity en:simple', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q18548924', claims: 'none', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = fromWikiEntity(entities[0], lang);
                assert.equal('Adrian Ursu', entity.name);
                assert.equal('Q18548924', entity.wikiId);
                assert.equal('H', entity.type);

                // console.log(entity.toJSON());
            });
    });
    it('fromWikiEntity ro:simple', function () {
        const lang = 'ro';
        return wikiEntity.getEntities({ language: lang, ids: 'Q18548924', claims: 'none', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = fromWikiEntity(entities[0], lang);
                assert.equal('Adrian Ursu', entity.name);
                assert.equal('Q18548924', entity.wikiId);
                assert.equal('Adrian Ursu (cântăreț)', entity.wikiTitle);
                assert.equal('H', entity.type);
                assert.equal(true, entity.rank > 0);

                // console.log(entity.name, 'rank', entity.rank);

                // console.log(entity.toJSON());
            });
    });
    it('fromWikiEntity Albert Einstein: birth, death dates', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q937', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = fromWikiEntity(entities[0], lang);
                assert.equal('Albert Einstein', entity.name);
                assert.equal('Q937', entity.wikiId);
                assert.equal('H', entity.type);
                assert.equal('Q5', entity.data.P31[0]);
                assert.equal('1879-03-14', entity.data.P569[0]);
                assert.equal('CH', entity.cc2);

                // console.log(entity.name, 'rank', entity.rank);

                // console.log(entity.toJSON());
            });
    });
    it('fromWikiEntity Ștefan cel Mare (unknown dates)', function () {
        const lang = 'ro';
        return wikiEntity.getEntities({ language: lang, titles: 'Ștefan cel Mare', claims: 'item', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = fromWikiEntity(entities[0], lang);
                assert.equal('Ștefan cel Mare', entity.name);
                assert.equal('H', entity.type);
                // human
                assert.equal('Q5', entity.data.P31[0]);
                // birth date
                assert.equal('1429', entity.data.P569[0]);
                // has english wiki title
                assert.ok(!entity.cc2);

                // console.log(entity.name, 'rank', entity.rank);

                // console.log(entity.toJSON());
            });
    });
    it('fromWikiEntity IPhone 5 Product', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q61504', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = fromWikiEntity(entities[0], lang);
                assert.equal('iPhone 5', entity.name);
                // product
                assert.equal('P', entity.type);
                assert.ok(!entity.cc2);

                // console.log(entity.name, 'rank', entity.rank);

                // console.log(entity.toJSON());
            });
    });
    it('fromWikiEntity Chisinau Location data', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q21197', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = fromWikiEntity(entities[0], lang);
                assert.equal('Chișinău', entity.name);
                // Location
                assert.equal('L', entity.type);
                assert.equal('MD', entity.cc2);

                // console.log(entity.name, 'rank', entity.rank);

                // console.log(entity.data);
            });
    });

    it('fromWikiEntity Facebook Organisation data', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q380', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = fromWikiEntity(entities[0], lang);
                assert.equal('Facebook Inc.', entity.name);
                // Organisation
                assert.equal('O', entity.type);
                assert.equal('US', entity.cc2);

                // console.log(entity.name, 'rank', entity.rank);

                // console.log(entity.toJSON());
            });
    });

    it('fromWikiEntity Euro 2016 Event data', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q189571', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = fromWikiEntity(entities[0], lang);
                assert.equal('UEFA Euro 2016', entity.name);
                // Event
                assert.equal('E', entity.type);
                assert.equal('FR', entity.cc2);

                // console.log(entity.name, 'rank', entity.rank);

                // console.log(entity.toJSON());
            });
    });

    it('fromWikiEntity Windows 7 Product data', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q11215', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = fromWikiEntity(entities[0], lang);
                assert.equal('Windows 7', entity.name);
                // Product
                assert.equal('P', entity.type);
                assert.ok(!entity.cc2);

                // console.log(entity.name, 'rank', entity.rank);

                // console.log(entity.toJSON());
            });
    });

    it('Scotland & categories', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q22', claims: 'node', types: true, categories: true })
            .then(function (entities) {
                console.log(entities[0].categories);
                assert.equal(1, entities.length);
                const entity = fromWikiEntity(entities[0], lang);
                assert.equal('Scotland', entity.name);
                assert.equal('L', entity.type);
                assert.ok(entities[0].categories.length);
            });
    });
});
