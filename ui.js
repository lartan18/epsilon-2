import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, 
    onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
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
    const timestamp = new Date(`${dateInput.value}T${timeInput.value}:00`).getTime()
    if (titleInput.value) {
        try {
            // console.log(checkTime(timestamp))
            if (checkTime(timestamp)[0] || (!checkTime(timestamp)[0] && confirm(checkTime(timestamp)[1]))) {
                set(ref(db, "events/"+timestamp), createEntry(globalUser.email, globalUser.uid, titleInput.value, 
                    {stars: selectedRating ? selectedRating : [], description: descriptionInput.value.trim() ? descriptionInput.value : "",
                        subject: subjectInput.value.trim() ? subjectInput.value : ""
                    }
                )).then(() => {
                    location.reload()
                    console.log("Event added")
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    else {
        alert("Title is required")
    }
})

function createEntry(email, userID, title, optionals) {
    const obj = {
        // time: time,
        user: {
            email: email,
            id: userID
            // need to find way to make usernames
        },
        title: title
    }

    if (optionals["description"].trim() !== "") {
        obj["description"] = optionals["description"]
    }
    if (optionals["stars"]) {
        console.log(globalUser)
        obj["stars"] = {[globalUser.displayName]: optionals["stars"]} // turn this into an object with everyones ratings (lartan18@gmail.com: 5, x@y.z: 3)
        // let x = await get(ref(db, "events/1735594140000/stars"))

        // console.log(x.val())
        // set(ref(db, "events/1735594140000/stars"), x.val()+"2")
    } 
    if (optionals["subject"]) {
        obj["subject"] = optionals["subject"]
    }

    return obj
}

function checkTime(timestamp) {
    // returns two booleans, first is if there exists one event within one minute,
    // second is outgoing message
    if (timestamp in dbData) {
        console.log(timestamp, dbData[timestamp])
        console.log("already exists")
        return [false, "There already exists an event at this time. Overwrite?"]
    } 
    else if (timestamp + 60000 in dbData) {
        return [false, "There already exists an event 1 minute after this. Continue?"]
    }
    else if (timestamp - 60000 in dbData) {
        return [false, "There already exists an event 1 minute before this. Continue?"]
    }
    else {
        return [true, undefined]
    }
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
                let averageRating, ratingCount, totalSum
                averageRating = ratingCount = totalSum = 0
                if (typeof e.stars == "object") {
                    for (const rating in e.stars) {
                        // console.log(e)
                        if (e.stars[rating]) {
                            totalSum += Number(e.stars[rating])
                            ratingCount += 1
                        }
                    }
                    if (ratingCount > 0) {
                        averageRating = totalSum / ratingCount
                    }
                    // else if () {
                    //     // set(ref(db, `events/${dbKeys[i]}/stars`), "").then(() => location.reload())
                    //     ref(db, `events/${dbKeys[i]}`).child("stars").remove()
                    // }
                    console.log(totalSum, ratingCount, averageRating)
                }
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
        console.log(user.displayName)
        if (!user.displayName) {
            updateProfile(user, {
                displayName: prompt("First name:")
            }).then(() => {
                console.log("updated")
            })
        }
        console.log(user.displayName)
        globalUser = user
        showCreateEvent() // shows create event button, not create event popup
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
    console.log("Database data:", dbData)
})

//
//
// UI
//
//

const loginEmailPassword = async () => {
    console.log("triggered")
    
    loginError.classList.add("hidden-warning")
    try {
        const loginEmail = emailInput.value
        const loginPassword = passwordInput.value
        // console.log("ooo")
        signInWithEmailAndPassword(auth, loginEmail, loginPassword).then((user) => {
            // console.log(user.user)
            globalUser = user
            location.reload()
        })
        // console.log("uuu")
        // console.log("success")
        // emailInput.value = passwordInput.value = ""
        
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

let refreshOnClose = false

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
            `

            // if (globalUser.displayName in boxdata.stars) {
            //     console.log("this exists, lezzgoo")
            // } else {
            //     console.log("sadge")
            // }
            let filledStars = 0
            let userHasRated = false
            let chosenStarCount
            if (boxdata.stars && globalUser.displayName in boxdata.stars) {
                filledStars = boxdata.stars[globalUser.displayName]
                userHasRated = true
            }

            resultHTML += '<div class="rating-div" id="view-event-stars">'

            for (let i = 0; i < 5; i++) {
                if (filledStars > i) { // if 1 star, i = 0 fills first star, but not second. index offset
                    resultHTML += `<p class="star" data-starnum="${i+1}">${filledStar}</p>`
                } else {
                    resultHTML += `<p class="star" data-starnum="${i+1}">${nofillStar}</p>`
                }
            }

            resultHTML += "</div>"
            
            console.log(boxdata.stars)

            // resultHTML += `${boxdata.stars ? "stars go here" : '<div class="rating-div"><p class="star" data-starnum="1">☆</p><p class="star" data-starnum="2">☆</p><p class="star" data-starnum="3">☆</p><p class="star" data-starnum="4">☆</p><p class="star" data-starnum="5">☆</p></div>'}`
            
            resultHTML += "</div>"
            showEventPopup.innerHTML = resultHTML
            showEventPopup.style.display = "flex"
            showEventPopup.addEventListener("click", (e) => {
                if (e.target === showEventPopup) {
                    console.log(boxdata)
                    showEventPopup.style.display = "none"
                    if (refreshOnClose) {
                        set(ref(db, `events/${time}/stars/${globalUser.displayName}`), Number(chosenStarCount)).then(() => location.reload())
                    }
                }
            })

            const eventStars = document.querySelectorAll("#view-event-stars .star")
            eventStars.forEach(star => {
                star.addEventListener("click", _ => {
                    const starNum = star.dataset.starnum
                    console.log(starNum, star)
                    if (eventStars[starNum-1].innerText === nofillStar) {
                        for (let i = 0; i < starNum; i++) {
                            eventStars[i].innerText = filledStar
                        }
                        chosenStarCount = starNum
                    }
                    else if (eventStars[starNum-1].innerText === filledStar && (starNum == 5 || eventStars[starNum].innerText === nofillStar)) {
                        for (let i = 0; i < starNum; i++) {
                            eventStars[i].innerText = nofillStar
                        }
                        chosenStarCount = ""
                    }
                    else {
                        for (let i = 0; i < 5; i++) {
                            eventStars[i].innerText = nofillStar
                        }
                        for (let i = 0; i < starNum; i++) {
                            eventStars[i].innerText = filledStar
                        }
                        chosenStarCount = ""
                    }
                    if (userHasRated && boxdata.stars[globalUser.displayName] != chosenStarCount) {
                        refreshOnClose = true
                    }
                    else if (!userHasRated && boxdata.stars[globalUser.displayName] != chosenStarCount) {
                        refreshOnClose = true
                    }
                    else if (!userHasRated) {
                        refreshOnClose = false
                    }
                })
            })
        })
    })
})