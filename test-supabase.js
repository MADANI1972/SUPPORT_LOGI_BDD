// test-supabase.js
import { config } from "dotenv";
config();

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Erreur: variables d'environnement Supabase manquantes !");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testConnection() {
  console.log("🔍 Test de connexion à Supabase avec clé service_role...");

  // Note : Pas besoin de préfixer avec "public." dans la requête
  const { data, error } = await supabase
    .from("interventions")
    .select("*")
    .limit(5);

  if (error) {
    console.error("❌ Erreur lors de la requête:", error);
  } else {
    console.log("✅ Connexion OK, données reçues :");
    console.table(data);
  }
}

testConnection();
// Exécutez ce script avec `node test-supabase.js` pour tester la connexion à Supabase.