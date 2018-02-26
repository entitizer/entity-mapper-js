
// const debug = require('debug')('models-builder');
import { WikiEntity } from 'wiki-entity';
import { Entity, EntityType } from 'entitizer.entities';
import { getEntityType } from './getEntityType';
import { getEntityType as getEntityInstanceType } from './getEntityInstanceType';
import { getEntityTypeByExtract } from './getEntityTypeByExtract';
import { getEntityData } from './getEntityData';
import { getEntityCC2 } from './getEntityCountry';
import { uniq } from '../utils';

export type WikiEntityToEntityOptions = {
    defaultType?: EntityType
}

export function wikiEntityToEntity(wikiEntity: WikiEntity, lang: string, options?: WikiEntityToEntityOptions): Entity {
    // debug('wikiEntityToEntity:', lang, wikiEntity);
    options = options || {};
    const entity: Entity = {};
    entity.lang = lang.toLowerCase();
    entity.wikiId = wikiEntity.id;
    entity.name = wikiEntity.label;
    entity.description = wikiEntity.description;
    entity.wikiPageId = wikiEntity.pageid;
    entity.extract = wikiEntity.extract;
    if (wikiEntity.types) {
        entity.types = uniq(wikiEntity.types.filter(item => !/:(Thing|Agent)$/.test(item)));
    }
    entity.type = getEntityType(wikiEntity);
    if (!entity.type) {
        entity.type = getEntityInstanceType(wikiEntity);
        if (!entity.type && entity.extract && !entity.types) {
            entity.type = getEntityTypeByExtract(entity.extract, lang);
        }
        if (!entity.type && options.defaultType) {
            entity.type = options.defaultType;
        }
    }

    entity.rank = 1;
    if (wikiEntity.sitelinks) {
        entity.wikiTitle = wikiEntity.sitelinks[lang];
        entity.rank += (Object.keys(wikiEntity.sitelinks).length * 5);
    }

    entity.aliases = createAliases(wikiEntity);
    entity.rank += entity.aliases.length;
    entity.categories = createCategories(wikiEntity);

    if (wikiEntity.claims) {
        const ids = Object.keys(wikiEntity.claims);
        if (ids.length) {
            entity.data = getEntityData(wikiEntity);
        }

        entity.cc2 = getEntityCC2(wikiEntity);

        entity.rank += ids.length;
    }

    entity.rank = Math.round(entity.rank);

    return entity;
}

function createAliases(entity: WikiEntity) {
    let aliases = entity.aliases || [];
    // aliases = aliases.concat(entity.redirects || []);
    return uniq(aliases);
}

function createCategories(entity: WikiEntity) {
    let categories = entity.categories || [];
    return uniq(categories);
}
