
import { EntityType } from 'entitizer.entities';
import { WikiEntity, WikidataProperty } from 'wiki-entity';
const countries = require('../../data/countries.json');

// const TypesKeys = Object.keys(TYPES_MAP);

export function getEntityCC2(wikiEntity: WikiEntity, type: EntityType): string {
    if (!wikiEntity || !type) {
        return null;
    }

    const countryIds = getEntityCountryIds(wikiEntity, type);

    for (var i = 0; i < countryIds.length; i++) {
        const id = countryIds[i];
        if (countries[id]) {
            return countries[id].cc2;
        }
    }

    return null;
}

function getEntityCountryIds(wikiEntity: WikiEntity, type: EntityType): string[] {
    let prop: WikidataProperty = wikiEntity.claims.P17;
    switch (type) {
        case EntityType.H:
            // P27 - country of citizenship
            prop = prop || wikiEntity.claims.P27;
            break;
        // case EntityTypes.LOCATION:
        //     // P17 - country
        //     prop = wikiEntity.claims.P17;
        //     break;
        // case EntityTypes.ORGANIZATION:
        //     // P17 - country
        //     prop = wikiEntity.claims.P17;
        //     break;
    }

    return prop && prop.values.map(item => item.value) || [];
}