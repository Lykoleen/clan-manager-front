/* ===== GESTION DU TABLEAU ET AFFICHAGE ===== */

// Fonction pour obtenir le nom d'affichage du rôle
function getRoleDisplayName(role) {
    const roleNames = {
        'member': 'Membre',
        'elder': 'Ainé',
        'admin': 'Ainé',
        'coLeader': 'Chef-adjoint',
        'leader': 'Chef'
    };
    return roleNames[role] || role;
}

// Fonction pour récupérer les données sauvegardées d'un membre
function getMemberSavedData(memberId) {
    // D'abord essayer de récupérer depuis les données fusionnées du membre
    const member = clanMembers.find(m => m.tag === memberId);
    if (member && (member.comments || member.participations)) {
        return {
            comment: member.comments || '',
            participations: member.participations || {}
        };
    }
    
    // Fallback vers localStorage si pas de données fusionnées
    const savedData = localStorage.getItem(`memberData_${memberId}`);
    return savedData ? JSON.parse(savedData) : { comment: '', participations: {} };
}

// Fonction pour sauvegarder les données d'un membre (table)
function saveMemberDataTable(memberId, data) {
    // Sauvegarder en local pour l'affichage immédiat
    localStorage.setItem(`memberData_${memberId}`, JSON.stringify(data));
    
    // Trouver le membre correspondant pour récupérer son tag
    const member = clanMembers.find(m => m.tag === memberId);
    if (member) {
        // Sauvegarder les données supplémentaires sur le serveur
        saveMemberAdditionalData(memberId, {
            name: member.name,
            comment: data.comment || '',
            participations: data.participations || {}
        });
    }
}

// Fonction pour générer l'aperçu des participations
function generateParticipationsPreview(participations) {
    if (!participations) return '';
    
    const activeParticipations = [];
    if (participations.gdc) activeParticipations.push('GDC');
    if (participations.jdc) activeParticipations.push('JDC');
    if (participations.league) activeParticipations.push('League');
    if (participations.raids) activeParticipations.push('Raids');
    
    return activeParticipations.length > 0 ? activeParticipations.join(', ') : '';
}

// Fonction pour générer le HTML d'une ligne de membre (réutilisable)
function generateMemberRowHTML(member, memberId, savedData) {
    return `
        <td class="expand-cell d-none d-md-table-cell">
            <button class="expand-btn" 
                    data-member-id="${memberId}" 
                    aria-expanded="false" 
                    aria-label="Ouvrir les détails pour ${member.name}"
                    title="Cliquer pour voir les détails">
                <span class="arrow-icon">▶</span>
            </button>
        </td>
        <td>${member.name}</td>
        <td class="d-none d-sm-table-cell">${member.level}</td>
        <td class="d-none d-md-table-cell">${getRoleDisplayName(member.role)}</td>
        <td class="comment-cell d-none d-lg-table-cell">
            <div class="comment-preview">${savedData.comment || ''}</div>
        </td>
        <td class="participations-cell d-none d-xl-table-cell">
            <div class="participations-preview">
                ${generateParticipationsPreview(savedData.participations)}
            </div>
        </td>
        <td class="d-md-none text-end">
            <button class="btn btn-sm btn-outline-primary expand-btn-mobile" 
                    data-member-id="${memberId}" 
                    aria-expanded="false" 
                    aria-label="Ouvrir les détails pour ${member.name}"
                    title="Cliquer pour voir les détails">
                <span class="arrow-icon">▶</span>
            </button>
        </td>
    `;
}

// Fonction pour générer le HTML d'une ligne déroulante (réutilisable)
function generateExpandRowHTML(member, memberId, savedData) {
    return `
        <td colspan="7" class="expand-content">
            <div class="expand-container">
                <div class="d-flex flex-column-reverse flex-xl-row member-details-grid gap-3 p-2">
                    <div class="detail-section d-grid gap-2">
                        <h3>Informations Générales</h3>
                        <div class="detail-item">
                            <span class="detail-label">Tag:</span>
                            <span class="detail-value">${member.tag}</span>
                        </div>
                        <div class="detail-item hero-levels-container">
                            <span class="detail-label">Niveau des héros:</span>
                            <div class="hero-levels">
                                <div class="hero-item">
                                    <img src="Assets/Roi.png" alt="Roi" class="hero-icon">
                                    <span class="hero-level" id="${memberId}-king-level">Chargement...</span>
                                </div>
                                <div class="hero-item">
                                    <img src="Assets/Reine.png" alt="Reine" class="hero-icon">
                                    <span class="hero-level" id="${memberId}-queen-level">Chargement...</span>
                                </div>
                                <div class="hero-item">
                                    <img src="Assets/Prince.webp" alt="Prince" class="hero-icon">
                                    <span class="hero-level" id="${memberId}-prince-level">Chargement...</span>
                                </div>
                                <div class="hero-item">
                                    <img src="Assets/Gardien.png" alt="Gardien" class="hero-icon">
                                    <span class="hero-level" id="${memberId}-warden-level">Chargement...</span>
                                </div>
                                <div class="hero-item">
                                    <img src="Assets/Championne.png" alt="Championne" class="hero-icon">
                                    <span class="hero-level" id="${memberId}-champion-level">Chargement...</span>
                                </div>
                            </div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Souhaite participer aux GDC:</span>
                            <span id="${memberId}-war-preference">Chargement...</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">HDV:</span>
                            <span class="detail-value" id="${memberId}-town-hall-level">Chargement...</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Etoiles de guerre:</span>
                            <span class="detail-value" id="${memberId}-war-stars">Chargement...</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Attaques remportées:</span>
                            <span class="detail-value" id="${memberId}-attack-wins">Chargement...</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Défenses remportées:</span>
                            <span class="detail-value" id="${memberId}-defense-wins">Chargement...</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Contributions à la capitale:</span>
                            <span class="detail-value" id="${memberId}-clan-capital-contributions">Chargement...</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Ratio Dons/Récep troupes:</span>
                            <span class="detail-value" id="${memberId}-donation-ratio">Chargement...</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Type de joueur:</span>
                            <span class="detail-value player-type" id="${memberId}-player-type">Chargement...</span>
                        </div>
                    </div>
                    
                    <div class="detail-section col-xl-6">
                        <h3>Gestion</h3>
                        <div class="form-group">
                            <label for="${memberId}-comment">Commentaires :</label>
                            <textarea id="${memberId}-comment" 
                                      class="comment-textarea" 
                                      rows="4" 
                                      placeholder="Ajouter un commentaire sur ce membre..."
                                      aria-label="Commentaire pour ${member.name}">${savedData.comment || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Participations :</label>
                            <div class="participations-checkboxes">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="${memberId}-gdc" ${savedData.participations?.gdc ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                    GDC
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="${memberId}-jdc" ${savedData.participations?.jdc ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                    JDC
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="${memberId}-league" ${savedData.participations?.league ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                    League
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="${memberId}-raids" ${savedData.participations?.raids ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                    Raids
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="expand-actions">
                    <button class="save-btn" data-member-id="${memberId}">Sauvegarder</button>
                    <button class="cancel-btn" data-member-id="${memberId}">Annuler</button>
                </div>
            </div>
        </td>
    `;
}

// Fonction pour afficher les membres dans le tableau (version originale pour compatibilité)
function displayMembers() {
    // Si une recherche est active, utiliser la fonction de recherche
    if (isSearchActive) {
        displayFilteredMembers();
        return;
    }
    
    membersTableBody.innerHTML = '';
    
    if (clanMembers.length === 0) {
        membersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Aucun membre trouvé</td></tr>';
        return;
    }

    clanMembers.forEach((member, index) => {
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




