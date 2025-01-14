"use strict";

// Vérifiez si l'objet `commonComponent` est déjà défini dans l'environnement global
if (typeof window !== "undefined" && window.commonComponent) {
    // Utilisez directement l'objet `commonComponent` global
    const commonComponent = window.commonComponent;

    // Exemple d'utilisation :
    console.log("Common Component chargé :", commonComponent);
} else {
    console.error("Erreur : commonComponent n'est pas défini. Vérifiez le fichier src/commonComponent.js");
}
