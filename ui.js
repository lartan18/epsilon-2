const loginCTA = document.querySelector("#login-cta")
const loginDialog = document.querySelector("#login-popup")
const createEventCTA = document.querySelector("#create-event-cta")
const createEventDialog = document.querySelector("#create-event-popup")
const signOutBtn = document.querySelector("#sign-out-btn")
const dialogContent = document.querySelector("#dialog")
const loginCloseBtn = document.querySelector("#login-close")
const emailInput = document.querySelector("#email-input")
const passwordInput = document.querySelector("#password-input")
const loginBtn = document.querySelector("#login-button")
const loginError = document.querySelector("#login-error")

const titleInput = document.querySelector("#title-input")
const titleInputHTML = document.getElementById("title-input")
const dateInput = document.querySelector("#date-input")
const timeInput = document.querySelector("#time-input")

const starRating = document.querySelectorAll("#rating-div p")

const createEventForm = document.querySelector("#create-event-form")

const submitEvent = document.querySelector("#submit-event-btn")

let selectedRating = false



titleInput.addEventListener("focus", _ => {
    if (titleInputHTML.value === "Question") {
        titleInputHTML.select()
    }    
})

starRating.forEach(star => {
    star.addEventListener("click", _ => {
        const starNum = star.id[4]
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
    console.log("create event")
}

loginCTA.addEventListener("click", _ => loginDialog.style.display = "flex")

loginDialog.addEventListener("click", (e) => {
    if(e.target === loginDialog) {
        loginDialog.style.display = "none"
    }
})

loginCloseBtn.addEventListener("click", _ => loginDialog.style.display = "none")

createEventCTA.addEventListener("click", _ => {
    createEventDialog.style.display = "flex"
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
})

createEventDialog.addEventListener("click", (e) => {
    if(e.target === createEventDialog) {
        createEventDialog.style.display = "none"
    }
})

