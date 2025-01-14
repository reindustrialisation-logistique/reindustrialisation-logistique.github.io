"use strict";

// Importer le composant depuis commonComponent.js
import generateCommonComponent from "./commonComponent.js";

// Exemple d'utilisation : données fictives
const componentData = {
    title: "Titre du Projet",
    description: "Description du projet ici.",
    navigation: [
        { url: "/home", label: "Accueil" },
        { url: "/about", label: "À propos" },
    ],
    contentBlocks: [
        { image: "/assets/images/team1.jpg", title: "Membre 1", description: "Description 1" },
        { image: "/assets/images/team2.jpg", title: "Membre 2", description: "Description 2" },
    ],
    sponsors: [
        { logo: "/assets/images/sponsor1.png", name: "Sponsor 1" },
        { logo: "/assets/images/sponsor2.png", name: "Sponsor 2" },
    ],
    siteTitle: "Nom du Site",
};

// Générer le composant et l'insérer dans l'élément avec l'ID "app"
document.getElementById("app").innerHTML = generateCommonComponent(componentData);
