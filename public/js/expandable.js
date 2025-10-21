/* ===== GESTION DES ZONES DÉROULANTES ===== */

// Variable globale pour suivre le membre actuellement ouvert
let currentlyOpenMember = null;

// Gestionnaire principal pour les clics dans le tableau
function handleTableClick(event) {
    const target = event.target;
    
    // Clic sur le bouton d'expansion (desktop ou mobile)
    if (target.classList.contains('expand-btn') || target.closest('.expand-btn') || 
        target.classList.contains('expand-btn-mobile') || target.closest('.expand-btn-mobile')) {
        const btn = target.classList.contains('expand-btn') ? target : 
                   target.classList.contains('expand-btn-mobile') ? target :
                   target.closest('.expand-btn') || target.closest('.expand-btn-mobile');
        const memberId = btn.getAttribute('data-member-id');
        toggleMemberDetails(memberId);
        event.preventDefault();
        return;
    }
    
    // Clic sur le bouton Sauvegarder
    if (target.classList.contains('save-btn')) {
        const memberId = target.getAttribute('data-member-id');
        saveMemberDataExpandable(memberId);
        event.preventDefault();
        return;
    }
    
    // Clic sur le bouton Annuler
    if (target.classList.contains('cancel-btn')) {
        const memberId = target.getAttribute('data-member-id');
        cancelMemberData(memberId);
        event.preventDefault();
        return;
    }
}

// Fonction pour basculer l'affichage des détails d'un membre
function toggleMemberDetails(memberId) {
    const expandRow = document.getElementById(`${memberId}-details`);
    const expandBtn = document.querySelector(`[data-member-id="${memberId}"]`);
    
    if (!expandRow || !expandBtn) return;
    
    const isCurrentlyOpen = expandRow.classList.contains('expanded');
    
    // Fermer la zone actuellement ouverte si différente
    if (currentlyOpenMember && currentlyOpenMember !== memberId) {
        closeMemberDetails(currentlyOpenMember);
    }
    
    if (isCurrentlyOpen) {
        closeMemberDetails(memberId);
    } else {
        openMemberDetails(memberId);
    }
}

// Fonction pour ouvrir les détails d'un membre
function openMemberDetails(memberId) {
    const expandRow = document.getElementById(`${memberId}-details`);
    const expandBtn = document.querySelector(`[data-member-id="${memberId}"]`);
    
    if (!expandRow || !expandBtn) return;
    
    // Charger les données sauvegardées
    loadMemberData(memberId);
    
    // Charger les données détaillées du joueur
    loadPlayerDetailedData(memberId);
    
    // Animation d'ouverture
    expandRow.classList.remove('hidden');
    expandRow.style.display = 'table-row'; // S'assurer que la ligne est visible
    expandRow.classList.add('expanding');
    expandBtn.setAttribute('aria-expanded', 'true');
    
    // Mettre à jour le suivi
    currentlyOpenMember = memberId;
    
    // Nettoyer les classes d'animation après la fin
    setTimeout(() => {
        expandRow.classList.remove('expanding');
        expandRow.classList.add('expanded');
    }, 300);
}

// Fonction pour charger les données détaillées d'un joueur
async function loadPlayerDetailedData(memberId) {
    try {
        // Trouver le membre correspondant
        const member = clanMembers.find(m => `member-${m.tag.replace('#', '')}` === memberId);
        if (!member) {
            console.error('Membre non trouvé pour l\'ID:', memberId);
            return;
        }
        
        // Récupérer le tag du clan
        const clanTag = clanTagInput.value.trim();
        if (!clanTag) {
            console.error('Tag du clan non disponible');
            return;
        }
        
        // Récupérer les données détaillées
        const detailedData = await fetchPlayerDetailedData(member.tag, clanTag);
        
        // Attendre un peu pour s'assurer que le DOM est prêt
        setTimeout(() => {
            updatePlayerDetailedUI(memberId, detailedData);
        }, 100);
        
    } catch (error) {
        console.error('Erreur lors du chargement des données détaillées:', error);
        updatePlayerDetailedUIWithError(memberId);
    }
}

// Fonction pour mettre à jour l'interface avec les données détaillées
function updatePlayerDetailedUI(memberId, data) {
    // Niveaux des héros
    const kingElement = document.getElementById(`${memberId}-king-level`);
    const queenElement = document.getElementById(`${memberId}-queen-level`);
    const princeElement = document.getElementById(`${memberId}-prince-level`);
    const wardenElement = document.getElementById(`${memberId}-warden-level`);
    const championElement = document.getElementById(`${memberId}-champion-level`);
    
    if (kingElement) {
        kingElement.textContent = data.heroLevels.roi || 'Non débloqué';
    }
    
    if (queenElement) {
        queenElement.textContent = data.heroLevels.reine || 'Non débloqué';
    }

    if (princeElement) {
        princeElement.textContent = data.heroLevels.prince || 'Non débloqué';
    }
    
    if (wardenElement) {
        wardenElement.textContent = data.heroLevels.gardien || 'Non débloqué';
    }
    
    if (championElement) {
        championElement.textContent = data.heroLevels.championne || 'Non débloqué';
    }

    // Niveau de la ville
    const townHallElement = document.getElementById(`${memberId}-town-hall-level`);
    if (townHallElement) {
        townHallElement.textContent = data.townHallLevel;
    }

    const clanCapitalContributionsElement = document.getElementById(`${memberId}-clan-capital-contributions`);
    if (clanCapitalContributionsElement) {
        clanCapitalContributionsElement.textContent = data.clanCapitalContributions.toLocaleString('fr-FR');
    }

    
    // Rôle en guerre
    const warRoleElement = document.getElementById(`${memberId}-war-role`);
    if (warRoleElement) {
        warRoleElement.textContent = data.warStats.warRole;
    }
    
    // Attaques GDC
    const gdcAttacks = `${data.warStats.attacksWon} / ${data.warStats.attacksLost || 0}`;
    const gdcElement = document.getElementById(`${memberId}-gdc-attacks`);
    if (gdcElement) {
        gdcElement.textContent = gdcAttacks;
    }
    
    // Étoiles totales
    const starsElement = document.getElementById(`${memberId}-total-stars`);
    if (starsElement) {
        starsElement.textContent = data.warStats.totalStars;
    }

    const warPreferenceElement = document.getElementById(`${memberId}-war-preference`);
    if (warPreferenceElement) {
    warPreferenceElement.textContent = data.warPreference === 'in' ? 'Oui' : 'Non';
    warPreferenceElement.classList.add(
        data.warPreference === 'in' ? 'green-text' : 'red-text'
    );
}


    // Nombre total d'étoiles de guerre du joueur
    const warStarsElement = document.getElementById(`${memberId}-war-stars`);
    if (warStarsElement) {
        warStarsElement.textContent = data.warStars;
    }
    
    // Nombre d'attaque gagnées et de défense gagnées
    const attackWinsElement = document.getElementById(`${memberId}-attack-wins`);
    if (attackWinsElement) {
        attackWinsElement.textContent = data.attackWins;
    }
    const defenseWinsElement = document.getElementById(`${memberId}-defense-wins`);
    if (defenseWinsElement) {
        defenseWinsElement.textContent = data.defenseWins;
    }
    
    // Date d'entrée
    const joinDateElement = document.getElementById(`${memberId}-join-date`);
    if (joinDateElement) {
        joinDateElement.textContent = data.joinDate;
    }
    
    // Trophées saison précédente
    const prevTrophiesElement = document.getElementById(`${memberId}-prev-trophies`);
    const prevBuilderTrophiesElement = document.getElementById(`${memberId}-prev-builder-trophies`);
    if (prevTrophiesElement) {
        prevTrophiesElement.textContent = data.previousSeasonTrophies;
    }
    if (prevBuilderTrophiesElement) {
        prevBuilderTrophiesElement.textContent = data.previousBuilderSeasonTrophies;
    }
    
    // Ratio Dons/Récep troupes
    const donationRatioElement = document.getElementById(`${memberId}-donation-ratio`);
    if (donationRatioElement) {
        // Récupérer les données du membre depuis le tableau
        const memberRow = document.getElementById(memberId);
        if (memberRow) {
            const memberData = clanMembers.find(m => `member-${m.tag.replace('#', '')}` === memberId);
            if (memberData) {
                const donations = Math.max(0, Number(memberData.donations) || 0);
                const donationsReceived = Math.max(0, Number(memberData.donationsReceived) || 0);
                const ratioText = `${donations}/${donationsReceived}`;
                
                donationRatioElement.textContent = ratioText;
                
                // Appliquer la couleur selon la logique existante
                const ratio = donations > 0 ? (donationsReceived / donations) * 100 : 0;
                const colorClass = (donations === 0 && donationsReceived > 0) || ratio >= 120
                    ? 'red-text'
                    : 'green-text';
                
                donationRatioElement.className = `detail-value ${colorClass}`;
            }
        }
    }
    
    // Type de joueur
    const playerTypeElement = document.getElementById(`${memberId}-player-type`);
    if (playerTypeElement) {
        playerTypeElement.textContent = data.playerType;
        playerTypeElement.className = `detail-value player-type ${data.playerType.toLowerCase()}`;
    }
}

// Fonction pour afficher les erreurs dans l'interface
function updatePlayerDetailedUIWithError(memberId) {
    const errorMessage = 'Erreur de chargement';
    
    document.getElementById(`${memberId}-king-level`).textContent = errorMessage;
    document.getElementById(`${memberId}-queen-level`).textContent = errorMessage;
    document.getElementById(`${memberId}-prince-level`).textContent = errorMessage;
    document.getElementById(`${memberId}-warden-level`).textContent = errorMessage;
    document.getElementById(`${memberId}-champion-level`).textContent = errorMessage;
    document.getElementById(`${memberId}-town-hall-level`).textContent = errorMessage;
    document.getElementById(`${memberId}-clan-capital-contributions`).textContent = errorMessage;
    document.getElementById(`${memberId}-donation-ratio`).textContent = errorMessage;
    document.getElementById(`${memberId}-war-preference`).textContent = errorMessage;
    document.getElementById(`${memberId}-war-stars`).textContent = errorMessage;
    document.getElementById(`${memberId}-gdc-attacks`).textContent = errorMessage;
    document.getElementById(`${memberId}-total-stars`).textContent = errorMessage;
    document.getElementById(`${memberId}-attack-wins`).textContent = errorMessage;
    document.getElementById(`${memberId}-defense-wins`).textContent = errorMessage;
    document.getElementById(`${memberId}-player-type`).textContent = errorMessage;
}

// Fonction pour fermer les détails d'un membre
function closeMemberDetails(memberId) {
    const expandRow = document.getElementById(`${memberId}-details`);
    const expandBtn = document.querySelector(`[data-member-id="${memberId}"]`);
    
    if (!expandRow || !expandBtn) return;
    
    // Animation de fermeture
    expandRow.classList.remove('expanded');
    expandRow.classList.add('collapsing');
    expandBtn.setAttribute('aria-expanded', 'false');
    
    // Masquer après l'animation
    setTimeout(() => {
        expandRow.classList.add('hidden');
        expandRow.style.display = 'none'; // S'assurer que la ligne est cachée
        expandRow.classList.remove('collapsing');
    }, 300);
    
    // Mettre à jour le suivi
    if (currentlyOpenMember === memberId) {
        currentlyOpenMember = null;
    }
}

// Fonction pour sauvegarder les données d'un membre (expandable)
function saveMemberDataExpandable(memberId) {
    const commentTextarea = document.getElementById(`${memberId}-comment`);
    const gdcCheckbox = document.getElementById(`${memberId}-gdc`);
    const jdcCheckbox = document.getElementById(`${memberId}-jdc`);
    const leagueCheckbox = document.getElementById(`${memberId}-league`);
    const raidsCheckbox = document.getElementById(`${memberId}-raids`);
    
    if (!commentTextarea) return;
    
    const data = {
        comment: commentTextarea.value.trim(),
        participations: {
            gdc: gdcCheckbox ? gdcCheckbox.checked : false,
            jdc: jdcCheckbox ? jdcCheckbox.checked : false,
            league: leagueCheckbox ? leagueCheckbox.checked : false,
            raids: raidsCheckbox ? raidsCheckbox.checked : false
        }
    };
    
    // Sauvegarder dans localStorage
    localStorage.setItem(`memberData_${memberId}`, JSON.stringify(data));
    
    // Afficher le message de succès
    showStatusMessage('Données sauvegardées avec succès', 'success');
    
    // Fermer la zone déroulante
    closeMemberDetails(memberId);
    
    // Rafraîchir l'affichage du tableau pour mettre à jour les aperçus
    if (typeof displayMembers === 'function') {
        displayMembers();
    }
}

// Fonction pour annuler les modifications
function cancelMemberData(memberId) {
    // Recharger les données sauvegardées
    loadMemberData(memberId);
    
    // Fermer la zone déroulante
    closeMemberDetails(memberId);
}

// Fonction pour charger les données sauvegardées d'un membre
function loadMemberData(memberId) {
    const savedData = getMemberSavedData(memberId);
    
    const commentTextarea = document.getElementById(`${memberId}-comment`);
    const gdcCheckbox = document.getElementById(`${memberId}-gdc`);
    const jdcCheckbox = document.getElementById(`${memberId}-jdc`);
    const leagueCheckbox = document.getElementById(`${memberId}-league`);
    const raidsCheckbox = document.getElementById(`${memberId}-raids`);
    
    if (commentTextarea) commentTextarea.value = savedData.comment || '';
    if (gdcCheckbox) gdcCheckbox.checked = savedData.participations?.gdc || false;
    if (jdcCheckbox) jdcCheckbox.checked = savedData.participations?.jdc || false;
    if (leagueCheckbox) leagueCheckbox.checked = savedData.participations?.league || false;
    if (raidsCheckbox) raidsCheckbox.checked = savedData.participations?.raids || false;
}




