
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

    return getTypeByProp(wikiEntity, 'P279');
}


function getTypeByProp(wikiEntity: WikiEntity, prop: string): EntityType {
    const instanceOf = wikiEntity.claims[prop];

    if (!instanceOf) {
        return null;
    }

    // for every value of instanceOf:
    for (var i = 0; i < instanceOf.values.length; i++) {
        // value is Event
        if (~ENTITY_TYPES.E.indexOf(instanceOf.values[i].value)) {
            return EntityType.E;
        }
        // value is Person
        if (~ENTITY_TYPES.H.indexOf(instanceOf.values[i].value)) {
            return EntityType.H;
        }
        // value is Org
        if (~ENTITY_TYPES.O.indexOf(instanceOf.values[i].value)) {
            return EntityType.O;
        }
        // value is Location
        if (~ENTITY_TYPES.L.indexOf(instanceOf.values[i].value)) {
            return EntityType.L;
        }
        // value is Product
        if (~ENTITY_TYPES.P.indexOf(instanceOf.values[i].value)) {
            return EntityType.P;
        }
    }

    return null;
}
