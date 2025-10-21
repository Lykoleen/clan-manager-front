/* ===== INITIALISATION ET CONFIGURATION DES ÉVÉNEMENTS ===== */

// Configuration des événements
function initializeEventListeners() {
    refreshBtn.addEventListener('click', refreshClanData);
    
    // Boutons de synchronisation et gestion des données
    const syncBtn = document.getElementById('syncBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    
    if (syncBtn) {
        syncBtn.addEventListener('click', syncWithServer);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    if (importBtn && importFile) {
        importBtn.addEventListener('click', () => importFile.click());
        importFile.addEventListener('change', importData);
    }
}

// Fonction pour initialiser la délégation d'événements du tableau
function initializeTableEventDelegation() {
    if (typeof handleTableClick === 'function') {
        membersTableBody.addEventListener('click', handleTableClick);
        console.log('✅ Délégation d\'événements du tableau initialisée');
    } else {
        console.warn('❌ Fonction handleTableClick non disponible - délégation d\'événements non initialisée');
    }
}


// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async function() {
    // Initialiser les variables globales
    clanTagInput = document.getElementById('clanTag');
    refreshBtn = document.getElementById('refreshBtn');
    membersTableBody = document.getElementById('membersTableBody');
    
    initializeEventListeners();
    initializeSearch();
    
    // Initialiser la délégation d'événements du tableau après un délai
    setTimeout(() => {
        initializeTableEventDelegation();
    }, 50);
    
    // Charger automatiquement les données du clan au démarrage
    // Attendre un peu pour s'assurer que toutes les fonctions sont chargées
    setTimeout(() => {
        if (typeof refreshClanData === 'function') {
            refreshClanData();
        } else {
            console.warn('Fonction refreshClanData non disponible');
        }
    }, 100);
});




