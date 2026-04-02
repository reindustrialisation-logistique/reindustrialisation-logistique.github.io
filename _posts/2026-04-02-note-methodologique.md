---
title: "Note méthodologique"
date: 2026-04-02
layout: article
tags: [reindustrialisation, logistique, méthodologie]
author: Nathan Gouin
---

## 1. Objectifs

Dans le cadre du projet *« Transitions, réindustrialisation et logistique »* (financement CPIER Vallée de Seine, 2025-2027), une base de données sur les annonces d’investissements industriels en France est en cours de construction. Cette base vise à compléter les outils existants de mesure de la « réindustrialisation », qui restent encore lacunaires. Les dispositifs aujourd’hui les plus mobilisés, comme le baromètre de la réindustrialisation du ministère de l’Économie ou certains suivis réalisés par la presse spécialisée, reposent le plus souvent sur une mesure partielle du phénomène, généralement centrée sur le solde entre ouvertures et fermetures de sites industriels. Ces approches sont souvent complétées par l’analyse de l’évolution de l’emploi industriel, à partir de données issues de l’INSEE ou de l’Urssaf, ce qui permet de mieux saisir les dynamiques territoriales de l’industrie.

En revanche, il n’existe pratiquement pas, hormis quelques bases payantes comme Trendeo, de base de données géographique recensant de manière systématique les annonces d’investissements industriels. C’est ce manque que ce travail cherche à combler. La base est construite à partir du recensement et de l’exploitation qualitative d’articles de presse spécialisée, afin de documenter les investissements annoncés, leurs localisations, leurs montants, leurs secteurs d’activité et, lorsque cela est possible, leurs justifications et leurs effets attendus. La base ne mesure donc pas directement les investissements réalisés, mais les annonces d’investissements territorialisées telles qu’elles apparaissent dans la presse spécialisée.

Les informations suivantes étaient à extraire :

- Date de l’annonce
- Lieu (commune, département, région, avec code INSEE pour faire des tables de correspondance)
- Montants des investissements
- Montants et origine des subventions (si disponibles)
- Nombre d’emplois annoncés (si informations disponibles)
- Empreinte foncière (si disponible)
- Type d’investissements (ouverture/construction, extension, accroissement des capacités, décarbonation, modernisation, maintenance)
- Secteurs d’activité, selon nomenclature NAF (niveau `xx`, pas `xx.x` ou `xx.xx`)
- Motivations affichées de l’investissement (si disponibles)
- Clients (si disponibles)

### Périmètre de la base

| Incorporé dans la base | Exclu de la base |
|---|---|
| Les annonces d’investissements industriels territorialisés en France | Les rachats d’entreprise lorsqu’ils ne s’accompagnent pas d’un investissement productif identifié |
| Les projets pour lesquels un lieu précis peut être identifié (commune au minimum) | Les investissements annoncés à l’échelle nationale ou trop générale, sans localisation exploitable |
| Les investissements chiffrés ou suffisamment renseignés pour permettre une extraction | Les projets vagues, trop imprécis ou insuffisamment documentés |
| Les opérations de construction/ouverture, extension, accroissement des capacités, modernisation, maintenance, décarbonation | Les liquidations et fermetures sans annonce d’investissement associée |
| Les investissements portés par des entreprises privées ou, le cas échéant, par des acteurs publics lorsqu’ils financent ou portent directement le projet | Les articles qui mentionnent un montant relevant du chiffre d’affaires, d’un achat ou d’une acquisition, sans rapport avec un investissement productif |
| Les projets concernant des sites industriels ou, selon les cas, des fonctions directement liées au site concerné (ex. logistique si c’est l’activité du site) | Les projets dont le secteur ou le site ne peut pas être qualifié de manière suffisamment fiable après traitement et vérification |
| Les annonces d’investissement, qu’elles soient ou non suivies d’une réalisation effective | Les investissements effectivement réalisés lorsqu’ils n’ont pas fait l’objet d’une annonce repérée dans le corpus |

L’industrie n’est pas prise ici au sens strict : les centres logistiques, les entrepôts, les data centers, les infrastructures énergétiques, ainsi que les projets industriels ou énergétiques portés par des acteurs publics sont pris en compte.

L’exploitation qualitative de ces articles pose toutefois un problème méthodologique important. La lecture, l’annotation et le report manuel des informations pour chaque article sont particulièrement chronophages et supposeraient des moyens humains que nous ne disposons pas dans le cadre du projet. C’est pourquoi plusieurs solutions d’automatisation partielle ont été envisagées puis testées, avant d’aboutir à la solution actuellement retenue.

## 2. Solutions explorées

La première piste testée a consisté à entraîner un modèle de reconnaissance d’entités et d’extraction d’informations à partir de spaCy. Cette solution n’a pas donné de résultats satisfaisants. Elle supposait en effet un travail d’annotation préalable sur un très grand nombre d’articles, alors même que la diversité des formulations rencontrées dans les textes restait trop importante pour garantir des performances suffisantes. Malgré une certaine régularité apparente dans la structure des articles de presse spécialisée, la variété des formes lexicales, des tournures et des contextes d’énonciation limitait fortement la fiabilité de l’extraction.

Une deuxième solution a ensuite été développée en Python, en combinant plusieurs bibliothèques de traitement automatique du langage et plusieurs bases externes. Ce script mobilisait notamment le modèle linguistique `fr_core_news_md` de spaCy, une base de données sur les communes françaises avec code INSEE, département et région, une base sur les anciennes communes, une base sur les lieux-dits, ainsi qu’une base entreprise issue de Sirene.

Ce script permettait plusieurs opérations :

- extraction des dates des articles ;
- identification des communes susceptibles de correspondre aux lieux d’investissement, à partir des premières lignes de l’article, puis croisement avec des référentiels territoriaux, selon une approche hybride combinant recherche exacte et recherche floue lorsque la recherche exacte échouait ;
- proposition d’une classification sectorielle à partir d’une nomenclature de secteurs associés à des mots-clés, enrichis par variantes lexicales, puis attribution d’un score à chaque secteur pour retenir la catégorie la plus probable ;
- extraction des montants d’investissement à l’aide d’expressions régulières de type *« nombre + million(s) ou milliard(s) + euros »*, avec conversion de certaines formes exprimées en lettres ou sous forme approximative ;
- extraction de phrases relatives aux subventions publiques et à la création d’emplois, afin qu’elles puissent ensuite être traitées qualitativement.

Cette solution a permis de gagner du temps, mais elle présentait plusieurs limites importantes. L’identification des entreprises, d’abord, restait très imparfaite. Le nom utilisé dans les articles correspond souvent à une appellation courante ou médiatique, qui diffère du nom juridique enregistré dans Sirene. Les entités nommées extraites par spaCy étaient elles-mêmes incomplètes, et même après nettoyage des formulations (*« groupe »*, *« SAS »*, *« société »*, etc.), les croisements restaient peu convaincants. Le recours à des méthodes *fuzzy* améliorait marginalement les résultats, mais au prix d’un taux d’erreur élevé en raison du faible seuil nécessaire pour obtenir des correspondances.

Surtout, l’identification de l’entreprise n’avait pas seulement pour objectif d’attribuer un nom ; elle devait aussi permettre un croisement avec Sirene pour retrouver le secteur d’activité. Or un deuxième problème apparaissait alors : l’activité du site concerné par l’investissement ne correspond pas nécessairement à l’activité principale du groupe. Ce point compliquait fortement la procédure, puisqu’il fallait alors combiner le nom du groupe, le lieu du site et une logique de vérification en plusieurs étapes, avec un risque d’erreur important.

De manière générale, cette deuxième solution nécessitait encore un nettoyage ligne par ligne, et elle restait fragile sur plusieurs variables importantes, notamment la détection du secteur d’activité. En outre, les catégories sectorielles produites ne correspondaient pas directement à une nomenclature standardisée, ce qui compliquait ensuite les comparaisons avec d’autres jeux de données, notamment sur l’emploi.

Ces difficultés nous ont conduits à retenir une troisième solution, fondée sur l’usage de modèles de langage de grande taille pour l’extraction des informations.

## 3. Modèle retenu

La solution mobilisée repose sur un pipeline de traitement automatisé en Python. Ce pipeline articule plusieurs opérations : un filtrage préalable des articles, une extraction d’informations par modèles de langage, un enrichissement territorial à partir d’une base commune externe, puis un export tabulaire final suivi d’un contrôle qualité.

L’objectif n’est pas de supprimer toute intervention humaine, mais de réduire fortement le temps consacré à l’extraction tout en conservant des mécanismes de contrôle. Il s’agit donc d’une extraction semi-automatisée.

Il convient de souligner que la base ne résulte pas d’un traitement entièrement automatique. L’automatisation intervient comme un outil d’aide à l’extraction et à la structuration des informations, mais le jugement humain conserve un rôle central à plusieurs étapes du protocole. Il intervient d’abord en amont, dans la définition des catégories retenues, des critères d’exclusion et des règles de codage. Il intervient ensuite dans la construction progressive des tables de correction, notamment pour les communes ou pour certains cas récurrents repérés au fil du traitement. Il joue également un rôle essentiel dans l’arbitrage des doublons, dans la validation des cas ambigus, dans l’interprétation des configurations multi-sites, ainsi que dans le contrôle final de certains codages sectoriels. La base doit donc être comprise non comme une production automatique, mais comme une base assistée par automatisation, dans laquelle les outils de traitement permettent d’accélérer le travail de collecte et de structuration sans supprimer la nécessité d’une validation experte.

### Structuration des données d’entrée

Le pipeline prend en entrée un dossier de fichiers `.txt`, avec un fichier correspondant à un article. Chaque fichier respecte une structure minimale : la première ligne contient le titre, la deuxième la date, les lignes suivantes le corps du texte. Cette standardisation simple permet de stabiliser la lecture des articles et d’identifier de manière fiable les informations de base avant extraction.

L’analyse porte sur l’ensemble des articles édités par un média entre 2008 et 2025. Un filtre est opéré afin de ne retenir que les articles *a priori* en rapport avec un investissement, même si un filtre plus robuste est ensuite appliqué.

**Date.** La date fait l’objet d’une normalisation systématique. Le script accepte plusieurs formats, notamment `JJ/MM/AAAA`, `AAAA-MM-JJ`, ou encore des dates rédigées en français comme *« 31 mai 2023 »* ou *« 1er janvier 2024 »*. Dans tous les cas, la date est convertie dans un format homogène.

### Filtrage préalable des articles

Avant tout appel aux modèles de langage, un filtre déterministe est appliqué. Il vise à sélectionner les articles les plus susceptibles de contenir une annonce d’investissement quantifiée. Ce filtrage est important pour deux raisons : il réduit le coût de traitement, et il limite l’introduction de bruit dans la base finale.

Le script examine les quarante premières lignes de chaque article et y recherche la présence d’un montant monétaire exprimé en euros, milliers, millions ou milliards d’euros. Plusieurs formes d’écriture sont reconnues, qu’il s’agisse des montants en toutes lettres ou des formes abrégées telles que `k€`, `M€` ou `Md€`. Toutefois, la présence d’un montant ne suffit pas. Le script exclut les cas où ce montant apparaît dans une phrase renvoyant manifestement à un autre registre, en particulier le chiffre d’affaires, l’achat, le rachat ou l’acquisition. Ce filtre permet ainsi d’écarter une partie des articles qui mentionnent des montants sans pour autant documenter un investissement productif.

Sont également exclus de la base, à ce stade ou lors de la consolidation finale :

- les rachats d’entreprise lorsqu’aucun investissement productif n’y est associé ;
- les projets trop vagues ;
- les liquidations ;
- les investissements non ventilés territorialement, par exemple lorsqu’un groupe annonce investir une somme à l’échelle de la France sans autre précision spatiale.

Ces cas peuvent être pertinents du point de vue économique, mais ils ne répondent pas aux critères de territorialisation et de qualification retenus pour la base.

### Extraction par modèles de langage

L’extraction proprement dite repose sur une architecture à deux modèles. Cette séparation répond à une logique pragmatique : certaines variables sont relativement simples à extraire à l’échelle de l’article, tandis que d’autres, comme la qualification sectorielle ou la gestion de plusieurs sites, demandent un raisonnement plus fin.

Un premier modèle, `gpt-4o-mini`, est chargé d’extraire les variables globales de l’article, à l’exception de la NAF et des sites. Il identifie notamment :

- les entreprises investisseuses ;
- le type d’investissement ;
- le montant total ;
- les emplois créés ;
- les subventions ;
- l’empreinte foncière ;
- les motivations explicites ;
- les clients éventuels ;
- la multimodalité.

Un second modèle, `gpt-5`, est mobilisé pour deux tâches plus spécifiques :

- l’identification de la division NAF correspondant à l’activité principale du site concerné ;
- l’extraction du ou des sites mentionnés dans l’article.

L’objectif est ici de mieux traiter les cas complexes, en particulier les situations multi-sites et les cas dans lesquels l’activité du site diffère de celle du groupe. Le recours à ce modèle plus récent est dû à des tests avec `gpt-4o-mini` qui révélaient des erreurs dans la détection de certains secteurs d’activité, notamment dans les cas complexes. En revanche, `gpt-5` s’est révélé d’une très grande précision.

Les deux appels sont systématiques et indépendants. Il n’y a pas de substitution d’un modèle par l’autre. La logique retenue est donc une logique de complémentarité.

### Encadrement de l’extraction

L’extraction par LLM est fortement contrainte par le script. Les modèles doivent renvoyer exclusivement du JSON, sans texte périphérique. Lorsqu’une information est absente, la valeur `NC` est imposée. Cette normalisation est essentielle pour rendre possible le traitement automatique des sorties.

Plusieurs règles sont également fixées en amont :

- les montants doivent être exprimés en millions d’euros, avec conversion automatique lorsque nécessaire (ex. `900 000`, ou encore `1,5 milliard`) ;
- en cas de fourchette, la moyenne est retenue ;
- le champ des entreprises investisseuses inclut non seulement les entreprises privées, mais aussi les acteurs publics lorsqu’ils financent ou portent directement le projet.

Le script distingue clairement les variables globales, valables à l’échelle de l’article, et les variables par site. Ces dernières ne doivent être renseignées que lorsqu’il existe plusieurs sites distincts ou une ventilation explicite des informations dans le texte.

Le traitement du secteur d’activité fait l’objet d’une attention particulière. La NAF demandée correspond à la division de l’activité principale du site concerné par l’investissement, et non à l’activité générale du groupe. Lorsqu’un groupe opère dans plusieurs branches d’activité, c’est bien celle du site en question qui est retenue. Par exemple, si Renault ouvre un centre logistique, l’activité retenue est la logistique et non la construction automobile. Pour renforcer la traçabilité du codage, le modèle doit produire une citation extraite de l’article permettant de justifier la classification.

Enfin, le type d’investissement est contraint par une nomenclature fermée (cf. section 1), afin de limiter les variations lexicales et de faciliter les comparaisons en aval.

### Fusion, validation et normalisation

Une fois les deux réponses obtenues, le pipeline les fusionne. Les variables globales extraites par `gpt-4o-mini` constituent la base principale, tandis que la NAF et les sites sont repris depuis `gpt-5`. Les signaux de qualité produits par les deux modèles sont conservés et agrégés.

Une phase de validation intervient ensuite. Elle vise à homogénéiser les types de données, à convertir les champs numériques lorsque cela est possible, à corriger certaines incohérences simples et à forcer la valeur `NC` lorsqu’une information n’est pas exploitable. Lorsque les sorties sont incomplètes, le script reconstruit une structure minimale afin de conserver un format constant.

Le pipeline intègre également plusieurs mécanismes de robustesse technique :

- nouvelle tentative en cas d’échec d’appel ;
- nettoyage du JSON retourné ;
- suppression de balises parasites ;
- isolement du bloc utile lorsqu’un texte entoure la réponse.

Ces éléments sont moins centraux du point de vue analytique, mais ils sont indispensables au bon fonctionnement de la chaîne de traitement.

### Enrichissement territorial

Les communes extraites par les modèles ne sont pas conservées telles quelles. Elles sont croisées avec un référentiel externe des communes françaises contenant le code INSEE, le département et la région. Les noms sont normalisés (minuscules, suppression des accents, homogénéisation des apostrophes et tirets) afin de faciliter les correspondances.

Le script tente d’abord une correspondance directe. Lorsque le département est connu, il sert à lever certaines ambiguïtés. Si la recherche échoue, des variantes sont testées, notamment avec ajout de déterminants (ex. *Val d’Hazey* non trouvé, recherche avec ajout de *Le*, *La* ou *Les*). Un fichier optionnel de correction des communes peut également être mobilisé pour remplacer automatiquement certaines formes erronées ou non standardisées. Cette étape est utile, en particulier, lorsque des erreurs récurrentes sont repérées au fil de la consolidation.

L’enrichissement territorial permet ainsi d’attribuer à chaque site :

- une commune stabilisée ;
- un code INSEE ;
- un département ;
- une région.

La base devient ainsi exploitable pour des analyses spatiales et pour d’éventuels croisements avec d’autres données.

### Gestion des cas multi-sites

Le pipeline détermine ensuite si l’article relève d’un cas mono-site ou multi-sites. Cette décision repose sur le nombre de communes distinctes identifiées après normalisation. Lorsque plusieurs communes différentes sont présentes, l’investissement est traité comme multi-sites.

Cette distinction a des conséquences directes sur la structure de la base. La sortie finale adopte en effet une logique d’**une ligne par site** :

- un article mono-site produit une seule ligne ;
- un article multi-sites peut produire plusieurs lignes, qui partagent les mêmes variables globales mais diffèrent par la commune et, le cas échéant, par les variables spécifiques à chaque site (montant investi, secteurs, etc.).

Une vérification manuelle est effectuée systématiquement pour ces cas complexes.

### Contrôle qualité et consolidation

Après le traitement automatisé, une phase de consolidation reste nécessaire. Elle porte principalement sur les erreurs ou doutes repérés par le script : problèmes sur les noms de communes, hésitations concernant le secteur d’activité, ambiguïtés sur la typologie de l’investissement, ou encore informations incomplètes.

Pour faciliter cette consolidation, le pipeline extrait automatiquement certaines citations issues des articles, en particulier pour la NAF et pour les motivations affichées de l’investissement. Ces citations permettent de revenir rapidement au matériau source lors de la vérification, sans devoir relire intégralement chaque article.

Le script produit par ailleurs un onglet de contrôle qualité dans lequel sont regroupés les cas signalés. Plusieurs critères peuvent conduire à une vérification manuelle :

- niveau de confiance faible ;
- commune non précisée ;
- commune introuvable dans le référentiel ;
- NAF manquante ;
- justification insuffisante ;
- incohérence dans les champs extraits.

L’objectif n’est pas de supprimer les cas imparfaits, mais de les isoler pour consolidation.

Le coût de traitement reste limité, de l’ordre d’environ **0,01 € par article** avec la mobilisation combinée de GPT-4o-mini et GPT-5.

### Post-traitement : suppression des doublons

Une phase spécifique de suppression des doublons est nécessaire. En effet, un même projet peut faire l’objet de plusieurs articles : un article lors de la décision d’investissement, un autre lors du lancement des travaux, un autre encore lors de l’inauguration, ou à l’occasion d’une évolution du projet.

La détection repose sur une règle semi-automatisée, fondée sur un filtre combinant :

- le nom de l’entreprise ;
- le lieu ;
- l’année.

Lorsqu’un même lieu, une même entreprise et des montants proches sont détectés, une alerte est produite. Un seuil de proximité des montants inférieur à **20 %** est utilisé comme indicateur de doublon potentiel. Ces cas sont ensuite vérifiés manuellement. Cette étape est indispensable pour éviter de compter plusieurs fois un même investissement.

Cela a permis de constituer une première base sur les investissements annoncés recensant plus de **7 100 investissements industriels en France entre 2008 et 2025**, à partir d’une source de presse spécialisée, après nettoyage de la base.

## 4. Limites de la base

Cette base présente plusieurs limites qu’il convient de signaler.

La première tient au matériau mobilisé. À ce stade, la base repose essentiellement sur un seul média de presse spécialisée. Cela peut engendrer l’absence de certains projets, notamment parmi les investissements de plus petite taille ou les projets moins médiatisés. En revanche, les investissements les plus importants sont, en pratique, presque toujours couverts. L’intégration d’autres sources est en cours, afin de limiter ce biais de couverture. La même méthodologie, reproductible, sera mise en place.

La deuxième limite tient à la nature même de l’information recueillie. Le matériau utilisé est déclaratif. Il en résulte que certains projets recensés ont pu ne pas aboutir, tout en restant présents dans la base. À l’inverse, certains projets ont pu évoluer, être déplacés ou être redimensionnés au fil du temps. Il arrive par exemple qu’un projet soit d’abord envisagé dans un lieu, puis dans un autre. Ce type de trajectoire peut potentiellement conduire à gonfler artificiellement le montant total des investissements recensés dans un secteur ou un territoire donné si le travail de consolidation ne permet pas d’identifier correctement ces déplacements.

Néanmoins, ce matériau donne des informations précieuses sur le dynamisme de l’industrie dans son ensemble, et sur des secteurs d’activités plus précisément. Il fait également le lien avec le territoire.

Lorsque plusieurs articles existent pour un même projet, il est parfois possible de vérifier qu’un investissement annoncé a bien été réalisé, par exemple lorsqu’un article initial est suivi d’un article sur l’inauguration du site. Cette possibilité est relativement fréquente dans le cas des constructions d’usines, mais beaucoup plus rare pour les modernisations d’équipements, les opérations de maintenance ou les investissements plus discrets. Dans la majorité des cas, nous disposons donc d’une information sur l’annonce d’investissement, et non sur sa réalisation effective.

Une autre limite est propre également à la source médiatique, qui va avoir tendance à privilégier :

- les gros montants ;
- les projets portés par des entreprises visibles, ou meilleures communicantes ;
- certains secteurs ;
- certains territoires plus médiatisés.

Il existe donc un biais de visibilité médiatique, lié également aux sources et aux parcours de chaque correspondant régional du média.

Enfin, le protocole retenu privilégie les investissements explicitement chiffrés et suffisamment territorialisés, et tend par conséquent à sous-représenter les projets plus modestes, plus vagues ou non quantifiés.