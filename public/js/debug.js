// ===== SCRIPT DE DEBUG POUR VÉRIFIER LES DONNÉES =====

// Ajoutez ce script dans la console de votre navigateur pour debugger

function debugClanMembers() {
    console.log('🔍 Debug des données clanMembers:');
    console.log('Nombre de membres:', clanMembers.length);
    
    clanMembers.forEach((member, index) => {
        console.log(`\n👤 Membre ${index + 1}: ${member.name} (${member.tag})`);
        console.log('  - comments:', member.comments);
        console.log('  - participations:', member.participations);
        
        // Vérifier aussi dans localStorage
        const localData = localStorage.getItem(`memberData_${member.tag}`);
        if (localData) {
            const parsed = JSON.parse(localData);
            console.log('  - localStorage comment:', parsed.comment);
            console.log('  - localStorage participations:', parsed.participations);
        }
    });
}

function debugSpecificMember(memberTag) {
    const member = clanMembers.find(m => m.tag === memberTag);
    if (member) {
        console.log(`🔍 Debug pour ${member.name} (${memberTag}):`);
        console.log('  - clanMembers.comments:', member.comments);
        console.log('  - clanMembers.participations:', member.participations);
        
        const localData = localStorage.getItem(`memberData_${memberTag}`);
        if (localData) {
            const parsed = JSON.parse(localData);
            console.log('  - localStorage comment:', parsed.comment);
            console.log('  - localStorage participations:', parsed.participations);
        }
    } else {
        console.log('❌ Membre non trouvé:', memberTag);
    }
}

// Instructions d'utilisation
console.log('📋 Instructions de debug:');
console.log('1. debugClanMembers() - Affiche tous les membres');
console.log('2. debugSpecificMember("TAG") - Affiche un membre spécifique (sans #)');
console.log('3. Modifiez un commentaire/participation');
console.log('4. Relancez debugSpecificMember("TAG") pour voir si les données sont mises à jour');
console.log('');
console.log('💡 Exemple: debugSpecificMember("22QU902G0")');
