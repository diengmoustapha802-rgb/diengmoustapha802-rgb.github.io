// =============================================================
//  Connexion du site à ton projet Firebase « flashboutiquesn »
//  Ce fichier est utilisé par la boutique (index.html)
//  ET par l'espace gérant (admin.html).
// =============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Ta configuration (copiée depuis la console Firebase).
// Si le site affiche une erreur de « clé API », remplace ce bloc
// par celui que tu copies directement dans Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyDUm9ZAgTc3V60Eg1cM0fjGmVvQj7f1UWg",
  authDomain: "flashboutique-6c.firebaseapp.com",
  projectId: "flashboutique-6c",
  storageBucket: "flashboutique-6c.firebasestorage.app",
  messagingSenderId: "304382571251",
  appId: "1:304382571251:web:41c560d15dcf39d10efd86"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
