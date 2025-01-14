"use strict";

// Fonction pour générer un composant HTML dynamiquement
function generateCommonComponent(component) {
    // Vérification des données d'entrée
    if (!component || typeof component !== "object") {
        console.error("Erreur : données du composant invalides.");
        return "";
    }

    // Création du contenu HTML
    const headerHTML = `
        <header class="header">
            <div class="header_title">
                <h1>${component.title || "Titre non défini"}</h1>
                <h4>${component.description || "Description non définie"}</h4>
            </div>
        </header>
    `;

    const navigationHTML = `
        <nav class="navigation">
            <ul>
                ${component.navigation
                    .map(
                        (item) => `
                    <li class="navigation__item">
                        <a href="${item.url || "#"}">${item.label || "Lien"}</a>
                    </li>
                `
                    )
                    .join("")}
            </ul>
        </nav>
    `;

    const contentBlocksHTML = `
        <main class="team-container">
            ${component.contentBlocks
                .map(
                    (block) => `
                <div class="team-card">
                    <img src="${block.image || "#"}" alt="${block.title || "Image"}" class="team-photo">
                    <h3>${block.title || "Titre"}</h3>
                    <p>${block.description || "Description"}</p>
                </div>
            `
                )
                .join("")}
        </main>
    `;

    const sponsorsHTML = `
        <div class="financeurs-footer">
            <h4>Financeurs</h4>
            <div class="financeurs-list">
                ${component.sponsors
                    .map(
                        (sponsor) => `
                    <div class="financeur-item">
                        <img src="${sponsor.logo || "#"}" alt="${sponsor.name || "Logo"}" class="financeur-logo">
                    </div>
                `
                    )
                    .join("")}
            </div>
        </div>
    `;

    const footerHTML = `
        <footer class="footer">
            <div class="site-info">
                <p>&copy; ${new Date().getFullYear()} ${component.siteTitle || "Nom du site"}</p>
            </div>
            ${sponsorsHTML}
        </footer>
    `;

    return `
        <div class="common-component">
            ${headerHTML}
            ${navigationHTML}
            ${contentBlocksHTML}
            ${footerHTML}
        </div>
    `;
}

// Export du composant pour utilisation ailleurs
export default generateCommonComponent;
