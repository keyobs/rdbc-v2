import {defineField, defineType} from 'sanity'
import {JOIN_ROLES} from '../joinRoles'
import {joinString, joinTags} from './joinFields'

export const joinRole = defineType({
  name: 'joinRole',
  title: 'Rejoindre — Profil',
  type: 'document',
  fields: [
    joinString('title', 'Titre de la carte'),
    joinString('anchor', 'Libellé du lien en haut de page'),
    joinString('lead', 'Accroche', true),
    joinString('text', 'Description (un paragraphe par ligne)', true),
    joinTags('tags', 'Badges'),
    joinString('cta', 'Texte du bouton de contact'),
    joinString('message', 'Message prérempli dans le formulaire', true),
  ],
  preview: {
    select: {id: '_id'},
    prepare: ({id}) => ({
      title:
        JOIN_ROLES.find((role) => `joinRole-${role.id}` === id?.replace(/^drafts\./, ''))?.title ??
        'Profil pour rejoindre',
    }),
  },
})
