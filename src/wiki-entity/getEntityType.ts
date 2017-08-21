
import { EntityType } from 'entitizer.entities'
import { WikiEntity } from 'wiki-entity'
import { PlainObject } from '../utils';

const TYPES_MAP: PlainObject<EntityType> = {
    'dbo:PopulatedPlace': EntityType.L,
    'dbo:Place': EntityType.L,
    'schema:Place': EntityType.L,
    'schema:City': EntityType.L,
    'dbo:Location': EntityType.L,
    'wikidata:Q515': EntityType.L,
    'wikidata:Q486972': EntityType.L,

    'schema:Person': EntityType.H,
    'wikidata:Q215627': EntityType.H,
    'dul:NaturalPerson': EntityType.H,
    'wikidata:Q5': EntityType.H,
    'foaf:Person': EntityType.H,
    'dbo:Person': EntityType.H,

    'schema:Organization': EntityType.O,
    'dbo:Organisation': EntityType.O,
    'wikidata:Q43229': EntityType.O,

    'wikidata:Q1656682': EntityType.E,
    'dul:Event': EntityType.E,
    'schema:Event': EntityType.E,
    'dbo:Event': EntityType.E
};

// const TypesKeys = Object.keys(TYPES_MAP);

export function getEntityType(wikiEntity: WikiEntity): EntityType {
    if (!wikiEntity.types) {
        return null;
    }

    for (var i = 0; i < wikiEntity.types.length; i++) {
        if (TYPES_MAP[wikiEntity.types[i]]) {
            return TYPES_MAP[wikiEntity.types[i]];
        }
    }

}
