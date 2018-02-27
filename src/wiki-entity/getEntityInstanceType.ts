
import { EntityType } from 'entitizer.entities';
import { WikiEntity } from 'wiki-entity';
import { PlainObject } from '../utils';
const ENTITY_TYPES: PlainObject<string[]> = require('../../data/entity_types.json');

export function getEntityType(wikiEntity: WikiEntity): EntityType {
    if (!wikiEntity.claims) {
        return null;
    }

    const type = getTypeByProp(wikiEntity, 'P31');
    if (type) {
        return type;
    }

    // return getTypeByProp(wikiEntity, 'P279');
}


function getTypeByProp(wikiEntity: WikiEntity, prop: string): EntityType {
    const instanceOf = wikiEntity.claims[prop];

    if (!instanceOf) {
        return null;
    }

    const types = ['E', 'H', 'L', 'O', 'P'];
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        for (let j = 0; j < instanceOf.values.length; j++) {
            const value = instanceOf.values[j].value;
            if (~ENTITY_TYPES[type].indexOf(value)) {
                return <EntityType>type;
            }
        }
    }

    return null;
}
