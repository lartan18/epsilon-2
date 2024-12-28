import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
// import { getFirestore, collection, addDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
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

setPersistence(auth, browserLocalPersistence).then(() => console.log("set to local"))

// document.addEventListener("DOMContentLoaded", _ => {
//     const user = auth.currentUser
//     console.log("user", user)
//     if (user) {
//         console.log("logged in")
//     }
//     else {
//         console.log("not logged in")
//     }
// })

let eventData = ref(db, "events")
console.log(eventData)

let userCredentials

let data = {
    12345678: {
        user: {
            email: "lartan18@gmail.com",
            id: "1F2PRglfdXTEhwww7g5b2V34JGk2"
        },
        stars: 4,
        subject: "ITGK"
    }
}

// addDoc(collection(db, "events"), object)

// function writeData() {
//     set(ref(db, object))
// }

set(ref(db, "events"), data)
    .then(() => {
        console.log("data uploaded")
    })
    .catch(() => {
        console.log("data not uploaded")
    })

onAuthStateChanged(auth, (user) => {
    console.log("user", user)
    if (user) {
        console.log(user.metadata.createdAt)
        userCredentials = user
    }
    else {
        console.log("dont think youre logged in")
    }
})

const loginEmailPassword = async () => {
    loginError.classList.add("hidden")
    try {
        const loginEmail = emailInput.value
        const loginPassword = passwordInput.value
        userCredentials = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        console.log(userCredentials.user)

        emailInput.value = passwordInput.value = ""
    }
    catch {
        console.log(userCredentials.user)
        loginError.classList.remove("hidden")
    }
    console.log(userCredentials.user)
    // writeData()
}

loginBtn.addEventListener("click", loginEmailPassword)
// loginBtn.addEventListener("click", _ => signOut(auth))