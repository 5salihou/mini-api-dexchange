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

## 🧘 Auteurs

```bash

Cheikh Salikh Taha Niang
© DEXCHANGE Test Project
