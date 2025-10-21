// ===== SCRIPT DE TEST DU FLUX DE SAUVEGARDE =====

// Ajoutez ce script dans la console de votre navigateur pour tester

function testSaveFlow() {
    console.log('🧪 Test du flux de sauvegarde...');
    
    // 1. Vérifier les variables globales
    console.log('\n📊 Variables globales:');
    console.log('  - currentClanTag:', currentClanTag);
    console.log('  - STORAGE_MODE:', STORAGE_MODE);
    console.log('  - navigator.onLine:', navigator.onLine);
    console.log('  - SERVER_URL:', SERVER_URL);
    console.log('  - clanMembers.length:', clanMembers ? clanMembers.length : 'undefined');
    
    // 2. Vérifier qu'un membre existe
    if (clanMembers && clanMembers.length > 0) {
        const testMember = clanMembers[0];
        console.log('\n👤 Premier membre pour test:');
        console.log('  - Nom:', testMember.name);
        console.log('  - Tag:', testMember.tag);
        console.log('  - Comments:', testMember.comments);
        console.log('  - Participations:', testMember.participations);
        
        // 3. Simuler une modification
        console.log('\n🔧 Simulation d\'une modification...');
        const testData = {
            comment: 'Test commentaire ' + new Date().toLocaleTimeString(),
            participations: {
                gdc: true,
                jdc: false,
                league: true,
                raids: false
            }
        };
        
        console.log('  - Données de test:', testData);
        
        // 4. Appeler la fonction de sauvegarde
        console.log('\n💾 Appel de saveMemberDataTable...');
        saveMemberDataTable(testMember.tag, testData);
        
        // 5. Vérifier après 2 secondes
        setTimeout(() => {
            console.log('\n✅ Vérification après 2 secondes:');
            const updatedMember = clanMembers.find(m => m.tag === testMember.tag);
            if (updatedMember) {
                console.log('  - Comments mis à jour:', updatedMember.comments);
                console.log('  - Participations mises à jour:', updatedMember.participations);
            }
        }, 2000);
        
    } else {
        console.log('❌ Aucun membre trouvé pour le test');
    }
}

function testDirectSave() {
    console.log('🧪 Test de sauvegarde directe...');
    
    if (!currentClanTag || !clanMembers || clanMembers.length === 0) {
        console.log('❌ Prérequis manquants pour le test');
        return;
    }
    
    const testMember = clanMembers[0];
    const testData = {
        name: testMember.name,
        comment: 'Test direct ' + new Date().toLocaleTimeString(),
        participations: { gdc: true, jdc: false, league: true, raids: false }
    };
    
    console.log('📤 Envoi direct vers le serveur...');
    console.log('  - Clan:', currentClanTag);
    console.log('  - Membre:', testMember.tag);
    console.log('  - Données:', testData);
    
    // Appel direct de la fonction de sauvegarde
    saveMemberAdditionalData(testMember.tag, testData);
}

// Instructions
console.log('📋 Scripts de test disponibles:');
console.log('1. testSaveFlow() - Test complet du flux de sauvegarde');
console.log('2. testDirectSave() - Test de sauvegarde directe');
console.log('');
console.log('💡 Utilisez testSaveFlow() pour diagnostiquer le problème');
