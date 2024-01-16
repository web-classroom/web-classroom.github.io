---
title: Test final - Web
css: style.css
---

# Weather Report Web App

Votre but est d'implémenter une application web permettant de visualiser la météo d'une liste de villes données. Un exemple vous est donné ci-dessous.

![Exemple de l'application à réaliser](/labos/imgs/final-test-example.gif)

Veuillez lire attentivement ce document jusqu'au bout avant de vous lancer. Il décrit entre autres les critères d'évaluation de votre travail.

## User Stories

En tant qu'utilisateur, je veux pouvoir :

- Entrer, dans un champ de texte, le nom d'une ville, puis **appuyer sur Entrée** ou cliquer sur un bouton pour envoyer ma requête.
    - Si aucune ville n'a été trouvée avec ce nom **ou que le champ était vide**, un popup d'erreur m'en informe.
    - Sinon, parmis les villes dont le nom contenait le texte fourni, l'une d'entre elles (arbitrairement) est ajoutée à la liste des villes à afficher (par exemple, si j'ai entré `ausan`, les villes `Lausanne`, `Tempio Pausania` et `Le Mont-sur-Lausanne` pourraient correspondre, et seulement l'une des trois est ajoutée, peu importe laquelle).
    - Aucune ville ne peut apparaitre deux fois dans la liste des villes à afficher.
- Pour chaque ville ajoutée, voir pour cette ville : son nom, et la météo qu'il y fait sous la forme d'une icône, d'un texte descriptif (e.g. "Windy", "Sunny", "Light Rain"), et de la température actuelle.
- Pour chaque ville ajoutée, voir un bouton permettant de supprimer cette ville de la liste des villes à afficher, *au survol de la souris sur cette ville*.
- Pouvoir rafraichir la page sans perdre la liste des villes à afficher.

## Obtention des données météo

Vous obtiendrez les données météo actuelles à l'aide de l'API Web gratuite suivante : [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs). Aucune clé d'accès n'est nécessaire pour l'utiliser.

Nous vous aiguillons ici sur l'utilisation que vous devrez faire de cette API, mais vous trouverez plus de détails dans la documentation. Les requêtes doivent être envoyées à l'URL `https://api.open-meteo.com/v1/forecast` avec les paramètres suivants :

- `latitude` et `longitude` : les coordonnées géographiques de la ville dont vous voulez obtenir la météo.
- `current` contenant une liste des métriques météo que vous voulez obtenir, et donc dans notre cas
    - `temperature_2m`, la température actuelle à 2m du sol, en °C
    - `weather_code`, le code [WMO](https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM) résumant les conditions actuelles, dont nous reparlerons plus bas (voir la section *WMO Weather interpretation codes* en fin de la [page de documentation](https://open-meteo.com/en/docs) pour le sous-ensemble des codes que cet API peut retourner)
    - `is_day`, un booléen indiquant si le soleil est actuellement levé à cet endroit.
    
Vous recevrez alors en réponse un objet JSON contenant les données météo demandées.

## Contenu fourni

Nous vous fournissons les ressources suivantes, à la racine du projet. Vous serez libres de les déplacer dans des dossiers si vous le jugez pertinent.

- `db.sqlite`, qui contient une base de données SQLite contenant une table `cities` avec les champs `city`, `lat`, `lon`, `country`. Vous pourrez l'utiliser pour traduire un nom de ville en des coordonnées géographiques.
- `city.js`, exportant une classe `City` exposant
    - une méthode *asynchrone* statique `getAllMatching(name)` retournant une promesse d'une liste des villes trouvées dans `db.sqlite` dont le nom contient `name` (par exemple, si `name` est `ausan`, cette liste contiendra `Lausanne`, `Tempio Pausania` et `Le Mont-sur-Lausanne`).
    - les propriétés `city`, `lat`, `lon`, `country` correspondant aux champs de la table `cities` de `db.sqlite`.
- `close_icon.png`, une icône de croix rouge à utiliser pour le bouton de suppression d'une ville de la liste.
- `weatherIcons.json`, un fichier JSON contenant, pour chaque [code météo WMO](https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM) utilisé dans cette application, un texte descriptif de la condition météo associée, et l'url d'une icône l'illustrant, pour le jour et pour la nuit.
- `package.json` donne déjà la base d'un projet Node.js, et inclue certaines dépendances dont vous pourriez avoir besoin. Vous pouvez bien sûr en ajouter d'autres.

## Indications d'implémentation

Voici quelques indications sur les choix d'implémentation que nous vous proposons de faire (bien que vous soyez libres d'en faire d'autres) :

- Les requêtes à l'API peuvent être faites depuis le backend, qui utilisera un système de templating pour générer le HTML.
- Le frontend peut simplement raffraichir la page après l'ajout ou la suppression réussie d'une ville de la liste.
- Vous pouvez utiliser [fs](https://nodejs.org/api/fs.html#fsreadfilesyncpath-options) pour lire le contenu de `weatherIcons.json`.
- L'état de l'application (la liste des villes à afficher) peut être stocké en mémoire (et donc ne pas être persisté).

## Tests

Nous vous demandons d'implémenter au moins un test unitaire vérifiant que votre gestion de la liste des villes à afficher (ajout et suppression d'une ville) fonctionne correctement. Vous pouvez utiliser le framework de test de votre choix.

Nous devrons pouvoir lancer vos tests avec `npm test`.

## Installation

Nous vous fournissons un squelette volontairement minimal pour ce projet. Nous avons déjà exécuté `npm init` pour initialiser un projet Node.js avec quelques dépendances, mais rien de plus.

Il vous revient donc de créer tout fichier ou dossier que vous jugerez nécessaire pour ce projet.

L'unique contrainte est que nous puissions lancer votre projet avec `npm start`, et qu'il affiche alors l'URL sur laquelle il écoute.

## Critères d'évaluation

- Interaction `npm`
    - `npm install` doit installer toutes les dépendances nécessaires à votre projet.
    - `npm test` doit lancer vos tests unitaires.
    - `npm start` doit lancer votre application et afficher l'URL sur laquelle elle écoute.
- Respect des consignes
    - Respect des user stories et du visuel attendu.
    - Pertinence et justesse du ou des tests unitaires.
- Qualité technique
    - Stabilité de l'application.
    - Utilisation correcte de la programmation asynchrone.
    - Choix d'implémentation pertinents.
