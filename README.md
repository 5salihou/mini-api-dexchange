# DEXCHANGE – Mini API de Transferts

API NestJS simulant un service de transfert d’argent avec :

- Authentification par **API Key**
- Gestion des **états de transfert**
- Calcul automatique des **frais**
- **Pagination** et **filtres**
- **Swagger** + tests Jest

---

## 🚀 Installation & Lancement

```bash
# Cloner le repo
git clone https://github.com/username/dexchange-mini-api.git
cd dexchange-mini-api

# Installer les dépendances
npm install

# Démarrer Postgres avec Docker
docker-compose up

# Lancer la migration Prisma
npx prisma migrate dev

# Démarrer l’API
npm run start:dev

```

## Swagger disponible sur

```bash

👉 http://localhost:3000/docs

```

## 🔐 Authentification

```bash

Toutes les routes requièrent un header :

x-api-key: 1234567890-DEXCHANGE

```

## 🧱 Endpoints principaux

```bash

1️⃣ Créer un transfert
POST /transfers

Body :

{
  "amount": 12500,
  "currency": "XOF",
  "channel": "WAVE",
  "recipient": { "phone": "+221770000000", "name": "Jane Doe" },
  "metadata": { "orderId": "ABC-123" }
}

2️⃣ Lister les transferts
GET /transfers?status=PENDING&limit=10

3️⃣ Lister un transfert par son ID
GET /transfers/:id

4️⃣ Simuler le traitement
POST /transfers/:id/process

5️⃣ Annuler un transfert
POST /transfers/:id/cancel

```

## 🧪 Tests unitaires

```bash

npm run test

Tests inclus :

✅ Calcul des frais (min 100, max 1500)

```

## 🔄 Explication du flow

```bash
- Toutes les routes sont protégées par une clé API (x-api-key)
- Calcul dynamique des frais (0.8% avec min/max)
- Transferts passent par PENDING, PROCESSING, SUCCESS/FAILED
- Provider simulé avec délai et probabilité de succès
- Historique des étapes du transfert
- Recherche et Résultats paginés pour les listes

```

## 🧠 Choix techniques

```bash

- NestJS : architecture modulaire, testabilité
- Prisma : ORM typé, rapide et moderne
- PostgreSQL : base de données relationnelle robuste et open-source
- Swagger : documentation interactive
- Jest : tests unitaires robustes
- Docker : environnement reproductible

```

## ⏳ Ce que je ferais avec plus de temps

```bash

- Interface admin pour visualiser les transferts
- Intégration d’un vrai provider (Wave, Orange Money)
- notification du client en temps réel
- Authentification multi-clés avec rôles

```

## 🧘 Auteurs

```bash

Cheikh Salikh Taha Niang
© DEXCHANGE Test Project
