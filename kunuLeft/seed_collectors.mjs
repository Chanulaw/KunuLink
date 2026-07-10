import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_SN36bi4v1RNJkjcRkHaxah7XbfzyRz8",
  authDomain: "kunulink.firebaseapp.com",
  projectId: "kunulink",
  storageBucket: "kunulink.firebasestorage.app",
  messagingSenderId: "546104304972",
  appId: "1:546104304972:web:d5c90e18c1c929ed909be9",
  measurementId: "G-KN25CV0SDL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const dummyCollectors = [
  { name: "Saman Perera", email: "saman.collector@kunulink.com", password: "password123", phone: "0711234567", vehicle: "WP-1234", area: "Colombo 01" },
  { name: "Nimal Silva", email: "nimal.collector@kunulink.com", password: "password123", phone: "0777654321", vehicle: "WP-5678", area: "Colombo 02" },
  { name: "Kamal Fernando", email: "kamal.collector@kunulink.com", password: "password123", phone: "0722334455", vehicle: "WP-9012", area: "Colombo 03" }
];

async function seed() {
  console.log("Starting to seed collectors...");
  for (const c of dummyCollectors) {
    try {
      console.log(`Creating/Signing in user: ${c.email}`);
      let uid;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, c.email, c.password);
        uid = userCredential.user.uid;
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          console.log(`User exists, signing in...`);
          const { signInWithEmailAndPassword } = await import("firebase/auth");
          const userCredential = await signInWithEmailAndPassword(auth, c.email, c.password);
          uid = userCredential.user.uid;
        } else {
          throw err;
        }
      }
      
      console.log(`Waiting for auth state to propagate...`);
      await new Promise(r => setTimeout(r, 1500));

      console.log(`Saving to users collection for ${c.email}`);
      await setDoc(doc(db, "users", uid), {
        name: c.name,
        email: c.email,
        role: "collector",
        createdAt: serverTimestamp(),
      });

      console.log(`Saving to collectors collection for ${c.email}`);
      await setDoc(doc(db, "collectors", uid), {
        name: c.name,
        email: c.email,
        phone: c.phone,
        vehicle: c.vehicle,
        area: c.area,
        role: "collector",
        activeJobs: 0,
        createdAt: serverTimestamp(),
      });
      console.log(`Successfully added collector: ${c.name}`);
    } catch (error) {
      console.error(`Failed to add ${c.name}:`, error.message);
    }
  }
  console.log("Finished seeding.");
  process.exit(0);
}

seed();
