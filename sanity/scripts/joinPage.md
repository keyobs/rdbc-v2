# Paramétrage de Rejoindre

Dans le Studio, ouvrir **Rejoindre** :

- **Introduction et valeurs** : surtitre, titre, introduction et bandeau des valeurs.
- **Joueureuse**, **Arbitre**, **Bénévole** : titre, lien de navigation, accroche, description, badges, bouton et message prérempli.

Les textes sont en français et en anglais. En l'absence de traduction, le français est affiché. Une liste de badges vide masque les badges ; un champ absent utilise le contenu initial de la page.

Les trois profils et leurs ancres sont fixes. Le bouton mène au formulaire de contact et coche l'intérêt correspondant ; son message est modifiable dans le profil. Les liens d'inscription, tarifs et informations d'adhésion restent dans **Le club**, partagés avec la page Club. Les profils de l'accueil restent gérés dans **Accueil → Profils pour rejoindre**.

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
