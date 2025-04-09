---
title: Labo 5 - Tetris 3
css: style.css
---


# Informations Générales
- **Date du rendu :** Voir dans GitHub Classroom
- **Groupes** : À réaliser seul ou à deux, en reprenant de préférence les groupes du labo Tetris 1 et 2.
- **Plagiat** : En cas de copie manifeste, vous y serez confrontés, vous obtiendrez la note de 1, et l'incident sera reporté au responsable de la filière, avec un risque d'échec critique immédiat au cours. Ne trichez pas. *(Notez que les IAs génératives se trouvent aujourd'hui dans une zone qui est encore juridiquement floue pour ce qui est du plagiat, mais des arguments se valent à en considérer l'utilisation comme tel. Quoi qu'il en soit, nous vous proposons une autre vision sur la question : votre ambition est d'apprendre et d'acquérir des compétences, et votre utilisation éventuelle de cet outil doit refléter ceci. Tout comme Stackoverflow peut être à la fois un outil d'enrichissement et une banque de copy-paste, faites un choix intentionnel et réfléchi, vos propres intérêts en tête, de l'outil que vous ferez de l'IA générative)*

# Lien avec le précédent labo

Ce labo est une suite du second labo sur Tetris. Toutes les informations données dans [l'énoncé du précédent labo](./labo-3-tetris-2.html) restent donc valables pour celui-ci.

Au moment de rejoindre ce nouvel assignment sur Github Classroom, un nouveau repo sera créé. Vous êtes libres de reprendre, ou non, les équipes du labo précédent. Ce nouveau repo vous donne comme point de départ la correction du labo précédent et y ajoute les TODOs de ce labo-ci. Si vous souhaitez réutiliser votre code du premier labo au lieu de celui fourni, vous pouvez le faire en exécutant les commandes suivantes :
```sh
git remote add lab2 <tetris2-repo-url>
git fetch --all
git merge -e lab2/main --allow-unrelated-histories
```
Dans ce cas, nous vous demandons de préciser le nom de l'équipe dont vous avez repris le code dans le README. Au moins une personne de la nouvelle équipe doit avoir été membre de l'équipe dont le code a été repris.

Une fois les conflits du merge résolus, vous aurez donc votre solution au précédent labo avec les ajouts que nous vous fournissons pour celui-ci. Vérifiez tout de même de ne pas avoir supprimé de tests ou de TODOs par erreur durant le merge.

# Ajouts de ce labo

Ce labo complète les fonctionnalités du jeu. Vous aurez donc, à la fin de celui-ci, un Tetris multijoueur fonctionnel. Ces dernières fonctionnalités, et les tâches qui vous sont demandées, sont décrites ici.

## Scores

### Calcul

Nous introduisons le concept de score. Chaque joueur ou joueuse obtient un score qui permettra de déterminer qui a gagné au moment du game over. Pour un joueur ou une joueuse donnée, son score est composé de deux parties :
- le nombre de lignes qu'il ou elle a fait disparaître, multiplié par la constante `scorePerLine` (définie dans `constants.js`), et
- un malus correspondant au nombre de blocs lui appartenant encore présents sur la carte de jeu.

Si j'ai fait disparaître 5 lignes sur toute la durée de la partie, et que, au moment où le jeu ne peut plus avancer et que la partie doit donc se terminer, il reste 13 blocs de ma couleur sur la carte, mon score sera donc de $5 * \texttt{scorePerLine} - 13$, donc $37$ si `scorePerLine` vaut 10.

Il vous est donc demandé de compléter les fonctions `getBlocksPerPlayer` dans `placedShapesGrid.js`, et `getTotalScores` dans `game.js`, qui seront utilisées pour calculer les scores totaux quand nécessaire. La classe `PlayerInfo` a aussi été complétée par une propriété `clearedLines` que vous devrez maintenir à jour tout au long du jeu, et utiliser dans votre calcul des scores.

Notez qu'il sera possible pour un joueur ou une joueuse de quitter la partie en cours. Dans ce cas, les blocs lui appartenant sur la carte y restent, et son score ne se calcule alors plus qu'à travers le nombre de blocs lui appartenant sur la carte. Si le player de l'exemple ci-dessus quitte la partie, son score vaudra donc $-13$.

### Affichage

Il est demandé que l'état actuel des scores soit affiché par chaque client à côté du canvas. Nous vous fournissons dans les fichiers `index.html` et `style.css` comme point de départ pour cela, que vous pouvez bien entendu modifier et compléter pour obtenir l'affichage que vous souhaitez. Les seules contraintes sont que les scores de chaque joueur ou joueuse doivent être affichés clairement et avec leur id (par exemple `Player <id> : <score>`), et dans un ordre décroissant, du plus haut score au plus bas.

Notez que nous avons décidé de continuer d'afficher le score des joueurs et joueuses qui ont quitté la partie.

La mise à jour des scores affichés sera la responsabilité de `Renderer`. Il vous revient d'implémenter la méthode `updateScores` dans ce but, et de l'appeler correctement afin que les scores affichés soient toujours à jour.

## Multijoueur

### Réplique client

Jusqu'à maintenant, la logique du jeu était exécutée sur le client lui-même. Puisque nous voulons maintenant permettre la coexistence de plusieurs clients sur la même partie, nous choisissons de déplacer cette gestion sur le serveur. Les clients ne seront alors responsables que de l'affichage du jeu, et de l'envoi des interactions de l'utilisateur au serveur. Le serveur, lui, devra réagir à ces interactions et faire évoluer la partie correctement, puis partager toute évolution aux clients pour leur permettre un affichage à jour et synchronisé du jeu.

Dans ce but, nous avons apporté des modifications au fichier `game.js`. Il existe maintenant une classe parente appelée `DrawableGame` qui offre les quelques méthodes et propriétés requises par le renderer pour l'afficher. La classe `Game` hérite donc de `DrawableGame`, et implémente les méthodes additionnelles spécifiques à la gestion du jeu. Une nouvelle classe `Replica` hérite également de `DrawableGame`, et ne fait que se maintenir à jour avec une instance de `Game` qui l'informe de ses évolutions à travers des messages que nous décrivons plus loin. Elle n'est donc responsable d'aucune logique, mais uniquement du maintien synchronisé de ses données.

Notez que, si un client quitte la partie en cours de route, toutes les répliques restantes en seront informées par le serveur, et le `PlayerInfo` correspondant doit être retiré de toutes les répliques (ainsi que de l'instance de `Game`, bien entendu). En revanche, il est attendu que le serveur ne réutilise pas cet id pour un futur player, afin d'éviter toute confusion.

### Communications par websocket

Suite au cours sur la programmation réseau, il doit vous paraitre judicieux d'utiliser le protocole websocket pour permettre la communication entre le serveur et le client, puisqu'il permet à chacun de contacter l'autre sans nécessité de polling (sondage).

Il vous est donc demandé de compléter les fichiers `server.js` et `app.js` pour mettre en place une connexion websocket pour chaque nouveau client. Lorsqu'un nouveau client se connecte, le serveur doit lui créer un nouveau player et l'inclure dans le jeu. À cette fin, une méthode `introduceNewPlayer` est à compléter dans `Game`. De manière similaire, lorsqu'une connexion websocket est fermée par le client, alors il faut retirer le player correspondant du jeu. La méthode `quit` de `Game` a cette responsabilité et est à compléter.

Durant l'execution d'une partie, le client devra envoyer tout message généré par les input listeners au serveur, que la méthode `onMessage` gérera. Inversement, à chaque fois que nécessaire, le serveur enverra des messages à tous les clients connectés les informant des évolutions du jeu nécessitant une mise à jour de l'affichage. Ces messages seront alors gérés par la méthode `onMessage` de `Replica`. Afin de permettre l'envoi de messages de la part du serveur, la classe `Game` prend maintenant un argument supplémentaire, `messageSender`, représentant une fonction qui, lorsque appelée, enverra son premier argument, supposé être un message, à tous les clients actuellement connectés. Il s'agit donc simplement, en d'autres termes, d'un broadcaster passé à `Game` au moment de sa construction.

Pour finir, lorsqu'une partie se termine, le serveur doit fermer toutes les connections actuellement ouvertes et immédiatement démarrer une nouvelle partie. Les clients devront donc recharger la page s'ils veulent la rejoindre. Pour permettre ceci, la classe `Game` prend un autre nouvel argument, `onGameOver`, qui est un callback devant être appelé par `Game` au moment d'un game over. Il pourra ainsi être utilisé pour réinitialiser les connections actuelles en fin de partie.

### Messages

Un certain nombre de messages ont été ajoutés pour permettre au serveur de communiquer les évolutions de la partie aux clients. Nous listons ici les classes correspondantes à compléter dans `messages.js`, qui héritent toutes de `Message`.

- `SetPlayerMessage` permet l'envoi d'un `PlayerInfo` au client. À chaque modification d'informations liées à un joueur, ou à l'apparition d'un nouveau joueur, ce message devra être envoyé aux clients avec la nouvelle valeur de `PlayerInfo` associée. Notez qu'il ne s'agit pas de l'approche la plus efficace en termes de coûts de communication, puisque cela implique d'envoyer l'intégralité de la classe `PlayerInfo` aux clients même si l'évolution ne concerne que la position de sa shape, ou bien le nombre de lignes complétées, mais nous avons fait ce choix dans un but de simplicité d'implémentation.
- `RemovePlayerMessage` informe un client de la suppression d'un joueur, ce qui peut arriver lorsqu'un (autre) client ferme sa connexion au serveur.
- `UpdateGridMessage` permet l'envoi d'une `PlacedShapesGrid` au client. À chaque modification du grid, par exemple lorsqu'une pièce est "slammed", un tel message devra être envoyé aux clients pour les informer du nouvel état de la carte (grid).
- `GameOverMessage` notifie le client que le jeu est terminé.
- `JoinMessage` doit être envoyé à chaque nouveau client au moment où il rejoint le jeu. Ce message contient l'id du player qui lui a été associé. Notez que ce message ne doit pas être broadcasté à tous les clients connectés, mais envoyé directement et uniquement au client rejoignant la partie.

Afin de pouvoir envoyer ces messages à travers le réseau, il sera nécessaire de les encoder et les décoder. Nous choisissons le format JSON pour cela, et vous demandons de compléter la classe `MessageCodec` qui en est responsable. Elle offre deux méthodes statiques :

- `encode` qui prend un message et l'encode en une chaine de caractères respectant le format JSON, et
- `decode` qui prend une chaine de caractères respectant le format JSON et le décode en une instance de message.

Notez que `decode` produit bien une *instance* de message, et non un simple objet obtenu avec `JSON.parse`. Cela est nécessaire pour récupérer les informations telles que le type de message, et l'accès aux méthodes offertes par la classe correspondante. Il vous faudra donc réfléchir aux informations que vous inclurez dans le JSON, et à la manière de décoder un JSON en une instance de la bonne classe.

Notez également qu'un problème similaire se posera avec certaines sous-classes de `Message`, par exemple `SetPlayerMessage` et `UpdateGridMessage`. Ces deux messages offrent des méthodes qui doivent retourner des instances de classes telles que `PlayerInfo` ou `PlacedShapesGrid`, et non de simples objets. Si j'encode un message de type `SetPlayerMessage` puis le décode, je dois donc pouvoir appeler `getPlayer()` sur la valeur retournée et obtenir une instance de `PlayerInfo`, puis appeler `getFallingShape()` sur celle-ci pour obtenir une instance de `FallingShape`.

### Affichage

Nous avons déjà parlé de la nécessité d'afficher les scores de chaque player à côté du canvas. L'affichage doit par ailleurs être modifié ou complété des deux manières suivantes.

- À côté du canvas, l'id qui nous a été assigné doit être affiché clairement (par exemple, `"You are player <id>"`). Une nouvelle méthode `setPlayerId` a été ajoutée au renderer pour l'informer de l'id qui lui a été assigné, tel que fourni par le message `JoinMessage` du serveur.
- L'affichage des pièces tombantes doit être tel que les pièces qui appartiennent à d'autres joueurs soient partiellement transparentes, et affichées *sous* la notre (sur l'axe z). Afin de faciliter l'affichage conditionnellement transparent des pièces, nous avons modifié le tableau `shapeColors` dans `constants.js` pour que la composante alpha de la valeur `rgba` de chaque élément soit `x`, et non plus `1`. Ceci devrait vous permettre d'utiliser une Regexp pour modifier la transparence des pièces en fonction de l'id auquel elles appartiennent.

Nous mentionnons ici que la couleur associée à un joueur peut être choisie arbitrairement, mais doit être la même sur tous les clients : si mes pièces m'apparaissent rouge, alors elles doivent apparaitre rouge chez les autres aussi.

## Game Over

Lorsqu'une partie se termine (parce que le board est trop plein pour permettre à une nouvelle pièce d'être créée, comme nous l'avons vu dans le précédent labo), le serveur doit en notifier les clients, et ceux-ci doivent afficher un popup donnant l'id de la personne qui a gagné, ainsi que son score, ou bien un message pertinent en cas d'égalité. La méthode `gameOver` de `Replica` est responsable de ceci.

Du côté du serveur, celui-ci doit réinitialiser ses données, c'est-à-dire ses joueurs et la carte. Nous vous demandons d'ailleurs, dans ce but, de compléter l'implémentation de la méthode `clear` de `PlacedShapesGrid`.

## Tests

Les tests vous sont fournis pour ce labo. Nous en avons ajouté pour les nouvelles fonctionnalités, et en avons modifié certains pour tester également que les messages envoyés sont cohérents. Par exemple, nous vérifions que des messages `SetPlayerMessage` sont bien envoyés par `Game` à l'appel de `step()` pour chaque pièce du jeu qui a pu descendre d'une case.

Comme pour les labos précédents, nous vous encourageons à compléter nos tests avec les vôtres si vous le souhaitez. Nous vous demandons simplement de ne pas modifier ceux que nous vous fournissons.

# Installation et lancement

Les mêmes instructions que pour le labo précédent sont valables ici. Exécutez `npm install` pour installer toutes les dépendances du projet, et utilisez les différentes commandes (`start`, `watch` et `test`) définies dans `package.json` pour exécuter et tester votre code.

# Travail à réaliser

Il vous est demandé d'implémenter tout ce qui a été décrit dans ce document. Notez que les `TODO` présents dans la donnée ne sont pas exhaustifs par rapport à ce qui vous est demandé. Par exemple, c'est à vous de déterminer où et quand envoyer des messages aux clients, et lesquels.
