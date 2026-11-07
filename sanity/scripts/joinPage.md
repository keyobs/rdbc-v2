# Paramétrage de Rejoindre

Dans le Studio, ouvrir **Rejoindre** :

- **Introduction et valeurs** : surtitre, titre, introduction et bandeau des valeurs.
- **Joueureuse**, **Arbitre**, **Bénévole** : titre, lien de navigation, accroche, description, badges, vidéo et couverture, bouton et message prérempli.

Les textes sont en français et en anglais. En l'absence de traduction, le français est affiché. Une liste de badges vide masque les badges ; un champ absent utilise le contenu initial de la page. Une image de couverture peut être affichée seule, sans vidéo.

Les vidéos restent muettes. Sur desktop (à partir de 1024 px), elles démarrent dans l'ordre, une seule fois chacune, lorsqu'elles sont visibles. L'autoplay est désactivé si la réduction des animations est demandée. Sur mobile, la lecture est toujours manuelle. Un bouton lecture/pause est disponible partout ; toute intervention manuelle suspend la séquence automatique jusqu'au prochain chargement de page. Une seule vidéo joue à la fois. Sortir de l'écran ou masquer l'onglet met la vidéo en pause ; seule la séquence automatique reprend au retour. Le fichier n'est chargé qu'au démarrage de sa lecture.

Les trois profils et leurs ancres sont fixes. Le bouton mène au formulaire de contact et coche l'intérêt correspondant ; son message est modifiable dans le profil. Les liens d'inscription, tarifs et informations d'adhésion restent dans **Le club**, partagés avec la page Club. Les profils de l'accueil restent gérés dans **Accueil → Profils pour rejoindre**.

## Bibliothèque Vidéos

Créer les fiches dans **Vidéos**, puis utiliser **Choisir une vidéo** dans chaque profil de Rejoindre. La même vidéo peut servir sur plusieurs pages. Son nom est modifiable sur sa fiche.

Le champ **Photo miniature (facultative)** de la fiche vidéo permet de choisir une photo et son point d'intérêt. Elle est affichée sur Rejoindre avant la lecture et lorsque la vidéo est terminée ; le bouton permet de relancer la vidéo. Une **Image de couverture** renseignée sur le profil Rejoindre reste prioritaire. Sans aucune de ces images, la dernière image de la vidéo reste affichée en fin de lecture.

### Bibliothèque Photos et upload direct

Le module **Photos** permet de créer des fiches réutilisables avec un nom, une image, un recadrage et un point d'intérêt, un texte alternatif et un crédit. Publier la photo pour la rendre disponible sur le site. Le texte alternatif et le crédit sont conservés dans la bibliothèque ; les couvertures des cartes Rejoindre restent décoratives et n’affichent pas de crédit.

Les miniatures des vidéos et les couvertures de Rejoindre conservent leur champ d’upload direct. Le champ **Choisir dans Photos** permet aussi d’utiliser une photo de la bibliothèque. Si les deux sont renseignés, la photo de la bibliothèque est prioritaire ; retirer la référence pour revenir à l’upload direct.

Pour Rejoindre, l’ordre de priorité est : couverture du profil depuis Photos, couverture uploadée sur le profil, miniature de la vidéo depuis Photos, miniature uploadée sur la vidéo. Une fois la référence publiée, modifier et publier la fiche Photo suffit à mettre à jour ses utilisations au prochain chargement en développement ou à la prochaine reconstruction du site en production.

Les fiches joueuses ne sont pas concernées par cette bibliothèque.

L'import est traité localement dans le navigateur de l'éditeur. Le moteur FFmpeg WebAssembly est chargé uniquement au choix d'un fichier ; il n'est pas inclus dans le site public. Les clips de plus de **30 secondes** sont refusés, sans découpage automatique. Le résultat est un MP4 H.264 sans audio, au maximum 800 × 800 px, sans agrandissement, à 30 images/s maximum et 5 Mo maximum. La source doit faire au plus 100 Mo.

Trois résolutions sont proposées : **Mini — 250 × 250**, **Réduite — 400 × 400** (par défaut, pour les cartes Rejoindre) et **Max — 800 × 800**. Ce sont des dimensions maximales ; les proportions sont conservées. Mini et Réduite utilisent aussi un débit inférieur et 24 images/s maximum. Leurs plafonds sont respectivement 1 Mo et 2 Mo ; Max conserve le plafond de 5 Mo. Le poids réel dépend de la durée et du contenu.

Changer de résolution après sélection d'un fichier relance l'aperçu à partir de la même source locale. La résolution effectivement utilisée est enregistrée avec le fichier. Les anciens imports sans résolution enregistrée restent reconnus comme le profil Max.

Après optimisation, vérifier l'aperçu et les poids avant/après, puis choisir **Envoyer la vidéo optimisée**. L'original n'est pas envoyé. Annuler conserve le fichier déjà enregistré. La validation de publication contrôle le profil, la durée, les dimensions et le poids réel de l'asset. Le bouton **Optimiser la vidéo actuelle** permet de retraiter un fichier déjà présent.

La date suit cette priorité : date saisie sur la fiche, date de création exploitable dans les métadonnées, sinon date d'upload. Sa provenance est affichée dans la liste. Les métadonnées absentes ou manifestement invalides ne sont pas inventées.

Publier la fiche vidéo avant le profil qui la sélectionne.

### Migration des anciens uploads

Depuis `sanity/`, avec FFmpeg et ffprobe disponibles localement :

```sh
./node_modules/.bin/sanity exec scripts/migrateVideos.ts --with-user-token
./node_modules/.bin/sanity exec scripts/migrateVideos.ts --with-user-token -- --apply
```

Le premier appel simule l'optimisation sans écriture distante. Le second envoie le résultat validé et prépare les fiches vidéo et associations en brouillon. Les fiches de bibliothèque existantes et les profils déjà associés sont conservés. Les modifications de brouillon concurrentes sont protégées par leur révision. Aucun document n'est publié. Les anciennes versions publiques continuent de fonctionner jusqu'à publication de la migration.

## Initialiser les textes actuels

Depuis `sanity/` :

```sh
./node_modules/.bin/sanity exec scripts/seedJoinPage.ts --with-user-token
```

Pour créer les quatre brouillons :

```sh
./node_modules/.bin/sanity exec scripts/seedJoinPage.ts --with-user-token -- --apply
```

Le script conserve les documents existants, publiés ou en brouillon. Il ne publie rien. Vérifier puis publier les documents depuis le Studio. Les pages continuent d'afficher leurs textes initiaux tant que ces documents ne sont pas publiés.

Redéployer le Studio pour exposer les nouveaux schémas et le menu. Le site statique doit être reconstruit après publication pour refléter les changements.
