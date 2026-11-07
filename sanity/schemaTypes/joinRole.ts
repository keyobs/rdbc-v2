import {defineField, defineType} from 'sanity'
import {JOIN_ROLES} from '../joinRoles'
import {joinString, joinTags} from './joinFields'
import {VIDEO_PROFILE} from '../video/videoProfile'

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
    defineField({
      name: 'video',
      title: 'Ancien fichier vidéo',
      type: 'file',
      hidden: true,
      readOnly: true,
      options: {accept: 'video/mp4,video/webm'},
      description:
        'Clip court et muet. Formats MP4 ou WebM. Lecture automatique une seule fois sur desktop, lecture manuelle sur mobile.',
    }),
    defineField({
      name: 'videoRef',
      title: 'Choisir une vidéo',
      type: 'reference',
      to: [{type: 'libraryVideo'}],
      options: {
        disableNew: true,
        filter: 'file.profile == $profile && defined(file.asset)',
        filterParams: {profile: VIDEO_PROFILE},
      },
      description:
        'Créer et optimiser les vidéos dans le module Vidéos. La même vidéo peut être utilisée sur plusieurs pages.',
    }),
    defineField({
      name: 'poster',
      title: 'Image de couverture (facultative)',
      type: 'image',
      options: {hotspot: true},
      description: 'Affichée avant la lecture, ou seule si aucune vidéo n’est renseignée.',
    }),
    defineField({
      name: 'posterRef',
      title: 'Couverture — choisir dans Photos',
      type: 'reference',
      to: [{type: 'libraryPhoto'}],
      options: {disableNew: true, filter: 'defined(image.asset)'},
      description:
        'Facultatif. Cette photo est prioritaire sur l’upload direct ci-dessus et la miniature de la vidéo. Retirer ce choix pour utiliser l’upload direct.',
    }),
    joinString('cta', 'Texte du bouton de contact'),
    joinString('message', 'Message prérempli dans le formulaire', true),
  ],
  preview: {
    select: {id: '_id', media: 'poster', libraryMedia: 'posterRef.image'},
    prepare: ({id, media, libraryMedia}) => ({
      title:
        JOIN_ROLES.find((role) => `joinRole-${role.id}` === id?.replace(/^drafts\./, ''))?.title ??
        'Profil pour rejoindre',
      media: libraryMedia ?? media,
    }),
  },
})
