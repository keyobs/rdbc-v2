import {defineType} from 'sanity'
import {joinString, joinTags} from './joinFields'

export const joinPage = defineType({
  name: 'joinPage',
  title: 'Rejoindre — Introduction et valeurs',
  type: 'document',
  fields: [
    joinString('eyebrow', 'Surtitre'),
    joinString('title', 'Titre principal'),
    joinString('introduction', 'Introduction', true),
    joinString('valuesTitle', 'Titre du bandeau de valeurs'),
    joinString('valuesText', 'Texte du bandeau de valeurs', true),
    joinTags('valuesTags', 'Badges des valeurs'),
  ],
  preview: {prepare: () => ({title: 'Rejoindre — Introduction et valeurs'})},
})
