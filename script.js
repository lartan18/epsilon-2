import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js'
import { getDatabase, ref, push, onValue, set, get, update } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js'

const appSettings = {
    databaseURL: "https://inconspicuous-2c4f9-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const countDB = ref(database, "counter")

const counter = document.querySelector("#total-count h2")

onValue(countDB, function(snapshot) {
    counter.innerText = snapshot.val()
})