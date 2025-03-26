---
title: TETRIS - Labo 2
css: style.css
---

<!--

# Changelog

| Date  | Changement                                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------- |
| 03.10 | [Précision](#change_overlap) : deux pièces tombantes sont autorisées à se superposer.                               |

-->

# Informations Générales
- **Date du rendu :** Voir dans GitHub Classroom
- **Groupes** : À réaliser seul ou à deux, en reprenant de préférence les groupes de la partie 1.
- **Plagiat** : en cas de copie manifeste, vous y serez confrontés, vous obtiendrez la note de 1, et l'incident sera reporté au responsable de la filière, avec un risque d'échec critique immédiat au cours. Ne trichez pas. *(Notez que les IAs génératives se trouvent aujourd'hui dans une zone qui est encore juridiquement floue pour ce qui est du plagiat, mais des arguments se valent à en considérer l'utilisation comme tel. Quoi qu'il en soit, nous vous proposons une autre vision sur la question : votre ambition est d'apprendre et d'acquérir des compétences, et votre utilisation éventuelle de cet outil doit refléter ceci. Tout comme Stackoverflow peut être à la fois un outil d'enrichissement et une banque de copy-paste, faites un choix intentionnel et réfléchi, vos propres intérêts en tête, de l'outil que vous ferez de l'IA générative)*

# Lien avec le précédent labo

Ce labo est une suite du premier labo sur Tetris. Toutes les informations données dans [l'énoncé du premier labo](./labo-2-tetris-1.md) restent donc valables pour celui-ci.

Au moment de rejoindre ce nouvel assignment sur Github Classroom, un nouveau repo sera créé, pour lequel nous vous demandons de réutiliser les mêmes équipes. Ce nouveau repo reprend la correction du précédent labo et y ajoute les TODOs de ce labo-ci. Si vous souhaitez réutiliser votre code du premier labo, au lieu de celui fourni, vous pouvez le faire en exécutant les commandes suivantes :
```sh
git remote add lab1 <tetris1-repo-url>
git fetch --all
git merge -e lab1/main --allow-unrelated-histories
```
Une fois les conflits du merge résolus, vous aurez donc votre solution au précédent labo avec les ajouts que nous vous fournissons pour celui-ci. Vérifiez tout de même de ne pas avoir supprimé de tests ou de TODOs par erreur durant le merge.

# Ajouts de ce labo

Dans ce labo, vous implémenterez l'interaction avec l'utilisateur ou l'utilisatrice, et commencerez à mettre en place le protocole de communication entre le client et le serveur.

## Interactions

Vous êtes chargés de mettre en place la gestion des événements permettant l'interaction avec le jeu. L'interface choisie est la suivante, et s'applique sur la pièce tombante de l'utilisateur ou l'utilisatrice actuelle. Étant donné que l'aspect multijoueur ne sera implémenté que dans le prochain labo, vous pouvez pour l'instant considérer que l'utilisateur ou l'utilisatrice actuelle est toujours le joueur ou la joueuse dont l'identifiant est 1.

- Les touches `→` et `←` permettent de faire tourner la pièce tombante dans le sens horaire et anti-horaire, respectivement.
- La touche `↓` permet de "slam" la pièce tombante, c'est-à-dire de la faire descendre aussi bas qu'elle le peut puis la poser.
- Le clic gauche de la souris sur le canvas a le même effet que la touche `↓`.
- Le déplacement de la pièce sur la grille se fait en suivant la souris. En d'autres termes, lorsque la souris bouge sur le canvas, la pièce doit être déplacée de manière à ce que son origine se trouve sur la colonne actuellement survolée par la souris. Notez que la ligne de la pièce reste régie par les steps du jeu, et ne dépend donc pas de la souris.

Remarquons que cette interface est peu commune pour un Tetris, qui utilise plus habituellement les touches `←` et `→` pour déplacer la pièce. Ce choix est dans le but de vous faire utiliser les événements de souris et ses coordonnées. Toutefois, vous êtes libres d'ajouter d'autres manières d'interagir avec le jeu, par exemple `a` et `d` pour les déplacements, `q` et `e` pour la rotation, et `s` pour le slam. Il est simplement nécessaire que les interactions décrites ci-dessus soient implémentées, et qu'aucune signature de fonction ne soit modifiée autrement que par l'ajout d'arguments optionnels en fin de liste.

### Échecs d'interaction

Pour toute requête de déplacement ou de rotation d'une pièce, celle-ci peut échouer. La raison sera toujours que le résultat de l'interaction n'est pas valide parce que la pièce se retrouve en dehors de la grille ou superposée à un bloc posé. Bien que le jeu originel, dans le cas d'une rotation impossible, tente de déplacer la pièce pour permettre la rotation, nous nous contenterons ici de la faire échouer. Une rotation ou un déplacement échoué signifie simplement que la requête sera ignorée.

Notons que nous considérons comme valide une pièce dont l'un des blocs se trouve en dehors de la limite supérieure de la grille. Cela signifie qu'une pièce se trouvant au sommet de la carte a le droit d'être tournée, même si cela causerait l'un de ses blocs à sortir de la carte par le haut. Ce choix est fait dans le but de permettre à une pièce d'être tournée dès son ajout au jeu.

## Messages

Dans ce labo, tout comme dans le précédent, toute la logique du jeu sera exécutée sur le client. Cette logique sera, dans le labo suivant, déplacée sur le serveur, et il sera alors nécessaire pour le client de lui communiquer les requêtes de déplacement, rotation et slam de pièces à travers le réseau. En retour, le serveur devra envoyer les résultats de ces interactions, ainsi que les autres évolutions du jeu, à tous les clients connectés pour qu'ils actualisent leur affichage. Tout ceci se fera par l'intermédiaire de messages, dont nous allons implémenter une partie dans ce labo.

En effet, bien que ce ne soit pas encore nécessaire, mais dans le but de commencer la mise en place de ce système, nous allons déjà implémenter une partie du protocole de communication et l'utiliser pour interagir avec la classe `Game`. Toutes les interactions de l'utilisateur ou l'utilisatrice devront donc être communiquées à la classe `Game` par l'intermédiaire de messages passés à la méthode `onMessage`, et non d'appels directs aux fonctions dédiées telles que `moveShape` ou `rotateShape`, qui sont toutes trois de nouvelles méthodes de la classe `Game` à implémenter pour ce labo.

Les messages représentant ces interactions sont modelés par des classes dans le fichier `messages.js`. Ce fichier sera ensuite complété avec les réponses du serveur dans le prochain labo.

## Tests

Il vous est demandé d'implémenter un test pour l'interaction de la souris avec le jeu. Ce test se trouve dans `inputListener.js`, et vérifie que le client ne génère pas une quantité inutilement excessive de messages lorsque la souris bouge sans changer de colonne. En effet, il n'est pas nécessaire de générer un nouveau message à chaque déplacement de la souris, si celle-ci se trouve dans la même colonne que la colonne actuelle de la pièce. Votre test devra donc vérifier que, en cas de plusieurs évènements successifs de déplacement de la souris, un message soit généré uniquement lorsque la souris entre une nouvelle colonne. Il pourra aussi être bienvenu de tester que la colonne contenue dans le message généré est correcte.

Comme pour le labo précédent, les tests fournis serviront à noter votre travail, mais nous pourrons les compléter par des tests supplémentaires ou une évaluation manuelle si nous le jugeons pertinent. Nous vous encourageons donc à rajouter des tests, par exemple si vous ajoutez de nouvelles méthodes, si vous remarquez un cas limite que vous aimeriez vérifier programmatiquement, ou encore si vous venez de résoudre un bug dans votre code et aimeriez éviter toute [régression](https://fr.wikipedia.org/wiki/Test_de_r%C3%A9gression) dans le futur.

# Installation et lancement

Les mêmes instructions que pour le labo précédent sont valables ici. Exécutez `npm install` pour installer toutes les dépendances du projet, et utilisez les différentes commandes (`start`, `watch` et `test`) définies dans `package.json` pour exécuter et tester votre code.

# Travail à réaliser

Votre tâche est de compléter toutes les sections de code marquées par `TODO` dans ce projet. Vous êtes libres d'ajouter de nouvelles méthodes ou fonctions, ainsi que de nouveaux tests, si cela vous parait utile.
