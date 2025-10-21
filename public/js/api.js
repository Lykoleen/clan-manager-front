/* ===== GESTION DE L'API SUPERCELL ===== */

// Variable globale pour stocker les membres du clan
let clanMembers = [];

// Variables globales pour les éléments DOM
let clanTagInput;
let refreshBtn;
let membersTableBody;

// Variable pour stocker le tag du clan actuel
let currentClanTag = null;

// Fonction pour mettre à jour le titre du clan
function updateClanTitle(clanData) {
    try {
        if (!clanData || !clanData.name) {
            console.warn('Nom du clan manquant');
            return;
        }

        const title = document.querySelector('h1');
        
        if (!title) {
            console.warn('Élément h1 non trouvé dans le DOM');
            return;
        }

        title.textContent = clanData.name;
        console.log('Titre du clan mis à jour:', clanData.name);
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour du titre:', error);
    }
}

// Fonction pour mettre à jour le badge du clan
function updateClanBadge(clanData) {
    try {
        if (!clanData || !clanData.badgeUrls || !clanData.badgeUrls.medium) {
            console.warn('Données de badge manquantes');
            return;
        }

        const badgeURL = clanData.badgeUrls.medium;
        const badge = document.querySelector('.header-badge');
        
        if (!badge) {
            console.warn('Élément .header-badge non trouvé dans le DOM');
            return;
        }

        // Appliquer les styles au badge
        badge.style.backgroundImage = `url(${badgeURL})`;
        badge.style.backgroundSize = 'cover';
        badge.style.backgroundPosition = 'center';
        badge.style.backgroundRepeat = 'no-repeat';
        badge.style.display = 'block';
        
        console.log('Badge du clan mis à jour:', badgeURL);
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour du badge:', error);
    }
}

// Fonction pour récupérer les données du clan via le serveur proxy
async function fetchClanData(clanTag) {
    try {
        // Nettoyer le tag du clan (enlever le # s'il y en a un)
        const cleanTag = clanTag.replace('#', '');
        
        // Utiliser le serveur proxy au lieu de l'API Supercell directement
        const response = await fetch(`http://localhost:3000/api/clans/${cleanTag}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erreur API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // Mettre à jour le titre et le badge du clan
        updateClanTitle(data);
        updateClanBadge(data);

        return data;

        
    } catch (error) {
        console.error('Erreur lors de la récupération des données du clan:', error);
        showStatusMessage(`Erreur API: ${error.message}`, 'error');
        throw error;
    }
}

// Fonction pour récupérer les données détaillées d'un joueur
async function fetchPlayerData(playerTag) {
    try {
        // Nettoyer le tag du joueur (enlever le # s'il y en a un)
        const cleanTag = playerTag.replace('#', '');
        
        // Utiliser le serveur proxy au lieu de l'API Supercell directement
        const response = await fetch(`http://localhost:3000/api/players/${cleanTag}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erreur API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données du joueur:', error);
        throw error;
    }
}

// Fonction pour récupérer les données de guerre du clan
async function fetchWarData(clanTag) {
    try {
        // Nettoyer le tag du clan (enlever le # s'il y en a un)
        const cleanTag = clanTag.replace('#', '');
        
        // Utiliser le serveur proxy au lieu de l'API Supercell directement
        const response = await fetch(`http://localhost:3000/api/clans/${cleanTag}/currentwar`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erreur API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de guerre:', error);
        throw error;
    }
}

// Fonction pour récupérer les données de guerre de ligue du clan
async function fetchLeagueGroupData(clanTag) {
    try {
        // Nettoyer le tag du clan (enlever le # s'il y en a un)
        const cleanTag = clanTag.replace('#', '');
        
        // Utiliser le serveur proxy au lieu de l'API Supercell directement
        const response = await fetch(`http://localhost:3000/api/clans/${cleanTag}/currentwar/leaguegroup`);

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de ligue:', error);
        throw error;
    }
}
// Fonction pour calculer le type de joueur dominant (donneur/receveur/hybride)
function calculatePlayerType(donations, donationsReceived) {
    if (donations === 0 && donationsReceived === 0) return 'Inactif';
    
    const ratio = donationsReceived / (donations || 1);
    
    if (ratio <= 0.5) return 'Donneur';
    if (ratio >= 2) return 'Receveur';
    return 'Hybride';
}

// Fonction pour formater la date d'entrée dans le clan
function formatClanJoinDate(joinDate) {
    if (!joinDate) return 'Non disponible';
    
    const date = new Date(joinDate);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Fonction pour récupérer toutes les données détaillées d'un joueur
async function fetchPlayerDetailedData(playerTag, clanTag) {
    try {
        // Récupérer les données du joueur
        const playerData = await fetchPlayerData(playerTag);
        
        // Récupérer les données de guerre si disponibles
        let warData = null;
        let leagueData = null;
        
        try {
            warData = await fetchWarData(clanTag);
        } catch (error) {
            // Pas de guerre en cours ou erreur - normal
        }
        
        try {
            leagueData = await fetchLeagueGroupData(clanTag);
        } catch (error) {
            // Pas de guerre de ligue ou erreur - normal
        }
        
        // Traiter les données des héros
        const heroes = playerData.heroes || [];
        const heroLevels = {
            roi: heroes.find(h => h.name === 'Barbarian King')?.level || 0,
            reine: heroes.find(h => h.name === 'Archer Queen')?.level || 0,
            gardien: heroes.find(h => h.name === 'Grand Warden')?.level || 0,
            championne: heroes.find(h => h.name === 'Royal Champion')?.level || 0,
            prince: heroes.find(h => h.name === 'Minion Prince')?.level || 0
        };
        
        // Calculer les statistiques de guerre
        let warStats = {
            attacksWon: 0,
            attacksLost: 0,
            totalStars: 0,
            warRole: 'Non défini'
        };
        
        if (warData && warData.state === 'inWar') {
            const memberInWar = warData.clan.members.find(m => m.tag === playerTag);
            if (memberInWar) {
                warStats.attacksWon = memberInWar.attacks?.length || 0;
                warStats.totalStars = memberInWar.attacks?.reduce((sum, attack) => sum + attack.stars, 0) || 0;
                warStats.warRole = memberInWar.attacks?.length > 0 ? 'Attaquant actif' : 'Non attaquant';
            }
        }

        // Nombre totale d'étoiles de guerre du joueur 
        const warStars = playerData.warStars || 0;
        
        // Calculer le type de joueur
        const playerType = calculatePlayerType(
            playerData.donations || 0,
            playerData.donationsReceived || 0
        );

        // Préférence de guerre
        const warPreference = playerData.warPreference || 'Non défini';
        
        return {
            warStars,
            warPreference,
            heroLevels,
            warStats,
            playerType,
            joinDate: formatClanJoinDate(playerData.clan?.joinDate),
            attackWins: playerData.attackWins || 0,
            defenseWins: playerData.defenseWins || 0,
            bestTrophies: playerData.bestTrophies || 0,
            previousSeasonTrophies: playerData.previousSeasonTrophies || 0,
            previousBuilderSeasonTrophies: playerData.previousBuilderSeasonTrophies || 0,
            builderHallLevel: playerData.builderHallLevel || 0,
            townHallLevel: playerData.townHallLevel || 0,
            clanCapitalContributions: playerData.clanCapitalContributions || 0
        };
        
    } catch (error) {
        console.error('Erreur lors de la récupération des données détaillées:', error);
        throw error;
    }
}

// Fonction pour rafraîchir les données du clan
async function refreshClanData() {
    const clanTag = clanTagInput.value.trim();
    
    if (!clanTag) {
        showStatusMessage('Veuillez entrer le tag du clan', 'warning');
        return;
    }

    try {
        refreshBtn.textContent = 'Chargement...';
        refreshBtn.disabled = true;

        // Mettre à jour le tag du clan actuel
        currentClanTag = clanTag;

        const clanData = await fetchClanData(clanTag);
        
        // Mettre à jour les membres avec les données de l'API Supercell
        clanMembers = clanData.memberList.map(member => ({
            name: member.name,
            tag: member.tag,
            level: member.expLevel,
            trophies: member.trophies,
            role: member.role,
            donations: member.donations || 0,
            donationsReceived: member.donationsReceived || 0,
            isFromAPI: true
        }));

        // Charger les données supplémentaires depuis le serveur
        const additionalData = await loadClanAdditionalData(clanTag);
        
        // Fusionner les données Supercell avec les données supplémentaires
        clanMembers = clanMembers.map(member => {
            const cleanTag = member.tag.replace('#', '');
            const additionalMemberData = additionalData.members[cleanTag] || {};
            
            return {
                ...member,
                // Données supplémentaires
                comments: additionalMemberData.comments || '',
                participations: additionalMemberData.participations || {
                    gdc: false,
                    jdc: false,
                    league: false,
                    raids: false
                },
                // Métadonnées
                firstAdded: additionalMemberData.firstAdded,
                lastUpdated: additionalMemberData.lastUpdated
            };
        });

        // Sauvegarder les données de base en local
        saveMembersToStorage();
        
        // Mettre à jour l'affichage
        if (typeof displayMembers === 'function') {
            displayMembers();
        } else {
            console.warn('Fonction displayMembers non disponible');
        }
        
        showStatusMessage(`${clanMembers.length} membres chargés depuis l'API Supercell`, 'success');
        
    } catch (error) {
        console.error('Erreur API Supercell:', error);
        showStatusMessage(`Erreur lors du rafraîchissement: ${error.message}`, 'error');
    } finally {
        refreshBtn.textContent = 'Rafraîchir';
        refreshBtn.disabled = false;
    }
}






