// ===== SCRIPT DE TEST POUR VÉRIFIER L'INTERFACE =====

// Copiez-collez ce script dans la console de votre navigateur

function testInterface() {
    console.log('🧪 Test de l\'interface...');
    
    // 1. Vérifier les boutons de sauvegarde
    const saveButtons = document.querySelectorAll('.save-btn');
    console.log('🔘 Boutons de sauvegarde trouvés:', saveButtons.length);
    
    saveButtons.forEach((btn, index) => {
        const memberId = btn.getAttribute('data-member-id');
        console.log(`  - Bouton ${index + 1}: data-member-id="${memberId}"`);
    });
    
    // 2. Vérifier les zones de détails
    const detailRows = document.querySelectorAll('[id$="-details"]');
    console.log('📋 Zones de détails trouvées:', detailRows.length);
    
    detailRows.forEach((row, index) => {
        const memberId = row.id.replace('-details', '');
        console.log(`  - Zone ${index + 1}: ${memberId}`);
    });
    
    // 3. Vérifier les éléments de formulaire pour Lyko
    const lykoElements = {
        comment: document.getElementById('member-22QU902G0-comment'),
        gdc: document.getElementById('member-22QU902G0-gdc'),
        jdc: document.getElementById('member-22QU902G0-jdc'),
        league: document.getElementById('member-22QU902G0-league'),
        raids: document.getElementById('member-22QU902G0-raids')
    };
    
    console.log('👤 Éléments de formulaire pour Lyko:');
    Object.entries(lykoElements).forEach(([key, element]) => {
        if (element) {
            const value = element.type === 'checkbox' ? element.checked : element.value;
            console.log(`  - ${key}: ${value}`);
        } else {
            console.log(`  - ${key}: ❌ Non trouvé`);
        }
    });
    
    // 4. Test de simulation de modification
    if (lykoElements.comment) {
        console.log('\n🔧 Test de simulation de modification...');
        
        // Modifier le commentaire
        lykoElements.comment.value = 'Test depuis l\'interface ' + new Date().toLocaleTimeString();
        
        // Modifier les participations
        if (lykoElements.gdc) lykoElements.gdc.checked = true;
        if (lykoElements.league) lykoElements.league.checked = true;
        
        console.log('✅ Modifications simulées');
        console.log('  - Nouveau commentaire:', lykoElements.comment.value);
        console.log('  - GDC:', lykoElements.gdc ? lykoElements.gdc.checked : 'N/A');
        console.log('  - League:', lykoElements.league ? lykoElements.league.checked : 'N/A');
        
        // Appeler la fonction de sauvegarde
        console.log('\n💾 Appel de saveMemberDataExpandable...');
        saveMemberDataExpandable('member-22QU902G0');
        
    } else {
        console.log('❌ Impossible de tester - éléments de formulaire non trouvés');
        console.log('💡 Ouvrez d\'abord la zone de détails de Lyko');
    }
}

// Instructions
console.log('📋 Script de test disponible:');
console.log('1. testInterface() - Teste l\'interface et simule une modification');
console.log('');
console.log('💡 Utilisez testInterface() pour diagnostiquer le problème');
