# entitizer.entity-mapper

Entitizer entity mapper module.

## Usage

```
import { getEntities } from 'wiki-entity';
import { fromWikiEntity } from 'entitizer.entity-mapper';

const language = 'en';
// get Europe by title
getEntities({ language, titles: 'Europe' })
    .then(entities => {
        const wikiEntity = entities[0];
        // convert WikiEntity to an Entitizer Entity
        const entity = fromWikiEntity(wikiEntity, language);
    });
```
