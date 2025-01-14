import generateCommonComponent from ".assets/js/src/commonComponent.js";
import componentData from ".assets/js/src//componentData.js";

// Ajoutez le contenu généré dans l'élément cible
document.getElementById("app").innerHTML = generateCommonComponent(componentData);
