
import { EntityType } from 'entitizer.entities';
import { PlainObject } from '../utils';

type InfoRegType = { reg: RegExp, type: EntityType };

const MAP: PlainObject<InfoRegType[]> = {
    ro: [
        { reg: /\beste un (sat|oraș|județ|raion)\b/i, type: EntityType.L },
        { reg: /\beste o (comună|biserică|mănăstire)\b/i, type: EntityType.L },
        { reg: /\beste o (organizație)\b/i, type: EntityType.O },
        // { reg: /\beste un (show)\b/i, type: EntityType.O },
        { reg: /\beste un (om|scriitor|poet|cercetător|politician|businessman|cântăreț|muzician)\b/i, type: EntityType.H },
        { reg: /\beste o (scriitoare|poetă|cercetătoare|politiciană|cântăreață)\b/i, type: EntityType.H }
    ]
}

export function getEntityTypeByExtract(extract: string, lang: string): EntityType {
    if (extract) {
        extract = extract.substr(0, 100);
        const map = MAP[lang];
        if (map && map.length) {
            for (var i = 0; i < map.length; i++) {
                const item = map[i];
                if (item.reg.test(extract)) {
                    return item.type;
                }
            }
        }
    }
}
