/* ===== UTILITAIRES ET STOCKAGE ===== */

// ===== CONFIGURATION ET VARIABLES GLOBALES =====
// Configuration de l'API - peut être surchargée via window.__APP_CONFIG__
const SERVER_URL = (typeof window !== 'undefined' && window.__APP_CONFIG__?.SERVER_URL) || 'http://localhost:3000';

// Mode de stockage actuel (online/offline)
let STORAGE_MODE = navigator.onLine ? 'online' : 'local';

// Debounce pour éviter les requêtes multiples
let saveTimeout = null;
const SAVE_DEBOUNCE_DELAY = 1000; // 1 seconde

// ===== GESTION DES MODES ONLINE/OFFLINE =====
// Détection automatique des changements de connectivité
window.addEventListener('online', () => {
    console.log('🌐 Connexion rétablie - passage en mode online');
    STORAGE_MODE = 'online';
    showStatusMessage('Connexion rétablie - synchronisation en cours...', 'info');
    
    // Tentative de synchronisation automatique
    setTimeout(() => {
        syncWithServer();
    }, 500);
});

window.addEventListener('offline', () => {
    console.log('📴 Connexion perdue - passage en mode local');
    STORAGE_MODE = 'local';
    showStatusMessage('Mode hors-ligne activé - données sauvegardées localement', 'warning');
});

// ===== FONCTIONS DE SYNCHRONISATION =====

// Fonction pour charger les données supplémentaires d'un clan depuis le serveur
async function loadClanAdditionalData(clanTag) {
    try {
        if (!clanTag) return null;
        
        const cleanTag = clanTag.replace('#', '');
        console.log('📡 Chargement des données supplémentaires depuis le serveur...');
        
        const response = await fetch(`${SERVER_URL}/api/clan/${cleanTag}/members`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const clanData = await response.json();
            console.log(`✅ Données supplémentaires chargées pour le clan ${cleanTag}`);
            
            // Sauvegarder en local comme backup
            localStorage.setItem(`clanAdditionalData_${cleanTag}`, JSON.stringify(clanData));
            
            return clanData;
        } else {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement des données supplémentaires:', error);
        showStatusMessage('Erreur de chargement des données supplémentaires - utilisation des données locales', 'warning');
        
        // Fallback vers localStorage
        const cleanTag = clanTag.replace('#', '');
        const localData = localStorage.getItem(`clanAdditionalData_${cleanTag}`);
        return localData ? JSON.parse(localData) : { clanTag: cleanTag, members: {} };
    }
}

// Fonction pour charger les données supplémentaires depuis le localStorage
function loadStoredClanAdditionalData(clanTag) {
    const cleanTag = clanTag.replace('#', '');
    const stored = localStorage.getItem(`clanAdditionalData_${cleanTag}`);
    return stored ? JSON.parse(stored) : { clanTag: cleanTag, members: {} };
}

// Fonction pour sauvegarder les données supplémentaires d'un membre
async function saveMemberAdditionalData(memberTag, memberData) {
    try {
        console.log('🔧 saveMemberAdditionalData appelée:', { memberTag, memberData, currentClanTag, STORAGE_MODE, navigatorOnLine: navigator.onLine });
        
        if (!currentClanTag) {
            console.warn('❌ Aucun clan sélectionné pour la sauvegarde');
            return;
        }

        // Debounce pour éviter les requêtes multiples
        if (saveTimeout) {
            console.log('⏰ Annulation du timeout précédent');
            clearTimeout(saveTimeout);
        }
        
        console.log('⏰ Programmation de la sauvegarde dans 1 seconde...');
        saveTimeout = setTimeout(async () => {
            if (STORAGE_MODE === 'online' && navigator.onLine) {
                console.log('📡 Sauvegarde des données supplémentaires sur le serveur...');
                
                const cleanClanTag = currentClanTag.replace('#', '');
                const cleanMemberTag = memberTag.replace('#', '');
                
                console.log('🌐 Envoi vers le serveur:', {
                    url: `${SERVER_URL}/api/clan/${cleanClanTag}/member/${cleanMemberTag}`,
                    data: memberData
                });
                
                const response = await fetch(`${SERVER_URL}/api/clan/${cleanClanTag}/member/${cleanMemberTag}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(memberData)
                });
                
                console.log('📡 Réponse du serveur:', response.status, response.statusText);
                
                if (response.ok) {
                    const result = await response.json();
                    console.log(`✅ Données du membre ${cleanMemberTag} sauvegardées:`, result);
                    
                    // Mettre à jour clanMembers avec les nouvelles données
                    const member = clanMembers.find(m => m.tag === memberTag);
                    if (member) {
                        member.comments = memberData.comment || '';
                        member.participations = memberData.participations || {};
                        console.log('🔄 clanMembers mis à jour pour:', memberTag);
                    }
                    
                    // Sauvegarder aussi en local comme backup
                    saveMemberDataToLocal(memberTag, memberData);
                    
                    showStatusMessage('Données du membre sauvegardées', 'success');
                } else {
                    const errorText = await response.text();
                    console.error('❌ Erreur serveur:', response.status, errorText);
                    throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
                }
            } else {
                // Mode local ou serveur indisponible
                console.log('💾 Sauvegarde locale des données supplémentaires...');
                
                // Mettre à jour clanMembers même en mode local
                const member = clanMembers.find(m => m.tag === memberTag);
                if (member) {
                    member.comments = memberData.comment || '';
                    member.participations = memberData.participations || {};
                    console.log('🔄 clanMembers mis à jour localement pour:', memberTag);
                }
                
                saveMemberDataToLocal(memberTag, memberData);
                showStatusMessage('Données sauvegardées localement', 'info');
            }
        }, SAVE_DEBOUNCE_DELAY);
        
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde des données supplémentaires:', error);
        // Fallback vers le localStorage
        saveMemberDataToLocal(memberTag, memberData);
        showStatusMessage('Erreur de sauvegarde - données sauvées localement', 'error');
    }
}

// Fonction pour sauvegarder les données d'un membre en local
function saveMemberDataToLocal(memberTag, memberData) {
    if (!currentClanTag) return;
    
    const cleanClanTag = currentClanTag.replace('#', '');
    const cleanMemberTag = memberTag.replace('#', '');
    
    // Récupérer les données existantes du clan
    let clanData = loadStoredClanAdditionalData(currentClanTag);
    
    // Mettre à jour les données du membre
    clanData.members[cleanMemberTag] = {
        ...clanData.members[cleanMemberTag],
        ...memberData,
        lastUpdated: new Date().toISOString()
    };
    
    // Sauvegarder en local
    localStorage.setItem(`clanAdditionalData_${cleanClanTag}`, JSON.stringify(clanData));
}

// Fonction de synchronisation avec le serveur
async function syncWithServer() {
    try {
        if (!navigator.onLine) {
            showStatusMessage('Pas de connexion - synchronisation impossible', 'warning');
            return;
        }
        
        if (!currentClanTag || !clanMembers || clanMembers.length === 0) {
            showStatusMessage('Aucune donnée à synchroniser', 'warning');
            return;
        }
        
        showStatusMessage('Synchronisation en cours...', 'info');
        
        // 1. D'abord sauvegarder les données locales vers le serveur
        console.log('📤 Sauvegarde des données locales vers le serveur...');
        await saveMembers();
        
        // 2. Ensuite charger les données depuis le serveur pour vérifier
        console.log('📥 Chargement des données depuis le serveur...');
        const serverMembers = await loadMembers();
        
        console.log('✅ Synchronisation terminée');
        showStatusMessage('Synchronisation réussie', 'success');
        
    } catch (error) {
        console.error('❌ Erreur de synchronisation:', error);
        showStatusMessage('Erreur de synchronisation', 'error');
    }
}

// Fonction pour sauvegarder les membres dans le localStorage (fallback)
function saveMembersToStorage() {
    localStorage.setItem('clanMembers', JSON.stringify(clanMembers));
}

// Fonction pour charger les membres depuis le serveur (manquante)
async function loadMembers() {
    try {
        if (!currentClanTag) {
            console.warn('Aucun clan sélectionné');
            return [];
        }
        
        const cleanTag = currentClanTag.replace('#', '');
        console.log('📡 Chargement des membres depuis le serveur...');
        
        const response = await fetch(`${SERVER_URL}/api/clan/${cleanTag}/members`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${Object.keys(data.members || {}).length} membres chargés depuis le serveur`);
            return data.members || {};
        } else {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement des membres:', error);
        // Fallback vers localStorage
        return loadStoredMembers();
    }
}

// Fonction pour sauvegarder les membres sur le serveur (manquante)
async function saveMembers() {
    try {
        if (!currentClanTag || !clanMembers || clanMembers.length === 0) {
            console.warn('Aucune donnée à sauvegarder');
            return;
        }
        
        const cleanTag = currentClanTag.replace('#', '');
        console.log('📡 Sauvegarde des membres sur le serveur...');
        
        // Préparer les données pour le serveur
        const membersData = {};
        clanMembers.forEach(member => {
            const cleanMemberTag = member.tag.replace('#', '');
            membersData[cleanMemberTag] = {
                name: member.name,
                tag: member.tag,
                level: member.level,
                trophies: member.trophies,
                role: member.role,
                donations: member.donations || 0,
                donationsReceived: member.donationsReceived || 0,
                comment: member.comments || '',
                participations: member.participations || {
                    gdc: false,
                    jdc: false,
                    league: false,
                    raids: false
                },
                lastUpdated: new Date().toISOString()
            };
        });
        
        const response = await fetch(`${SERVER_URL}/api/clan/${cleanTag}/members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ members: membersData })
        });
        
        if (response.ok) {
            console.log(`✅ ${clanMembers.length} membres sauvegardés sur le serveur`);
            showStatusMessage('Données synchronisées avec le serveur', 'success');
        } else {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde des membres:', error);
        // Fallback vers localStorage
        saveMembersToStorage();
        showStatusMessage('Erreur de synchronisation - données sauvées localement', 'warning');
    }
}

// Fonction pour charger les membres depuis le localStorage
function loadStoredMembers() {
    const stored = localStorage.getItem('clanMembers');
    if (stored) {
        const parsedData = JSON.parse(stored);
        // Si c'est un tableau (ancien format), le retourner tel quel
        if (Array.isArray(parsedData)) {
            return parsedData;
        }
        // Si c'est un objet avec des membres, convertir en tableau
        if (parsedData.members && typeof parsedData.members === 'object') {
            return Object.values(parsedData.members);
        }
        // Fallback
        return [];
    }
    return [];
}

// Fonction pour afficher un message de statut
function showStatusMessage(message, type = 'success') {
    // Supprimer les messages existants
    const existingMessages = document.querySelectorAll('.status-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Créer le nouveau message
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message ${type}`;
    statusDiv.textContent = message;
    
    // Ajouter des styles CSS si nécessaire
    if (!document.querySelector('#status-message-styles')) {
        const style = document.createElement('style');
        style.id = 'status-message-styles';
        style.textContent = `
            .status-message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease-out;
            }
            .status-message.success { background-color: #10b981; }
            .status-message.error { background-color: #ef4444; }
            .status-message.warning { background-color: #f59e0b; }
            .status-message.info { background-color: #3b82f6; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(statusDiv);
    
    // Supprimer automatiquement après 4 secondes (plus long pour les messages d'info)
    const timeout = type === 'info' ? 5000 : 3000;
    setTimeout(() => {
        if (statusDiv.parentNode) {
            statusDiv.remove();
        }
    }, timeout);
}

// Fonction utilitaire pour formater les tags
function formatTag(tag) {
    return tag.startsWith('#') ? tag : `#${tag}`;
}

// Fonction pour exporter les données (améliorée)
function exportData() {
    try {
        if (!clanMembers || clanMembers.length === 0) {
            showStatusMessage('Aucune donnée à exporter', 'warning');
            return;
        }

        // Créer un objet avec métadonnées
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            memberCount: clanMembers.length,
            members: clanMembers
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        // Générer un nom de fichier avec timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `catbreakers-backup-${timestamp}.json`;
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        
        showStatusMessage(`${clanMembers.length} membres exportés avec succès`, 'success');
        
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        showStatusMessage('Erreur lors de l\'exportation des données', 'error');
    }
}

// Fonction pour importer des données (améliorée avec validation)
function importData(event) {
    const file = event.target.files[0];
    if (!file) {
        showStatusMessage('Aucun fichier sélectionné', 'warning');
        return;
    }

    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showStatusMessage('Fichier trop volumineux (max 10MB)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validation du format des données
            let members = null;
            
            // Support des anciens formats (tableau direct) et nouveaux formats (avec métadonnées)
            if (Array.isArray(importedData)) {
                members = importedData;
            } else if (importedData.members && Array.isArray(importedData.members)) {
                members = importedData.members;
                console.log(`Import depuis backup du ${importedData.exportDate || 'date inconnue'}`);
            } else {
                throw new Error('Format de fichier non reconnu');
            }

            // Validation basique des membres
            if (members.length === 0) {
                throw new Error('Aucun membre trouvé dans le fichier');
            }

            // Validation de la structure des membres (vérification basique)
            const firstMember = members[0];
            if (!firstMember.name && !firstMember.tag) {
                throw new Error('Structure de membre invalide - propriétés name ou tag manquantes');
            }

            // Confirmation avant import
            const confirmMessage = `Importer ${members.length} membres ? Cela remplacera les données actuelles.`;
            if (confirm(confirmMessage)) {
                clanMembers = members;
                
                // Sauvegarder selon le mode actuel
                if (STORAGE_MODE === 'online' && navigator.onLine) {
                    saveMembers();
                } else {
                    saveMembersToStorage();
                }
                
                displayMembers();
                showStatusMessage(`${members.length} membres importés avec succès`, 'success');
            }
            
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            showStatusMessage(`Erreur d'import: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        showStatusMessage('Erreur lors de la lecture du fichier', 'error');
    };
    
    reader.readAsText(file);
    
    // Réinitialiser l'input pour permettre le même fichier
    event.target.value = '';
}

// Fonction exposée pour l'intégration API externe
function saveComment(memberId, data) {
    // Cette fonction peut être surchargée pour envoyer les données à un serveur
    console.log('Sauvegarde externe:', memberId, data);
    
    // Exemple d'intégration avec une API :
    /*
    fetch('/api/member-comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            memberId: memberId,
            comment: data.comment,
            participations: data.participations
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log('Sauvegarde serveur réussie:', result);
    })
    .catch(error => {
        console.error('Erreur sauvegarde serveur:', error);
        showStatusMessage('Erreur lors de la sauvegarde sur le serveur', 'error');
    });
    */
}










