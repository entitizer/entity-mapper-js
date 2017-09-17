
// const debug = require('debug')('models-builder');
import { WikiEntity, WikidataPropertyValue } from 'wiki-entity';
import { Entity, EntityType } from 'entitizer.entities';
import { getEntityType } from './getEntityType';
import { getEntityType as getEntityInstanceType } from './getEntityInstanceType';
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
    entity.type = getEntityType(wikiEntity);
    if (!entity.type) {
        entity.type = getEntityInstanceType(wikiEntity);
        if (!entity.type && options.defaultType) {
            entity.type = options.defaultType;
        }
    }
    if (wikiEntity.types) {
        entity.types = uniq(wikiEntity.types.filter(item => !/:(Thing|Agent)$/.test(item)));
        // entity.types = uniq(entity.types.map(type => type.split(':')[1]));
    }
    entity.name = wikiEntity.label;
    entity.description = wikiEntity.description;
    entity.wikiPageId = wikiEntity.pageid;
    entity.extract = wikiEntity.extract;
    entity.rank = 1;
    if (wikiEntity.sitelinks) {
        entity.wikiTitle = wikiEntity.sitelinks[lang];
        entity.rank += (Object.keys(wikiEntity.sitelinks).length * 5);
    }

    entity.aliases = wikiEntity.aliases || [];
    entity.aliases = entity.aliases.concat(wikiEntity.redirects || []);
    if (entity.aliases.length) {
        // entity.aliases = _.uniqBy(entity.aliases, al => atonic(al.toLowerCase()));
        entity.rank += entity.aliases.length;
    }

    entity.aliases = uniq(entity.aliases);

    if (wikiEntity.claims) {
        const ids = Object.keys(wikiEntity.claims);
        if (ids.length) {
            // detect wikiImage
            // for (var i = 0; i < ids.length; i++) {
            //     const img: WikidataPropertyValue = _.find(wikiEntity.claims[ids[i]].values, { datatype: 'commonsMedia' });
            //     if (img) {
            //         entity.wikiImage = img.value;
            //         break;
            //     }
            // }
            entity.data = getEntityData(wikiEntity);
        }

        if (entity.type) {
            entity.cc2 = getEntityCC2(wikiEntity, entity.type);
        }

        entity.rank += ids.length;
    }

    entity.rank = Math.round(entity.rank);

    return entity;
}
