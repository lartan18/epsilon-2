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

createEventCTA.addEventListener("click", _ => createEventDialog.style.display = "flex")

createEventDialog.addEventListener("click", (e) => {
    if(e.target === createEventDialog) {
        createEventDialog.style.display = "none"
    }
})