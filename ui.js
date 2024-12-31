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

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
// const db = getFirestore(app)
const db = getDatabase(app)

const loginCTA = document.querySelector("#login-cta")
const loginPopup = document.querySelector("#login-popup")
const createEventCTA = document.querySelector("#create-event-cta")
const createEventPopup = document.querySelector("#create-event-popup")
const signOutBtn = document.querySelector("#sign-out-btn")
const dialogContent = document.querySelector("#dialog")
const loginCloseBtn = document.querySelector("#login-close")
const emailInput = document.querySelector("#email-input")
const passwordInput = document.querySelector("#password-input")
const loginBtn = document.querySelector("#login-button")
const loginError = document.querySelector("#login-error")
const descriptionInput = document.querySelector("#description-input")
const subjectInput = document.querySelector("#subject-input")

const titleInput = document.querySelector("#title-input")
const titleInputHTML = document.getElementById("title-input")
const dateInput = document.querySelector("#date-input")
const timeInput = document.querySelector("#time-input")

const eventList = document.querySelector("#event-list")

const starRating = document.querySelectorAll(".rating-div p")

const createEventForm = document.querySelector("#create-event-form")

const showEventPopup = document.querySelector("#show-event-popup")
const showEventDialog = document.querySelector("#show-event-dialog")


const submitEvent = document.querySelector("#submit-event-btn")

const totalCountDisplay = document.getElementById("total-count-display")
const LEGACY_COUNT = 239


let selectedRating = false

submitEvent.addEventListener("click", (e) => {
    e.preventDefault()
    try {
        const timestamp = new Date(`${dateInput.value}T${timeInput.value}:00`).getTime()
        set(ref(db, "events/"+timestamp), createEntry(globalUser.email, globalUser.uid, titleInput.value, 
            {stars: selectedRating ? selectedRating : [], description: descriptionInput.value.trim() ? descriptionInput.value : "",
                subject: subjectInput.value.trim() ? subjectInput.value : ""
            }
        ))
        console.log("Event added")
    }
    catch (error) {
        console.log(error)
    }
})

function createEntry(email, userID, title, optionals) {
    const obj = {
        // time: time,
        user: {
            email: email,
            id: userID
            // need to,
            // find way to make usernames
        },
        title: title
    }

    if (optionals["description"].trim() !== "") {
        obj["description"] = optionals["description"]
    }
    if (optionals["stars"]) {
        obj["stars"] = [optionals["stars"]] // turn this into an object with everyones ratings (lartan18@gmail.com: 5, x@y.z: 3)
        // let x = await get(ref(db, "events/1735594140000/stars"))

        // console.log(x.val())
        // set(ref(db, "events/1735594140000/stars"), x.val()+"2")
    }
    if (optionals["subject"]) {
        obj["subject"] = optionals["subject"]
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

function displayEvents(showAll=true) {
    let returnHTML = ""
    let loopLength = 2
    if (showAll === true) {
        loopLength = dbKeys.length
        // console.log("function:", dbKeys)
    }
    for (let i = loopLength - 1; i > -1; i--) { // has to count
        const e = dbData[dbKeys[i]]
        const dateObject = new Date(Number(dbKeys[i]))
        const now = new Date();
        const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

        const timeString = dateObject.toTimeString().slice(0, 5); // "HH:MM"
        let result;

        if (dateObject.toDateString() === now.toDateString()) {
        result = `Today, ${timeString}`;
        } else if (dateObject > oneWeekAgo) {
        result = `${dateObject.toLocaleDateString('en-US', { weekday: 'short' })}, ${timeString}`;
        } else {
        result = `${dateObject.getDate()}.${dateObject.getMonth() + 1}.${dateObject.getFullYear()}, ${timeString}`;
        }

        returnHTML += `
            <div class="event-box" data-boxtime="${dbKeys[i]}">
                <h5>${e.title} <span class="detitle">- ${result}</span></h5>
                ${e.subject ? `<p>${e.subject}</p>` : "<p>Unknown</p>"}
            `
            if (!e.stars) {
                returnHTML += "<div class='event-stars' style='justify-self: initial;'><p>No ratings yet</p>"
            } else {
                returnHTML += "<div class='event-stars'>"
                let averageRating = 3
                let ratingCount = 4
                for (let i = 0; i < 5; i++) {
                    if (i < averageRating) {
                        returnHTML += '<img src="images/star-filled.svg" alt="Filled star">'
                    }
                    else {
                        returnHTML += '<img src="images/star-nofill.svg" alt="Unfilled star"> '
                    }
                }
                returnHTML += `<p>(${ratingCount})</p>`
                
            }
        
        returnHTML += `</div></div>`
    }
    
    eventList.innerHTML = returnHTML
}

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

await get(ref(db, "events")).then ((snapshot) => {
    dbData = snapshot.val()
    dbKeys = Object.keys(dbData)
    totalCountDisplay.innerText = dbKeys.length + LEGACY_COUNT
    console.log("wwww:", dbData)
})

//
//
// UI
//
//

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
        loginPopup.style.display = "none"
        // console.log(userCredentials.user)
        loginError.classList.remove("hidden-warning")
    }
    // console.log(userCredentials.user)
}

signOutBtn.addEventListener("click", _ => signOut(auth))

loginBtn.addEventListener("click", loginEmailPassword)

displayEvents()

titleInput.addEventListener("focus", _ => {
    if (titleInputHTML.value === "Question") {
        titleInputHTML.select()
    }    
})

starRating.forEach(star => {
    star.addEventListener("click", _ => {
        const starNum = star.dataset.starnum
        console.log(starNum, star)
        if (starRating[starNum-1].innerText === nofillStar) {
            for (let i = 0; i < starNum; i++) {
                starRating[i].innerText = filledStar
            }
            selectedRating = starNum
        }
        else if (starRating[starNum-1].innerText === filledStar && (starNum == 5 || starRating[starNum].innerText === nofillStar)) {
            for (let i = 0; i < starNum; i++) {
                starRating[i].innerText = nofillStar
            }
            selectedRating = false
        }
        else {
            for (let i = 0; i < 5; i++) {
                starRating[i].innerText = nofillStar
            }
            for (let i = 0; i < starNum; i++) {
                starRating[i].innerText = filledStar
            }
            selectedRating = false
        }
    })
});

const filledStar = "★"
const nofillStar = "☆"

function showLogin() {
    signOutBtn.classList.add("hidden")
    createEventCTA.classList.add("hidden")
    loginCTA.parentElement.classList.remove("hidden")
}

function showCreateEvent() {
    signOutBtn.classList.remove("hidden")
    createEventCTA.classList.remove("hidden")
    loginCTA.parentElement.classList.add("hidden")
}

loginCTA.addEventListener("click", _ => loginPopup.style.display = "flex")

loginPopup.addEventListener("click", (e) => {
    if(e.target === loginPopup) {
        loginPopup.style.display = "none"
    }
})

loginCloseBtn.addEventListener("click", _ => loginPopup.style.display = "none")

createEventCTA.addEventListener("click", _ => {
    createEventPopup.style.display = "flex"
    // add date
    let today = new Date()
    
    // chatgpt legend
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    let day = String(today.getDate()).padStart(2, '0');

    let hours = String(today.getHours()).padStart(2, '0');
    let minutes = String(today.getMinutes()).padStart(2, '0');

    dateInput.value = `${year}-${month}-${day}`;
    timeInput.value = `${hours}:${minutes}`;

    starRating.forEach(star => {
        star.innerText = nofillStar
    })

    descriptionInput.value = ""
    titleInput.value = "Question"
    subjectInput.value = ""
})

createEventPopup.addEventListener("click", (e) => {
    if(e.target === createEventPopup) {
        createEventPopup.style.display = "none"
    }
})

const eventBoxes = document.querySelectorAll(".event-box")

eventBoxes.forEach(box => {
    box.addEventListener("click", _ => {
        const time = box.dataset.boxtime
        get(ref(db, "events"), time).then((snapshot) => {
            let resultHTML = '<div id="show-event-dialog"><h3>Welcome</h3>'
            const boxdata = snapshot.val()[time]
            resultHTML += `
            <h4>${boxdata.title}</h4>
            ${boxdata.subject ? `<h5>${boxdata.subject}</h5>` : "<h5>Unknown subject</h5>"}
            ${boxdata.description ? `<p>${boxdata.description}</p>` : ""}
            NEED LOGIC HERE TO FIX STARS
            ${boxdata.stars ? "stars go here" : '<div class="rating-div"><p class="star" data-starnum="1">☆</p><p class="star" data-starnum="2">☆</p><p class="star" data-starnum="3">☆</p><p class="star" data-starnum="4">☆</p><p class="star" data-starnum="5">☆</p></div>'}
            `
            
            resultHTML += "</div>"
            showEventPopup.innerHTML = resultHTML
            showEventPopup.style.display = "flex"
            showEventPopup.addEventListener("click", (e) => {
                if (e.target === showEventPopup) {
                    showEventPopup.style.display = "none"
                }
            })
        })
    })
})