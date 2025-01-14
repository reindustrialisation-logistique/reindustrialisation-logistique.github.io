import generateCommonComponent from ".assets/js/commonComponent.js";
import componentData from ".assets/js/componentData.js";

// Ajoutez le contenu généré dans l'élément cible
document.getElementById("app").innerHTML = generateCommonComponent(componentData);
