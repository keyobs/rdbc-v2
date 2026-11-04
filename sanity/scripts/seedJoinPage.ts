/** Preview: sanity exec scripts/seedJoinPage.ts --with-user-token. Add -- --apply to create drafts. */
import {getCliClient} from 'sanity/cli'
import fr from '../../src/i18n/fr'
import en from '../../src/i18n/en'
import {JOIN_ROLES} from '../joinRoles'
import type {JoinPage, JoinRole} from '../sanity.types'

type SeedDocument =
  | Omit<JoinPage, '_rev' | '_createdAt' | '_updatedAt'>
  | Omit<JoinRole, '_rev' | '_createdAt' | '_updatedAt'>

const localized = (fr: string, en: string) => ({fr, en})
const documents: SeedDocument[] = [
  {
    _id: 'joinPage',
    _type: 'joinPage',
    eyebrow: localized(fr.join.hero.eyebrow, en.join.hero.eyebrow),
    title: localized(fr.join.hero.title, en.join.hero.title),
    introduction: localized(fr.join.hero.text, en.join.hero.text),
    valuesTitle: localized(fr.join.values.title, en.join.values.title),
    valuesText: localized(fr.join.values.text, en.join.values.text),
    valuesTags: {
      fr: [
        fr.join.values.antiracist,
        fr.join.values.feminist,
        fr.join.values.lgbt,
        fr.join.values.beliefs,
      ],
      en: [
        en.join.values.antiracist,
        en.join.values.feminist,
        en.join.values.lgbt,
        en.join.values.beliefs,
      ],
    },
  },
  ...JOIN_ROLES.map(({id}) => {
    const french = fr.join.roles[id]
    const english = en.join.roles[id]
    return {
      _id: `joinRole-${id}`,
      _type: 'joinRole' as const,
      title: localized(french.title, english.title),
      anchor: localized(french.anchor, english.anchor),
      lead: localized(french.lead, english.lead),
      text: localized(french.text, english.text),
      tags: {fr: [french.tag1, french.tag2], en: [english.tag1, english.tag2]},
      cta: localized(french.cta, english.cta),
      message: localized(
        fr.join.message.replace('{role}', french.verb),
        en.join.message.replace('{role}', english.verb),
      ),
    }
  }),
]

async function run(): Promise<void> {
  const client = getCliClient({apiVersion: '2025-01-01'}).withConfig({
    useCdn: false,
    perspective: 'raw',
  })
  const ids = await client.fetch<string[]>('*[_type in ["joinPage", "joinRole"]]._id')
  const transaction = client.transaction()
  let changes = 0
  for (const document of documents) {
    if (ids.includes(document._id) || ids.includes(`drafts.${document._id}`)) {
      console.log(`Conservé : ${document._id}`)
      continue
    }
    transaction.createIfNotExists<SeedDocument>({...document, _id: `drafts.${document._id}`})
    console.log(`Nouveau brouillon : ${document._id}`)
    changes++
  }
  if (changes && process.argv.includes('--apply')) {
    await transaction.commit()
    console.log(`${changes} brouillon(s) créé(s). Rien publié.`)
  } else console.log(`Simulation : ${changes} brouillon(s) à créer. Aucun document modifié.`)
}

run().catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
