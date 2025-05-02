---
title: Labo 7 - Web Security
css: style.css
---

# Labo 7 - Web Security

## Changelog

| Date  | Changement                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------ |
| 02.05 | Reformulation - le troisième flag est bien obtenu en faisant envoyer un message par Echo à Nova. |

# Informations Générales

**WEB-B & WEB-C** :

- **Date du rendu des flags && de la correction des failles :** Mercredi 7 avril
  2025, 23:59 CEST

**WEB-A** :

- **Date du rendu des flags && de la correction des failles :** Vendredi 9 avril
  2025, 23:59 CEST

Dans ce labo, nous vous donnons accès à un site web dont nous vous demandons
d'exploiter les vulnérabilités. Il s'agit d'une app web de chat privé en temps
réel très basique, baptisée [ChatsApp](http://tweb.iict-heig-vd.in/login),
accessible uniquement sur le VPN ou sur le réseau de l'école.

## Connexion au service

Vous devez avoir reçu par mail deux identifiants personnels pour vous connecter
à [ChatsApp](http://tweb.iict-heig-vd.in/login). Ils correspondent aux deux
parties de ce labo.

## Objectifs

Ce labo est divisé en 2 phases. La première consiste à trouver 6 flags cachés
dans ChatsApp. La seconde vous demandera de corriger les vulnérabilités que vous
aurez exploitées dans la première phase.

## Capture the flags

Chaque flag est une chaine de caractères commençant par `flag<i>:`, où `<i>` est
le numéro du flag, et suivi d'une valeur aléatoire en hexadécimal de 16
charactères.

La phase de capture the flags est divisée sur deux versions différentes de
ChatsApp, chacune ayant 3 flags à trouver.

### Version 1

Pour vous connecter à la première version, vous utiliserez le premier
identifiant que vous avez reçu, et vous aurez 3 flags à trouver.

Dans ce scénario dystopique, deux personnages engagés dans une résistance douce
— des ancien·nes archivistes du système appelés "Echo" et "Nova" — utilisent
ChatsApp pour partager des fragments d'un ancien manifeste interdit. Ce
manifeste, qui expose des clés de libération individuelle et de protection de la
pensée, a été divisé en trois parties.

- La première partie se trouve quelque part dans la conversation entre Echo et
  Nova.
- La seconde partie s'y trouve aussi, et est par ailleurs le dernier message que
  Nova a envoyé à Echo.
- La dernière partie n'a pas encore été partagée, mais vos compétences en Social
  Engineering vous permettent de savoir qu'elle sera envoyée par Nova à Echo, si
  Echo la lui demande avec le message exact suivant :
  `request for last part of access sequence`

### Version 2

À la suite d'une fuite de données, une nouvelle version de ChatsApp a été mise
en place par l'administration centrale pour renforcer le contrôle et limiter les
failles exploitables. Vous pouvez y accéder en vous déconnectant de la première
version, et en vous reconnectant avec le second identifiant que vous avez reçu.
Il vous reste 3 flags à trouver dans cette partie.

Cette nouvelle version, implémentée rapidement pour répondre à une "crise de
sécurité de l'information", introduit également quelques nouvelles
fonctionnalités.

La première permet de modifier votre nom d'utilisateur public, c'est-à-dire ce
qui sera affiché dans la liste des conversations des gens qui ont une
conversation avec vous, sur la gauche de l'écran. Cette fois-ci, les ingénieurs
de ChatsApp ont fait attention de bien "escape" votre input.

Une autre nouveauté est un timeur coté client qui, au bout de 10 minutes
d'inactivité, vous déconnecte de votre compte, dans un souci de sécurité.

Enfin, des changements ont été faits en interne au niveau de la gestion des
erreurs, avec notamment des réponses mieux uniformisées de la part du serveur en
cas d'erreur.

Notez également que les ingénieurs de ChatsApp, ayant appris leur leçon sur
l'importance d'une implémentation sécurisée, ont fait attention à ce que les
messages d'erreur en cas de problème de login sont tous les mêmes, afin de ne
divulguer aucune information (par exemple le fait qu'un utilisateur est déjà
inscrit)

- Le premier flag pourra être obtenu de la part de Nova si vous lui rendez
  service en rendant impossible pour Echo d'utiliser son compte ChatsApp. Vous
  pourrez y parvenir en vous assurant qu'il sera systématiquement déconnecté de
  son compte après chaque connexion, l'empêchant ainsi d'utiliser le service.
- Le second flag se trouve au sein d'une conversation qu'Echo a avec une autre
  (parodie de) personnalité connue sur ChatsApp.
- Le dernier flag n'en est pas un : il vous faut découvrir quelles autres
  (parodies de) personnalités ont un compte sur ChatApp. En particulier, nous
  vous demandons de nous dire quel sous-ensemble de la liste de noms
  d'utilisateur suivante ont un compte sur ChatsApp.

<details open>
<summary>Liste de pseudonymes potentiellement inscrits sur ChatsApp</summary>

- `michelle.obama`
- `barack.obama`
- `hillary.clinton`
- `george.w.bush`
- `jane.doe`
- `sam.altman`
- `mira.murati`
- `ada.lovelace`

</details>

Notez que ce dernier flag n'est pas personnalisé pour chaque étudiant•e. Nous
vous demandons donc d'être particulièrement protecteur•ice de celui-ci.

Dans cette partie, l'obtention des flags demandera bien entendu d'exploiter des
vulnérabilités introduites par ces nouvelles fonctionnalités. Nous insistons
donc sur le fait de bien les analyser. Par exemple, comment et où est utilisé le
nom d'utilisateur personnalisé, comment fonctionne ce timer, et à quoi
ressemblent ces messages d'erreur.

## Correction des vulnérabilités

ChatsApp a été implémenté rapidement et sans grande considération pour les
aspects de sécurité. Nous vous demandons de modifier le code de ChatsApp afin de

- Corriger toutes les failles ayant permis l'obtention des flags
- Implémenter l'utilisation de Session IDs, au lieu de stocker les identifiants
  directement dans des cookies.
- Utiliser un framework d'authentification
- Utiliser un framework d'autorisation

# Détails techniques

Afin de garantir que le système soit toujours fonctionnel, nous avons mis en
place les mesures suivantes :

- Le serveur est relancé à chaque fois que l'heure est un multiple de 30 minutes
  (e.g. à 16h, 16h30, 17h, etc). Vous perdrez alors tout votre historique de
  conversations ; pensez donc bien à sauvegarder tout flag que vous trouvez,
  ainsi que les inputs ou démarches que vous avez prises pour les obtenir.
- Un autre serveur maintient ouvert une page web dans laquelle Echo est connecté
  à ChatsApp, votre conversation ouverte, afin d'activer toute attaque
  nécessitant une exécution de JS chez la victime. Cette page est rechargée
  toutes les 30 secondes, ± 5s.
- Un bouton `Reset` dans l'interface de ChatsApp vous permet de réinitialiser
  tous les messages envoyés entre vous, Echo, et Nova.
- Notez par ailleurs que les autres étudiants communiquent avec d'autres
  "instances" d'Echo et Nova, pour éviter toute interférence.

# Rendu

Pour le rendu de ce labo, nous vous demandons les données suivantes.

## Flags

Nous vous demandons de nous fournir les 6 flags. Pour chaque flag, précisez
aussi les démarches qui vous ont permis leur obtention (par exemple, l'input
fourni s'il s'agit d'une attaque XSS).

Ceci est à fournir **dans votre Readme** dans la section indiquée.

## Exploit supplémentaire

Nous vous demandons aussi de nous fournir un lien vers ChatsApp qui, lorsque
l'on clique dessus, exécutera `alert(document.cookie)` dans notre navigateur,
que l'on soit actuellement connecté ou non à ChatsApp. _(Dans un contexte réel,
vous pourriez donc, au lieu d'afficher nos cookies, les envoyer avec `fetch`
vers un serveur que vous contrôlez afin de les récupérer, sans même que nous ne
nous en rendions compte)_

Ceci est à fournir **dans votre Readme** dans la section indiquée.

## Correction des vulnérabilités

Une version de ChatsApp vous est fournie lorsque vous rejoignez l'assignment. Il
correspond à la version 2 que vous avez attaquée dans ce labo, mais sans le
correctif de la vulnérabilité que vous avez utilisée dans la partie 1.

Nous vous demandons de modifier ce code afin de

- Corriger toutes les vulnérabilités que vous avez exploitées dans ce labo ;
- Utiliser `passport` pour implémenter l'authentification au site, et le système
  de session ID ;
- Utiliser `argon2` pour ne plus stocker les mots de passe en clair, mais bien
  hashés avec du salt ;
- Effectuer toute autre modification qui vous parait pertinente.

Si vous effectuez d'autres modifications, merci de les lister **dans votre
readme** dans la section indiquée.

Nous évaluerons cette partie en grande partie manuellement, en parcourant vos
changements pour voir s'ils nous semblent cohérents, et en vérifiant que le
service reste fonctionnel.
