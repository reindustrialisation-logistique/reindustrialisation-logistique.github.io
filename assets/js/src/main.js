import generateCommonComponent from "./commonComponent.js";
import componentData from "./componentData.js";

// Ajoutez le contenu généré dans l'élément cible
document.getElementById("app").innerHTML = generateCommonComponent(componentData);
