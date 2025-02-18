---
title: TETRIS - Labo 1
css: style.css
---

<!-- # Changelog -->

# Informations Générales
- **Date du rendu :** Mardi 10 octobre, 13:15 CEST
- **Groupes** : À réaliser seul ou à deux
- **Plagiat** : en cas de copie manifeste, vous y serez confrontés, vous obtiendrez la note de 1, et l'incident sera reporté au responsable de la filière, avec un risque d'échec critique immédiat au cours. Ne trichez pas. *(Notez que les IAs génératives se trouvent aujourd'hui dans une zone qui est encore juridiquement floue pour ce qui est du plagiat, mais des arguments se valent à en considérer l'utilisation comme tel. Quoi qu'il en soit, nous vous proposons une autre vision sur la question : votre ambition est d'apprendre et d'acquérir des compétences, et votre utilisation éventuelle de cet outil doit refléter ceci. Tout comme Stackoverflow peut être à la fois un outil d'enrichissement et une banque de copy-paste, faites un choix intentionnel et réfléchi, vos propres intérêts en tête, de l'outil que vous ferez de l'IA générative)*

# Tetris Multijoueur en ligne

Quatre des labos de ce cours serviront à construire, par étape, un mini-jeu de Tetris multijoueur en ligne sur le Web. D'ici à la fin des trois premiers labos, vous aurez un jeu en ligne, hébergé sur un serveur central, qui sera inspiré du célèbre Tetris, mais dans lequel autant de joueurs que souhaité participeront, sur le même board, avec leurs propres pièces à poser. Un système de score permettra de décider d'un gagnent une fois le jeu terminé, en fonction du nombre de lignes complétées et de pièces posées. Le quatrième labo dédié à ce projet sera libre et vous permettra d'ajouter toute fonctionnalité que vous trouverez pertinente au projet.

Ceci est donc le premier labo dédié à ce jeu, qui consiste en l'implémentation de la logique du Tétris, sans interaction du joueur ni multijoueur, qui seront les sujets des labos 2 et 3, respectivement. La gestion de la logique de jeu aura donc lieu, pour l'instant, sur le client et non sur le serveur.

# Description technique

## Pièces
Une pièce est représentée par une classe définie dans `shape.js`. Elle est caractérisée par son type, sa rotation, l'id du joueur auquel elle appartient, et une position `(row, col)`.

La rotation de la pièce est un nombre compris entre 0 et 3 inclus, 0 correspondant à la rotation initiale de la pièce, et les suivants correspondant aux rotations suivantes, dans le sens des aiguilles d'une montre. Toute référence à une rotation dans le code sera donc un nombre compris entre 0 et 3 inclus.

Le type d'une pièce est sa forme, c'est-à-dire s'il s'agit d'un T, un L, une barre, etc. Afin de représenter une pièce d'une forme donnée, on utilise un tableau contenant les coordonnées de chaque bloc constituant la pièce, par rapport au bloc situé à l'origine de la pièce, qui aura donc comme coordonnées `(0, 0)`. La pièce, quand affichée, sera donc placée de telle sorte que son bloc `(0, 0)` se trouvera sur sa position `(row, col)`.

Notez que la paire `(x, y)` représentant la coordonnée d'un bloc donné correspond donc à l'offset de ce bloc par rapport à la ligne et la colonne à laquelle la pièce se trouve. Ce bloc se trouvera donc à la colonne `col+x` et la ligne `row+y` de la matrice de jeu.

<div style="max-width:400px; margin: auto">

![](imgs/coords_shape.png)

</div>

Pour représenter les rotations d'une pièce, et parce que Tetris n'effectue pas toutes les rotations autour de l'origine, nous choisissons de représenter chaque rotation d'une pièce par un ensemble de coordonnées décrivant la position des blocs de cette pièce après rotation.

Ces ensembles de coordonnées sont stockés dans le tableau `shapeTypes` dans `constants.js`. Ce tableau a un élément par type de pièce, et chaque élément est un tableau contenant les représentations de toutes les rotations de cette pièce. Chaque rotation est ensuite représentée par un tableau des coordonnées des blocs de la pièce pour cette rotation. Pour un type de pièce donné, le premier tableau de coordonnées correspond à la rotation initiale de la pièce, et les suivants correspondent aux rotations suivantes, dans le sens des aiguilles d'une montre. Rendez-vous dans `constants.js` et assurez-vous d'avoir bien compris la structure de ce tableau et la méthode de représentation d'une pièce et ses rotations.

Dans la classe `Shape`, l'attribut `shapeType` est donc à un nombre entier correspondant à l'indice dans `shapeTypes` de `constants.js` de l'élément contenant les coordonnées de ce type de pièce.

Le fichier `constants.js` contient par ailleurs un tableau `shapeColors` qui contient une série de couleurs à utiliser pour les pièces. Chaque joueur a une couleur (arbitraire) assignée, et toutes les pièces de ce joueur auront cette couleur.

Notez que deux pièces en train de tomber sont autorisées à se superposer. C'est seulement lorsqu'elles sont posées qu'elles ne peuvent pas se superposer. Voir [Game map](#game-map) pour plus de détail sur le moment où une pièce est posée.

## Player Info

Une classe `PlayerInfo`, définie dans `playerInfo.js` est utilisée pour représenter les informations d'un joueur. Elle contient pour l'instant uniquement l'id du joueur ainsi que sa pièce.

## Game map

Une pièce peut être dans deux états : en train de tomber, ou posée. Alors que la classe `Shape` permet de décrire une pièce en train de tomber, une pièce posée est quand à elle représentée dans la classe `GameMap`, définie dans `gameMap.js`.

La `GameMap` est une matrice dont les dimensions correspondent au nombre de cellules du jeu, définis dans `constants.js`. Chaque élément de la matrice est égal à l'id du joueur auquel appartient le bloc posé à cette position, ou `NaN` si cette cellule est vide. L'élément aux indexes `(0, 0)` de la matrice correspond à la cellule en haut à gauche du jeu.

`GameMap` offre un certain nombre de méthodes documentées dans le code. Nous allons toutefois en décrire deux ici afin d'expliciter un lexique que nous utiliserons dans la suite du projet.

- Une pièce est "grounded" quand elle passe de l'état tombante à posée, c'est-à-dire quand elle arrête d'être représentée par la classe `Shape`, et est transférée sur la matrice de la `GameMap`. Ceci est géré par la méthode `groundShape` de `GameMap`.
- Une pièce est "dropped" quand il est demandé qu'elle tombe vers le bas jusqu'au premier obstacle, puis qu'elle soit posée, c'est-à-dire "grounded". Une pièce "dropped" sera donc d'abord déplacée vers le bas jusqu'à ce qu'elle puisse être posée, puis seulement posée. Ceci est géré par la méthode `dropShape` de `GameMap`.

Deux autres méthodes qui méritent attention sont `clearFullRows` et `clearRow`. Dans le jeu Tetris, une fois une ligne de la matrice complétée, celle-ci est effacée, puis toutes les cellules au-dessus d'elle sont déplacées d'une case vers le bas. Ces deux méthodes implémentent cette fonctionnalité.

Parcourez les autres méthodes de `GameMap` et leur documentation et assurez-vous de bien comprendre leurs responsabilités et leur fonctionnement.

## Game

Une instance de jeu est représentée par la classe `Game`, définie dans `game.js`. Nous avons choisi, notamment dans le but d'utiliser les classes JavaScript et l'héritage, de faire hériter `Game` de `Map`. `Game` est donc une sous-classe de `Map` assignant à chaque id de joueur une instance de la classe `PlayerInfo` correspondant à ce joueur.

La classe `Game` contient également une instance de `GameMap` qui lui sera passée en argument lors de sa construction. Ceci permettra, notamment, la facilitation d'écriture de tests unitaires par la possibilité de fournir une `GameMap` mockée.

Les méthodes de `Game` sont documentées dans le code, et nous vous invitons à les parcourir afin de bien comprendre leur fonctionnement.

## Game step

Nous détaillons ici de manière précise ce qui se passe lors d'un step du jeu, afin d'assurer la clarté de ce qu'il vous est demandé d'implémenter, notamment du fait de l'aspect multijoueur de cette version du jeu.

Tetris est un jeu qui avance par steps. À intervalles réguliers, les pièces en train de tomber sont déplacées d'une case vers le bas. Si une (ou plusieurs) pièce ne peut pas tomber car elle a atteint le bas de la matrice, ou parce qu'une pièce posée l'en empêche, elle est alors elle-même posée.

Lorsqu'une pièce est posée, une nouvelle pièce tombante est automatiquement ajoutée pour ce joueur. Cette pièce est choisie aléatoirement et est placée tout en haut de la matrice, au centre.

Lorsqu'une pièce est posée, toute pièce tombante qui lui était superposée doit être supprimée (sans être posée), et remplacée par une nouvelle pièce, choisie au hasard, et placée tout en haut de la matrice, au centre. Si plusieurs pièces doivent être posées au même tour mais se superposent, l'une d'elles est choisie arbitrairement pour être posée, et l'autre est remplacée. Si les deux peuvent être posées, alors elles le sont.

Pour assurer le déterminisme du jeu, nous supposons que, dans un même step, les pièces qui peuvent être déplacées d'un cran vers le bas doivent l'être *avant* que toute pièce qui doit être posée le soit. En d'autres termes, s'il coexiste dans un même step des pièces qui peuvent descendre d'un cran et d'autres qui ne le peuvent pas, on commence par déplacer les pièces qui le peuvent, et on pose seulement ensuite celles qui ne le peuvent pas.

Après la pose d'une ou plusieurs pièces, toute ligne complète est supprimée et les lignes au-dessus sont déplacées d'une case vers le bas. Nous ne comptons pas, pour l'instant, le score des joueurs.

# Installation et lancement

Comme d'habitude, exécutez tout d'abord `npm install` pour installer toutes les dépendances du projet.

Comme vous pouvez le voir dans `package.json`, nous offrons trois commandes :

- `npm run start` lance simplement le serveur sur le port 3000.
- `npm run watch` lance le serveur sur le port 3000, et relance le serveur à chaque modification d'un fichier.
- `npm run test` lance tous les tests du projet.

# Travail à réaliser
Dans un premier temps, parcourez tous les fichiers du projet, et assurez-vous de bien comprendre sa structure, les classes qui la composent, et comment elles sont supposées interagir.

Votre tâche est de compléter toutes les sections de code marquées par `TODO` dans ce projet. Le résultat ne permettra pas l'interaction de l'utilisateur, mais vous pourrez tester visuellement votre solution en utilisant une instance de `Game` possédant déjà des pièces tombantes et posées au lieu d'une instance vierge.

# Tests
Le repository contient déjà un certain nombre de tests que nous utiliserons pour noter votre travail, mais nous nous réservons le droit d'en ajouter d'autres et d'évaluer votre rendu manuellement. Aussi, nous vous recommandons de ne pas vous reposer uniquement sur les tests donnés. Vous êtes notamment libres d'ajouter de nouveaux tests si vous le souhaitez ; nous vous demanderons toutefois de le faire dans de nouveaux fichiers. Nous vérifierons en effet que les tests fournis n'ont pas été modifiés, afin de garantir que vous les passez pour les bonnes raisons ;)
