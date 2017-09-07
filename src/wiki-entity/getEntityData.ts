
import { WikiEntity } from 'wiki-entity';
import { Entity, EntityType, EntityData } from 'entitizer.entities';
import { PlainObject } from '../utils';

export function getEntityData(wikiEntity: WikiEntity): EntityData {
    if (!wikiEntity.claims) {
        return null;
    }

    const data: EntityData = {};

    for (let key in wikiEntity.claims) {
        const values = wikiEntity.claims[key].values;
        data[key] = [];

        values.forEach(value => {
            const v: { value: string, label?: string } = { value: value.value_string || value.value.toString() };
            if (value.label && v.value !== value.label) {
                v.label = value.label;
            }
            data[key].push(v.value);
        });
    }

    return data;
}
