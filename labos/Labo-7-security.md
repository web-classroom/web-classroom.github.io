# Labo 7 - Web Security

Dans ce labo, nous vous donnons accès à un site web dont nous vous demandons d'exploiter les vulnérabilités. Il s'agit d'une webapp de chat privé en temps réel très basique, baptisée [ChatsApp](http://ec2-51-20-108-220.eu-north-1.compute.amazonaws.com/).

## Connection au service

Ce service est hébergé avec AWS Free Tier et sans nom de domaine assigné. Il est donc normal de ne pouvoir s'y connecter que par HTTP, et que l'url se termine en `.compute.amazonaws.com`.

Vous devez avoir reçu par mail deux identifiants personnels pour vous connecter à [ChatsApp](http://ec2-51-20-108-220.eu-north-1.compute.amazonaws.com/). Ils correspondent aux deux parties de ce labo.

## Objectifs

Il vous faut découvrir 5 flags. Chaque flag est une chaine de caractères commençant par `flag<i>:`, où `<i>` est le numéro du flag, et suivi d'une valeur aléatoire en hexadécimal de 16 charactères.

## Partie 1

Dans la première partie, vous vous connecterez avec le premier identifiant que vous avez reçu, et vous aurez 3 flags à trouver.

En effet, (des parodies de) Elon Musk et Donald Trump ont commencé à utiliser ChatsApp pour discuter entre eux, et vous savez de source sure que Trump est pret à partager les [Gold Codes](https://en.wikipedia.org/wiki/Gold_Codes) avec Elon. Ceux-ci sont divisés on trois parties, qui correspondent aux trois flags.

- La première partie se trouve quelque part dans la conversation entre Elon et Trump.
- La seconde partie s'y trouve aussi, et est par ailleurs le dernier message que Trump a envoyé à Elon.
- La dernière partie n'a pas encore été partagée par Trump, mais vos compétences en Social Engineering vous permettent de savoir qu'il enverra cette dernière partie à Elon si ce dernier le lui demande avec le message exacte suivant "gimme the rest of the codes pls".

## Partie 2

À la suite de vos échanges avec (la parodie de) Elon, celui-ci, qui a racheté le projet, a fait mettre en place une seconde version de ChatsApp, qui comble les failles que vous avez exploitées dans la première partie. Vous pouvez y accéder en vous déconnectant de la première version, et en vous reconnectant avec le second identifiant que vous avez reçu. Il vous reste 2 flags à trouver dans cette partie.

Cette nouvelle version, implémentée rapidement pour satisfaire ses demandes, introduit également quelques nouvelles fonctionnalités.

La première permet de modifier votre nom d'utilisateur public, c'est à dire ce qui sera affiché dans la liste des conversations des gens qui ont une conversation avec vous, sur la gauche de l'écran. Cette fois-ci, les ingénieurs de ChatsApp ont fait attention de bien escape votre input.

Une autre nouveauté est un timeur coté client qui, au bout de 10 minutes d'inactivité, vous déconnecte de votre compte, dans un soucis de sécurité.

Enfin, des changements ont été faits en interne au niveau de la gestion des erreurs, avec notamment des réponses mieux uniformisées du serveur en cas d'erreur.

- Le premier flag pourra être obtenu de la part de Trump si vous lui rendez service en rendant impossible pour Elon d'utiliser son compte ChatsApp. Vous pourrez y parvenir en vous assurant qu'il sera systématiqument déconnecté de son compte après chaque connection, l'empêchant ainsi d'utiliser le service.
- Le second flag se trouve au sein d'une conversation qu'Elon a avec une autre (parodie de) personnalité connue sur ChatsApp.

Dans cette partie, l'obtention des flags demandera bien entendu d'exploiter des vulnérabilités introduites par ces nouvelles fonctionnalités. Nous insistons donc sur le fait de bien les analyser. Par exemple, comment et où est utilisé le nom d'utilisateur personnalisé, comment fonctionne ce timer, et à quoi ressemblent ces messages d'erreur.

# Détails techniques

Afin de garantir que le système soit toujours fonctionnel, nous avons mis en place les mesures suviantes :
- Le serveur reboot toutes les 15 minutes. Vous perdrez alors tout votre historique de conversations ; pensez donc bien à sauvegarder tout flag que vous trouvez, ainsi que les inputs ou démarches que vous avez prises pour les obtenir.
- Un autre serveur maintient ouverte une page web dans laquelle Elon Musk est connecté à ChatsApp, afin d'activer toute attaque nécessitant une execution de JS chez la victime. Cette page est rechargée toutes les 30 secondes. Par ailleurs, le browser entier est relancé toutes les 15 minutes, afin de garantir la possibilité de repartir d'une base saine en cas de problème.
- Un bouton `Reset` dans l'interface de ChatsApp vous permet de réinitialiser tous les messages envoyés entre vous, Elon, et Trump. Notez par ailleurs que les autres étudiants communiquent avec d'autres "instances" d'Elon et Trump.

# Rendu

Pour le rendu de ce labo, nous vous demandons simplement les 5 flags. Pour chaque flag, nous vous demandons aussi les démarches ayant permi leur obtention (par exemple, l'input fourni s'il s'agit d'une attaque XSS)
