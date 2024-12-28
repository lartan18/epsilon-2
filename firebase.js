import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, 
    onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI_fvum87X09Abqdt14dykBjh9qPuIPuc",
  authDomain: "epsilon-513e7.firebaseapp.com",
  projectId: "epsilon-513e7",
  storageBucket: "epsilon-513e7.firebasestorage.app",
  messagingSenderId: "1043635607945",
  appId: "1:1043635607945:web:830b0dc24bcf45b5d4e958",
  databaseURL: "https://epsilon-513e7-default-rtdb.europe-west1.firebasedatabase.app"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
// const db = getFirestore(app)
const db = getDatabase(app)

setPersistence(auth, browserLocalPersistence)
// .then(() => console.log("set to local"))

let eventData = ref(db, "events")
console.log(eventData)

onAuthStateChanged(auth, (user) => {
    console.log("User: \n", user)
    if (user) {
        console.log("user signed in")
        showCreateEvent()
    }
    else {
        showLogin()
    }
})

const loginEmailPassword = async () => {
    loginError.classList.add("hidden-warning")
    try {
        const loginEmail = emailInput.value
        const loginPassword = passwordInput.value
        userCredentials = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        
        // console.log("success")
        emailInput.value = passwordInput.value = ""
        // console.log(userCredentials.user)
    }
    catch {
        loginDialog.style.display = "none"
        // console.log(userCredentials.user)
        loginError.classList.remove("hidden-warning")
    }
    // console.log(userCredentials.user)
}

const signOutBtn = document.querySelector("#sign-out-btn")

signOutBtn.addEventListener("click", _ => signOut(auth))

loginBtn.addEventListener("click", loginEmailPassword)