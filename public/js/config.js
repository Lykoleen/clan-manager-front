/* ===== CONFIGURATION DE L'APPLICATION ===== */

// Configuration globale de l'application
window.__APP_CONFIG__ = {
    // URL de l'API pour la synchronisation des données
    API_URL: 'http://localhost:3000/api/members',
    
    // Configuration du serveur (pour le déploiement)
    SERVER_URL: 'http://localhost:3000',
    
    // Paramètres de synchronisation
    SYNC_SETTINGS: {
        // Délai de debounce pour la sauvegarde automatique (ms)
        SAVE_DEBOUNCE_DELAY: 1000,
        
        // Délai avant tentative de synchronisation après reconnexion (ms)
        RECONNECT_SYNC_DELAY: 500,
        
        // Stratégie de résolution de conflit
        CONFLICT_RESOLUTION: 'server', // 'server', 'local', 'manual'
        
        // Taille maximale des fichiers d'import (bytes)
        MAX_IMPORT_SIZE: 10 * 1024 * 1024, // 10MB
    },
    
    // Configuration des messages
    MESSAGES: {
        // Durées d'affichage des messages (ms)
        SUCCESS_TIMEOUT: 3000,
        ERROR_TIMEOUT: 4000,
        WARNING_TIMEOUT: 3500,
        INFO_TIMEOUT: 5000,
    },
    
    // Fonctionnalités activées
    FEATURES: {
        AUTO_SYNC: true,
        OFFLINE_MODE: true,
        EXPORT_IMPORT: true,
        STATUS_MESSAGES: true,
        DEBUG_LOGS: true, // Activer les logs détaillés en console
    }
};

// Fonction pour obtenir une configuration
function getConfig(key, defaultValue = null) {
    const keys = key.split('.');
    let value = window.__APP_CONFIG__;
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return defaultValue;
        }
    }
    
    return value;
}

// Fonction pour définir une configuration
function setConfig(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    let target = window.__APP_CONFIG__;
    
    for (const k of keys) {
        if (!target[k] || typeof target[k] !== 'object') {
            target[k] = {};
        }
        target = target[k];
    }
    
    target[lastKey] = value;
}

// Fonction pour afficher la configuration actuelle (debug)
function logConfig() {
    if (getConfig('FEATURES.DEBUG_LOGS', false)) {
        console.log('🔧 Configuration de l\'application:', window.__APP_CONFIG__);
    }
}

// Initialiser la configuration au chargement
document.addEventListener('DOMContentLoaded', function() {
    logConfig();
    
    // Afficher le mode de stockage actuel
    if (getConfig('FEATURES.DEBUG_LOGS', false)) {
        console.log('📱 Mode de stockage:', navigator.onLine ? 'online' : 'offline');
        console.log('🌐 URL API:', getConfig('API_URL'));
    }
});