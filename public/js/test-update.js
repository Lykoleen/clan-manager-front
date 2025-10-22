// ===== SCRIPT DE TEST POUR VÉRIFIER LA SAUVEGARDE =====

// Copiez-collez ce script dans la console de votre navigateur

function testMemberUpdate() {
    console.log('🧪 Test de mise à jour d\'un membre...');
    
    if (!clanMembers || clanMembers.length === 0) {
        console.log('❌ Aucun membre trouvé');
        return;
    }
    
    // Prendre le premier membre
    const testMember = clanMembers[0];
    console.log('👤 Membre de test:', testMember.name, testMember.tag);
    console.log('📊 Données actuelles:');
    console.log('  - Comments:', testMember.comments);
    console.log('  - Participations:', testMember.participations);
    
    // Simuler une modification
    const newData = {
        comment: 'Test modification ' + new Date().toLocaleTimeString(),
        participations: {
            gdc: true,
            jdc: false,
            league: true,
            raids: false
        }
    };
    
    console.log('\n🔧 Simulation de modification...');
    console.log('  - Nouveau commentaire:', newData.comment);
    console.log('  - Nouvelles participations:', newData.participations);
    
    // Appeler la fonction de sauvegarde expandable
    const memberId = `member-${testMember.tag.replace('#', '')}`;
    console.log('\n💾 Appel de saveMemberDataExpandable...');
    
    // Simuler les éléments DOM
    const mockElements = {
        [`${memberId}-comment`]: { value: newData.comment },
        [`${memberId}-gdc`]: { checked: newData.participations.gdc },
        [`${memberId}-jdc`]: { checked: newData.participations.jdc },
        [`${memberId}-league`]: { checked: newData.participations.league },
        [`${memberId}-raids`]: { checked: newData.participations.raids }
    };
    
    // Mock des fonctions DOM
    const originalGetElementById = document.getElementById;
    document.getElementById = function(id) {
        return mockElements[id] || null;
    };
    
    // Appeler la fonction
    saveMemberDataExpandable(memberId);
    
    // Restaurer la fonction originale
    document.getElementById = originalGetElementById;
    
    // Vérifier après 2 secondes
    setTimeout(() => {
        console.log('\n✅ Vérification après 2 secondes:');
        const updatedMember = clanMembers.find(m => m.tag === testMember.tag);
        if (updatedMember) {
            console.log('  - Comments mis à jour:', updatedMember.comments);
            console.log('  - Participations mises à jour:', updatedMember.participations);
            
            if (updatedMember.comments === newData.comment) {
                console.log('🎉 SUCCÈS: Les données sont correctement mises à jour !');
            } else {
                console.log('❌ ÉCHEC: Les données ne sont pas mises à jour');
            }
        }
    }, 2000);
}

// Instructions
console.log('📋 Script de test disponible:');
console.log('1. testMemberUpdate() - Teste la mise à jour d\'un membre');
console.log('');
console.log('💡 Utilisez testMemberUpdate() pour vérifier que la correction fonctionne');
