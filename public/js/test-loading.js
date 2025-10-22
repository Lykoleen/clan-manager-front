// ===== SCRIPT DE TEST POUR VÉRIFIER LE CHARGEMENT DES DONNÉES =====

// Copiez-collez ce script dans la console de votre navigateur

async function testDataLoading() {
    console.log('🧪 Test de chargement des données depuis le serveur...');
    
    if (!currentClanTag) {
        console.log('❌ Aucun clan sélectionné');
        return;
    }
    
    const cleanTag = currentClanTag.replace('#', '');
    console.log('📡 Chargement des données pour le clan:', cleanTag);
    
    try {
        const response = await fetch(`${SERVER_URL}/api/clan/${cleanTag}/members`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 Réponse du serveur:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('📊 Données reçues du serveur:', data);
            
            // Vérifier spécifiquement les données de Lyko
            const lykoData = data.members['22QU902G0'];
            if (lykoData) {
                console.log('👤 Données de Lyko depuis le serveur:');
                console.log('  - Nom:', lykoData.name);
                console.log('  - Comment:', lykoData.comment);
                console.log('  - Participations:', lykoData.participations);
            } else {
                console.log('❌ Aucune donnée trouvée pour Lyko (22QU902G0)');
                console.log('📋 Membres disponibles:', Object.keys(data.members));
            }
            
            // Vérifier le nombre total de membres
            const memberCount = Object.keys(data.members).length;
            console.log(`📊 Total de membres avec données: ${memberCount}`);
            
        } else {
            const errorText = await response.text();
            console.error('❌ Erreur serveur:', response.status, errorText);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
    }
}

async function testLoadClanAdditionalData() {
    console.log('🧪 Test de loadClanAdditionalData...');
    
    if (!currentClanTag) {
        console.log('❌ Aucun clan sélectionné');
        return;
    }
    
    try {
        const additionalData = await loadClanAdditionalData(currentClanTag);
        console.log('📊 Données supplémentaires chargées:', additionalData);
        
        if (additionalData && additionalData.members) {
            const lykoData = additionalData.members['22QU902G0'];
            if (lykoData) {
                console.log('👤 Données de Lyko via loadClanAdditionalData:');
                console.log('  - Comment:', lykoData.comment);
                console.log('  - Participations:', lykoData.participations);
            } else {
                console.log('❌ Aucune donnée trouvée pour Lyko');
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

// Instructions
console.log('📋 Scripts de test disponibles:');
console.log('1. testDataLoading() - Test direct de l\'API');
console.log('2. testLoadClanAdditionalData() - Test de la fonction de chargement');
console.log('');
console.log('💡 Utilisez testDataLoading() pour voir ce que retourne le serveur');
