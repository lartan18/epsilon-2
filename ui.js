const loginCTA = document.querySelector("#login-cta")
const loginDialog = document.querySelector("#login-popup")
const dialogContent = document.querySelector("#dialog")
const loginCloseBtn = document.querySelector("#login-close")
const emailInput = document.querySelector("#email-input")
const passwordInput = document.querySelector("#password-input")
const loginBtn = document.querySelector("#login-button")
const loginError = document.querySelector("#login-error")

loginCTA.addEventListener("click", _ => {
    loginDialog.style.display = "flex"
})

loginDialog.addEventListener("click", (e) => {
    if(e.target === loginDialog) {
        loginDialog.style.display = "none"
    }
})

loginCloseBtn.addEventListener("click", _ => loginDialog.style.display = "none")