import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, 
    onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import { getDatabase, ref, get, set, onValue, child } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js"

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

submitEvent.addEventListener("click", (e) => {
    e.preventDefault()
    try {
        const timestamp = new Date(`${dateInput.value}T${timeInput.value}:00`).getTime()
        // if () {
        //     set(ref(db, "events/"+timestamp), createEntry(globalUser.email, globalUser.uid, {stars: selectedRating ? selectedRating : "", description: "brrr"}))
        //     console.log("Event added")
        // }
    }
    catch (error) {
        console.log(error)
    }
})

function createEntry(email, userID, optionals) {
    const obj = {
        // time: time,
        user: {
            email: email,
            id: userID
            // need to find way to make usernames
        }
    }

    if (optionals["description"].trim() !== "") {
        obj["description"] = optionals["description"]
    }
    if (optionals["stars"]) {
        obj["stars"] = [optionals["stars"]]
    }

    return obj
}

async function getData() {
    let retrieved

    await get(ref(db, "events"))
        .then((snapshot) => {
            retrieved = snapshot.val()
        })

    return retrieved
}


// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
// const db = getFirestore(app)
const db = getDatabase(app)

// console.log(await getData())

setPersistence(auth, browserLocalPersistence)
// .then(() => console.log("set to local"))

let globalUser

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("user signed in:", user)
        globalUser = user
        showCreateEvent()
    }
    else {
        showLogin()
    }
})

let dbKeys, dbData

get(ref(db, "events")).then ((snapshot) => {
    dbData = snapshot.val()
    dbKeys = Object.keys(dbData)
    totalCountDisplay.innerText = dbKeys.length + LEGACY_COUNT
    console.log("wwww:", dbData)
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

displayEvents(true)