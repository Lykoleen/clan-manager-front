// ===== SCRIPT DE TEST POUR VÉRIFIER LA CORRECTION =====

// Copiez-collez ce script dans la console de votre navigateur

function testDataRetrieval() {
    console.log('🧪 Test de récupération des données...');
    
    // 1. Vérifier les données dans clanMembers
    const lykoMember = clanMembers.find(m => m.tag === '#22QU902G0');
    console.log('📊 Données dans clanMembers:');
    if (lykoMember) {
        console.log('  - Comments:', lykoMember.comments);
        console.log('  - Participations:', lykoMember.participations);
    } else {
        console.log('❌ Lyko non trouvé dans clanMembers');
    }
    
    // 2. Tester la fonction getMemberSavedData
    console.log('\n🔍 Test de getMemberSavedData:');
    const memberId = 'member-22QU902G0';
    const savedData = getMemberSavedData(memberId);
    console.log('📊 Données récupérées par getMemberSavedData:');
    console.log('  - Comment:', savedData.comment);
    console.log('  - Participations:', savedData.participations);
    
    // 3. Vérifier si les données correspondent
    if (lykoMember && savedData.comment === lykoMember.comments) {
        console.log('✅ SUCCÈS: Les données sont correctement récupérées !');
    } else {
        console.log('❌ ÉCHEC: Les données ne correspondent pas');
        console.log('  - clanMembers.comments:', lykoMember ? lykoMember.comments : 'N/A');
        console.log('  - getMemberSavedData.comment:', savedData.comment);
    }
    
    // 4. Tester le rafraîchissement de l'interface
    console.log('\n🔄 Test de rafraîchissement de l\'interface...');
    if (typeof displayMembers === 'function') {
        console.log('📱 Appel de displayMembers...');
        displayMembers();
        console.log('✅ Interface rafraîchie');
    } else {
        console.log('❌ Fonction displayMembers non disponible');
    }
}

// Instructions
console.log('📋 Script de test disponible:');
console.log('1. testDataRetrieval() - Teste la récupération des données');
console.log('');
console.log('💡 Utilisez testDataRetrieval() pour vérifier la correction');
