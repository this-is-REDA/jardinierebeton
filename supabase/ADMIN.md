# Espace Admin — Jardinière Béton

## 1. Créer le projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un projet
2. Copiez `.env.local.example` vers `.env.local` et remplissez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Base de données

Dans **Supabase → SQL Editor**, exécutez dans l'ordre :

1. `supabase/schema.sql` — tables, sécurité, storage
2. `supabase/seed.sql` — catalogue actuel (tarifs + photos)

## 3. Compte administrateur

Dans **Supabase → Authentication → Users** :

1. Cliquez **Add user**
2. Email + mot de passe de votre choix
3. Utilisez ces identifiants sur `/admin/login`

## 4. Accès admin

| URL | Rôle |
|-----|------|
| `/admin/login` | Connexion |
| `/admin` | Tableau de bord |
| `/admin/products` | Tarifs & modèles (catalogue) |
| `/admin/photos` | Photos produits (upload) |
| `/admin/contacts` | Messages du formulaire |
| `/admin/settings` | Email, WhatsApp, livraison |

## 5. Ce que vous pouvez modifier

| Admin | Visible sur le site |
|-------|---------------------|
| Tarifs & modèles | Page **Catalogue**, section **Produits** |
| Photos produits | Page **Produits**, accueil |
| Paramètres | Bouton WhatsApp, infos contact |
| Messages | Formulaire **Contact** |

## 6. Upload photos

Les images uploadées vont dans le bucket Supabase `product-images`.
Elles s'affichent automatiquement sur le site après enregistrement.

## 7. Sans Supabase

Le site fonctionne toujours avec les données statiques (`site-data.ts`).
L'admin nécessite Supabase configuré.
