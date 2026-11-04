# Gestion des équipes

Dans **Équipes et membres**, créer et publier les fiches dans **Membres du club**, puis ouvrir une équipe ou rubrique pour sélectionner ses membres. Une fiche peut être référencée par plusieurs listes. Publier chaque liste après modification.

- Les postes, le numéro, la photo, les saisons et le stand-by restent sur la fiche.
- Officiels, Staff et Hall of Fame se remplissent également par sélection.
- Le stand-by s'applique partout sauf au Hall of Fame.
- « Effectif actuel » désactivé masque la personne des listes courantes, même si sa référence y figure encore. Le Hall of Fame reste indépendant.
- L'ordre du site reste automatique : numéro pour les équipes, nom pour les autres rubriques.

## Migration des affiliations existantes

Faire la migration avant de commencer à éditer les nouvelles listes dans le Studio.

Depuis `sanity/`, simuler :

```sh
./node_modules/.bin/sanity exec scripts/migrateTeamRosters.ts --with-user-token
```

Après vérification du résultat, appliquer :

```sh
./node_modules/.bin/sanity exec scripts/migrateTeamRosters.ts --with-user-token -- --apply
```

Le script crée les huit listes publiées à partir des affiliations et catégories existantes. Il ne modifie aucune fiche membre et ne remplace aucune liste existante, y compris en brouillon. Il peut être relancé sans écraser les modifications du comité. Les brouillons de fiches ne sont pas migrés : publier les nouvelles fiches puis les ajouter depuis les listes.

Tant qu'une liste publiée n'existe pas, le site utilise les anciennes affiliations pour cette rubrique. Dès sa publication, seule sa sélection est utilisée ; publier une liste vide vide bien la rubrique. Les anciens champs restent cachés et en lecture seule pour la transition.

Redéployer le Studio pour rendre cette organisation accessible au comité. Reconstruire le site après migration pour afficher les listes publiées.
