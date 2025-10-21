/* ===== GESTION DE LA RECHERCHE ===== */

// Variables globales pour la recherche
let searchTimeout = null;
let filteredMembers = [];
let isSearchActive = false;

// Fonction pour initialiser la recherche
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResultsInfo = document.getElementById('searchResultsInfo');
    
    if (!searchInput) return;
    
    // Écouter les événements de saisie
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);
    
    // Initialiser l'état
    filteredMembers = [...clanMembers];
    updateSearchResultsInfo();
}

// Fonction pour gérer la saisie dans la barre de recherche
function handleSearchInput(event) {
    const query = event.target.value.trim().toLowerCase();
    
    // Annuler le timeout précédent
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Délai pour éviter trop de recherches pendant la saisie
    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, 150);
}

// Fonction pour gérer les touches spéciales
function handleSearchKeydown(event) {
    if (event.key === 'Escape') {
        clearSearch();
    }
}

// Fonction pour effectuer la recherche
function performSearch(query) {
    if (!query) {
        clearSearch();
        return;
    }
    
    isSearchActive = true;
    
    // Filtrer les membres selon différents critères
    filteredMembers = clanMembers.filter(member => {
        const name = member.name.toLowerCase();
        const tag = member.tag.toLowerCase();
        const role = getRoleDisplayName(member.role).toLowerCase();
        
        // Recherche dans le nom, tag, ou rôle
        return name.includes(query) || 
               tag.includes(query) || 
               role.includes(query);
    });
    
    // Mettre à jour l'affichage
    displayFilteredMembers();
    updateSearchResultsInfo();
}

// Fonction pour effacer la recherche
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResultsInfo = document.getElementById('searchResultsInfo');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    isSearchActive = false;
    filteredMembers = [...clanMembers];
    
    // Fermer toutes les zones déroulantes ouvertes
    if (currentlyOpenMember) {
        closeMemberDetails(currentlyOpenMember);
        currentlyOpenMember = null;
    }
    
    // Mettre à jour l'affichage
    displayMembers();
    updateSearchResultsInfo();
}

// Fonction pour afficher les membres filtrés
function displayFilteredMembers() {
    const membersTableBody = document.getElementById('membersTableBody');
    if (!membersTableBody) return;
    
    // Fermer toute zone déroulante actuellement ouverte
    if (currentlyOpenMember) {
        closeMemberDetails(currentlyOpenMember);
        currentlyOpenMember = null;
    }
    
    membersTableBody.innerHTML = '';
    
    if (filteredMembers.length === 0) {
        membersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Aucun membre trouvé</td></tr>';
        return;
    }

    filteredMembers.forEach((member, index) => {
        const row = document.createElement('tr');
        
        // Créer un ID unique pour le membre
        const memberId = `member-${member.tag.replace('#', '')}`;
        
        // Récupérer les données sauvegardées pour ce membre
        const savedData = getMemberSavedData(memberId);
        
        row.innerHTML = generateMemberRowHTML(member, memberId, savedData);
        
        // Ajouter l'ID au membre pour référence
        row.id = memberId;
        row.classList.add('member-row');
        
        membersTableBody.appendChild(row);
        
        // Créer la ligne déroulante avec toutes les données de l'API
        const expandRow = document.createElement('tr');
        expandRow.id = `${memberId}-details`;
        expandRow.classList.add('expand-row', 'hidden');
        expandRow.style.display = 'none'; // S'assurer que la ligne est cachée
        
        expandRow.innerHTML = generateExpandRowHTML(member, memberId, savedData);
        
        membersTableBody.appendChild(expandRow);
    });
}

// Fonction pour mettre à jour les informations de résultats
function updateSearchResultsInfo() {
    const searchResultsInfo = document.getElementById('searchResultsInfo');
    if (!searchResultsInfo) return;
    
    if (isSearchActive) {
        const totalMembers = clanMembers.length;
        const filteredCount = filteredMembers.length;
        
        if (filteredCount === 0) {
            searchResultsInfo.innerHTML = '<span class="no-results">Aucun résultat trouvé</span>';
        } else if (filteredCount === totalMembers) {
            searchResultsInfo.innerHTML = `<span class="all-results">Tous les membres (${totalMembers})</span>`;
        } else {
            searchResultsInfo.innerHTML = `<span class="filtered-results">${filteredCount} résultat(s) sur ${totalMembers} membres</span>`;
        }
    } else {
        searchResultsInfo.innerHTML = '';
    }
}

// Fonction pour obtenir les membres actuellement affichés (pour compatibilité)
function getCurrentDisplayedMembers() {
    return isSearchActive ? filteredMembers : clanMembers;
}
