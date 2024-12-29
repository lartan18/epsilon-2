import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js"
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, 
    onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"

function uploadData(toUpload) {
    set(ref(db, "events"), toUpload)
        .then(() => {
            console.log("Data uploaded")
        })
        .catch((error) => {
            console.log("Error uploading data: ", error)
    })
}

async function getData() {
    let retrieved

    await get(dbData)
        .then((snapshot) => {
            retrieved = snapshot.val()
        })

    return retrieved
}



function createEntry(time, email, userID, stars, subject="Unknown", description="") {
    const obj = {
        [time]: {
            user: {
                email: email,
                id: userID
            },
            stars: stars,
            subject: subject,
        }
    }

    if (description.trim() !== "") {
        obj[time]["description"] = description
    }

    return obj
}

console.log("number =", Number(Object.keys(createEntry(1234, 1234, 1234, 1234, 1234, "   "))))

const db = getDatabase()
// const auth = getAuth()

let dbData = ref(db, "events")

let dataToUpload = {
    123456789: {
        user: {
            email: "lartan18@gmail.com",
            id: "1F2PRglfdXTEhwww7g5b2V34JGk2"
        },
        stars: 4,
        subject: "ITGK"
    },
    123756789: {
        user: {
            email: "lartan18@gmail.com",
            id: "1F2PRglfdXTEhwww7g5b2V34JGk2"
        },
        stars: 4,
        subject: "ITGK"
    }
}

let data = await getData()

console.log("data:\n", data)

// console.log("Database data:", dbData.value)