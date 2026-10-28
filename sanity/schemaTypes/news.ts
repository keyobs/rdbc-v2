import {defineArrayMember, defineField, defineType} from 'sanity'

type NewsFormat = 'brief' | 'article'

const TITLE_MAX_LENGTH = 80
const BRIEF_TEXT_MAX_LENGTH = 400
const LEAD_MAX_LENGTH = 220
const PRACTICAL_MAX_LENGTH = 90
// Label of the button: kept short so that the button stays on one line
const BUTTON_LABEL_MAX_LENGTH = 25

const CATEGORIES = [
  {title: 'Match', value: 'match'},
  {title: 'Event', value: 'event'},
  {title: 'Bootcamp', value: 'bootcamp'},
  {title: 'Recrutement', value: 'recruitment'},
  {title: 'Vie de la ligue', value: 'leagueLife'},
]

const formatOf = (document: unknown): NewsFormat | undefined =>
  (document as {format?: NewsFormat} | undefined)?.format

// Each format only shows its own fields to the editors
const hiddenUnless =
  (format: NewsFormat) =>
  ({document}: {document?: unknown}) =>
    formatOf(document) !== format

// FR is the reference language; EN is optional and falls back to FR on the site
const localizedString = (name: string, title: string, maxLength: number) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({name: 'fr', title: 'Français', type: 'string', validation: (Rule) => Rule.max(maxLength)}),
      defineField({name: 'en', title: 'English (facultatif)', type: 'string', validation: (Rule) => Rule.max(maxLength)}),
    ],
  })

const altField = () =>
  defineField({
    name: 'alt',
    title: 'Description de l’image',
    type: 'string',
    description: 'Décris l’image pour les personnes qui ne la voient pas.',
    validation: (Rule) => Rule.required().error('La description de l’image est obligatoire.'),
  })

const creditField = () =>
  defineField({
    name: 'credit',
    title: 'Crédit photo',
    type: 'string',
    description: 'Ex : © Prénom Nom',
  })

const bodyMembers = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Paragraphe', value: 'normal'},
      {title: 'Intertitre', value: 'h3'},
    ],
    lists: [{title: 'Liste', value: 'bullet'}],
    marks: {
      decorators: [
        {title: 'Gras', value: 'strong'},
        {title: 'Italique', value: 'em'},
      ],
      annotations: [
        defineArrayMember({
          name: 'link',
          title: 'Lien',
          type: 'object',
          fields: [
            defineField({
              name: 'href',
              title: 'Adresse',
              type: 'url',
              validation: (Rule) => Rule.uri({scheme: ['http', 'https', 'mailto']}),
            }),
          ],
        }),
      ],
    },
  }),
  defineArrayMember({
    name: 'photo',
    title: 'Photo',
    type: 'image',
    options: {hotspot: true},
    fields: [
      altField(),
      defineField({name: 'caption', title: 'Légende', type: 'string'}),
      creditField(),
    ],
  }),
  defineArrayMember({
    name: 'gallery',
    title: 'Galerie photos',
    type: 'object',
    fields: [
      defineField({
        name: 'images',
        title: 'Photos',
        type: 'array',
        of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [altField()]})],
        options: {layout: 'grid'},
        validation: (Rule) => Rule.min(2).error('Une galerie contient au moins 2 photos.'),
      }),
      creditField(),
    ],
    preview: {
      select: {images: 'images', media: 'images.0'},
      prepare: ({images, media}) => ({
        title: 'Galerie photos',
        subtitle: `${Array.isArray(images) ? images.length : 0} photo(s)`,
        media,
      }),
    },
  }),
  defineArrayMember({
    name: 'video',
    title: 'Vidéo',
    type: 'object',
    fields: [
      defineField({
        name: 'url',
        title: 'Lien de la vidéo',
        type: 'url',
        description: 'Un lien YouTube s’affiche dans la page. Les autres liens (Instagram…) s’affichent comme un bouton.',
        validation: (Rule) => Rule.required().uri({scheme: ['https']}),
      }),
      defineField({name: 'caption', title: 'Légende', type: 'string'}),
    ],
    preview: {
      select: {title: 'caption', subtitle: 'url'},
      prepare: ({title, subtitle}) => ({title: title ?? 'Vidéo', subtitle}),
    },
  }),
]

export const news = defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  description: 'Le journal de bord du club : une brève pour une info rapide, un article pour un récit complet.',
  fields: [
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: {
        list: [
          {title: 'Brève — une info rapide, quelques lignes', value: 'brief'},
          {title: 'Article — un récit complet (revue de match, event…)', value: 'article'},
        ],
        layout: 'radio',
      },
      initialValue: 'brief',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'object',
      description: 'Court et concret : c’est la seule chose qu’on voit quand la news est fermée.',
      fields: [
        defineField({
          name: 'fr',
          title: 'Français',
          type: 'string',
          validation: (Rule) => Rule.required().max(TITLE_MAX_LENGTH),
        }),
        defineField({
          name: 'en',
          title: 'English (facultatif)',
          type: 'string',
          validation: (Rule) => Rule.max(TITLE_MAX_LENGTH),
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {list: CATEGORIES},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date de publication',
      type: 'datetime',
      description:
        'La news la plus récente s’affiche ouverte en haut de la page. La saison est calculée à partir de cette date.',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Lien de partage',
      type: 'slug',
      description: 'Cliquer sur « Generate ». À ne plus modifier une fois la news publiée.',
      options: {source: 'title.fr', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    // Brief
    defineField({
      name: 'text',
      title: 'Texte',
      type: 'object',
      description: `${BRIEF_TEXT_MAX_LENGTH} caractères maximum. Besoin de plus ? Choisis le format Article.`,
      hidden: hiddenUnless('brief'),
      fields: [
        defineField({
          name: 'fr',
          title: 'Français',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.max(BRIEF_TEXT_MAX_LENGTH),
        }),
        defineField({
          name: 'en',
          title: 'English (facultatif)',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.max(BRIEF_TEXT_MAX_LENGTH),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value, context) =>
          formatOf(context.document) === 'brief' && !(value as {fr?: string} | undefined)?.fr
            ? 'Le texte en français est obligatoire.'
            : true,
        ),
    }),
    defineField({
      name: 'image',
      title: 'Image (facultative)',
      type: 'image',
      options: {hotspot: true},
      hidden: hiddenUnless('brief'),
      fields: [altField()],
    }),

    // Article
    defineField({
      name: 'cover',
      title: 'Photo de couverture',
      type: 'image',
      description: 'Affichée en vignette à gauche du titre.',
      options: {hotspot: true},
      hidden: hiddenUnless('article'),
      fields: [altField(), creditField()],
      validation: (Rule) =>
        Rule.custom((value, context) =>
          formatOf(context.document) === 'article' && !(value as {asset?: unknown} | undefined)?.asset
            ? 'La photo de couverture est obligatoire.'
            : true,
        ),
    }),
    defineField({
      name: 'lead',
      title: 'Chapô',
      type: 'object',
      description: '1 à 2 phrases qui donnent envie de lire la suite. Affiché en gras en haut de l’article.',
      hidden: hiddenUnless('article'),
      fields: [
        defineField({
          name: 'fr',
          title: 'Français',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(LEAD_MAX_LENGTH),
        }),
        defineField({
          name: 'en',
          title: 'English (facultatif)',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(LEAD_MAX_LENGTH),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value, context) =>
          formatOf(context.document) === 'article' && !(value as {fr?: string} | undefined)?.fr
            ? 'Le chapô en français est obligatoire.'
            : true,
        ),
    }),
    defineField({
      name: 'practical',
      title: 'Infos pratiques (facultatif)',
      type: 'object',
      description: 'Pour un match, un event, un recrutement. Laisse vide si ça ne s’applique pas.',
      hidden: hiddenUnless('article'),
      options: {collapsible: true, collapsed: true},
      fields: [
        localizedString('dates', 'Date(s)', PRACTICAL_MAX_LENGTH),
        localizedString('time', 'Horaires', PRACTICAL_MAX_LENGTH),
        localizedString('place', 'Lieu', PRACTICAL_MAX_LENGTH),
        localizedString('price', 'Tarif', PRACTICAL_MAX_LENGTH),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'object',
      description: 'Écris comme dans un mail. Le bouton « + » ajoute une photo, une galerie ou une vidéo.',
      hidden: hiddenUnless('article'),
      fields: [
        defineField({name: 'fr', title: 'Français', type: 'array', of: bodyMembers}),
        defineField({name: 'en', title: 'English (facultatif)', type: 'array', of: bodyMembers}),
      ],
    }),

    // Both formats
    defineField({
      name: 'button',
      title: 'Bouton (facultatif)',
      type: 'object',
      description: 'Pour envoyer vers une inscription, une billetterie, un formulaire… plutôt qu’un lien brut dans le texte.',
      options: {collapsible: true, collapsed: true},
      fields: [
        localizedString('label', 'Texte du bouton', BUTTON_LABEL_MAX_LENGTH),
        defineField({
          name: 'href',
          title: 'Lien',
          type: 'url',
          validation: (Rule) => Rule.uri({scheme: ['http', 'https', 'mailto']}),
        }),
        defineField({
          name: 'primary',
          title: 'Bouton rose — action importante (inscription, billetterie)',
          type: 'boolean',
          initialValue: false,
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          const button = value as {label?: {fr?: string}; href?: string} | undefined
          return button?.label?.fr && !button.href ? 'Le bouton a besoin d’un lien.' : true
        }),
    }),
    defineField({
      name: 'author',
      title: 'Signature',
      type: 'string',
      description: 'Ex : Par le bureau, Par la commission events…',
      validation: (Rule) => Rule.required().max(40),
    }),
  ],
  orderings: [
    {
      title: 'Date de publication (récentes d’abord)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title.fr', format: 'format', date: 'date', cover: 'cover', image: 'image'},
    prepare: ({title, format, date, cover, image}) => ({
      title: title ?? 'News sans titre',
      subtitle: `${format === 'article' ? 'Article' : 'Brève'}${date ? ` · ${new Date(date).toLocaleDateString('fr-FR')}` : ''}`,
      media: format === 'article' ? cover : image,
    }),
  },
})
