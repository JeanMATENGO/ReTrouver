import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'trouve-ca-ads';

export async function getAds() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.warn("Erreur Firebase (Avez-vous configuré les clés ?) : ", error);
    return []; // Retourne vide si erreur (ex: pas de config valide)
  }
}

export async function addAd(adData, userId) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...adData,
      createdAt: new Date().toISOString(),
      userId: userId || 'anonymous' // On lie l'annonce à l'utilisateur
    });
    return { id: docRef.id, ...adData };
  } catch (error) {
    console.error("Erreur d'enregistrement Firebase : ", error);
    throw error;
  }
}

export async function seedInitialDataIfNeeded() {
  // Plus besoin de seed local, les données seront sur Firestore.
  console.log("Seed ignoré sur Firebase !");
}
