# CatBreakers - Gestionnaire de Clan Clash of Clans

Une application web moderne pour gérer votre clan Clash of Clans avec synchronisation des données et interface intuitive.

## 🏗️ Structure du Projet

```
/project-root
├── /public           ← Frontend (HTML, CSS, JS, PWA)
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── Assets/
├── /server           ← Backend Node/Express
│   ├── server.js
│   ├── routes/
│   │   ├── clans.js
│   │   ├── players.js
│   │   └── clan.js
│   ├── data/
│   └── package.json
├── package.json      ← Configuration racine
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js >= 14.0.0
- Token API Supercell (optionnel)

### Installation
```bash
# Cloner le projet
git clone https://github.com/tony/catbreakers.git
cd catbreakers

# Installer les dépendances du serveur
cd server
npm install
cd ..

# Installer les dépendances racine
npm install
```

### Configuration
1. Créer un fichier `.env` dans le dossier `/server/` :
```env
PORT=3000
CLASH_API_TOKEN=your_api_token_here
API_BASE_URL=https://api.clashofclans.com/v1
DATA_FILE=./data/members.json
```

2. Obtenir un token API Supercell :
   - Aller sur https://developer.clashofclans.com/
   - Créer un compte développeur
   - Créer une nouvelle application
   - Copier le token généré

### Démarrage
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

L'application sera accessible sur http://localhost:3000

## 📊 Fonctionnalités

### Frontend (PWA)
- Interface responsive et moderne
- Mode hors ligne
- Synchronisation automatique des données
- Gestion des membres avec données supplémentaires
- Export/Import des données

### Backend (API REST + Proxy)
- Proxy pour l'API Supercell
- Stockage local des données supplémentaires
- Synchronisation des données entre clients
- API REST pour la gestion des clans

## 🔧 API Endpoints

### Proxy Supercell
- `GET /api/clans/:clanTag` - Données du clan
- `GET /api/players/:playerTag` - Données du joueur
- `GET /api/clans/:clanTag/currentwar` - Guerre actuelle
- `GET /api/clans/:clanTag/currentwar/leaguegroup` - Guerre de ligue

### Données Supplémentaires
- `GET /api/clan/:clanTag/members` - Récupérer données supplémentaires
- `POST /api/clan/:clanTag/members` - Sauvegarder données supplémentaires
- `POST /api/clan/:clanTag/member/:memberTag` - Sauvegarder un membre

## 🛠️ Technologies Utilisées

### Frontend
- HTML5, CSS3, JavaScript ES6+
- PWA (Progressive Web App)
- Local Storage API
- Fetch API

### Backend
- Node.js
- Express.js
- CORS
- dotenv
- node-fetch

## 📝 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.