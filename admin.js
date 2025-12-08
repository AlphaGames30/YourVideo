import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const db = getFirestore();
const myEmail = "edonis.imbert@gmail.com"; // Admin principal

// Fonction pour vérifier si l'utilisateur actuel est admin
async function checkIfAdmin(userEmail) {
    const docRef = doc(db, "config", "permissions");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        const admins = docSnap.data().adminList;
        return admins.includes(userEmail);
    }
    return false;
}

// Fonction pour ajouter un admin (Réservé à toi)
window.addNewAdmin = async (newAdminEmail) => {
    const adminRef = doc(db, "config", "permissions");
    await updateDoc(adminRef, {
        adminList: arrayUnion(newAdminEmail)
    });
    alert(newAdminEmail + " est maintenant administrateur !");
};
