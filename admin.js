

const adminScreenButtons = document.querySelectorAll('.screenButton')
const adminScreens = document.querySelectorAll('.screen')
const amodals = document.querySelectorAll('.modal');

const aoverLay = document.querySelector('.overLay');
adminScreenButtons.forEach((button) => {
    button.addEventListener('click', () => {
        adminScreens.forEach((adminScreen) => {
            if (button.id == adminScreen.id) {
                adminScreen.classList.add('active')
            } else {
                adminScreen.classList.remove('active')
            }
        })
    })
})

const closeScreens = document.querySelectorAll('.back')

closeScreens.forEach(screenbtn => {
    screenbtn.addEventListener('click', () => {
        closeAdminScreens();
    })
})

function closeAdminScreens() {
    adminScreens.forEach(screen => {
        screen.classList.remove('active')
    })
}

const closeStore = document.getElementById('closeStore')

const openStore = document.getElementById('openStore')

const setMessage = document.getElementById('setStoreMessage')

closeStore.addEventListener('click', () => {
    setStoreState(`We're Closed`);

})


openStore.addEventListener('click', () => {
    setStoreState(`We're Open`);
})

setMessage.addEventListener('click', () => {
    let text = document.getElementById('storeText').value
    setStoreMessage(text);
})


const inputFields = document.querySelectorAll('.imageUrl')

inputFields.forEach(field => {
    field.addEventListener('change', function (event) {
        const fileInput = document.getElementById(`${field.id}`);
        fileInput.parentElement.lastElementChild.innerHTML =
            `<div class="spinner">
                    <div class="spinnerSection">🥪</div>
                </div>`
        setTimeout(() => {
            fileInput.parentElement.lastElementChild.innerHTML = `Attached`
        }, 1500)
    });
})


async function setStoreState(state) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            storeState: state,
            storeId: document.getElementById('storeStateId').value
        })
    }
    const res = await fetch('/admin/setStoreState', options);
    const data = await res.json()
    showNoti(data.response)
}


async function setStoreMessage(text) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            storeText: text,
            storeId: document.getElementById('storeStateId').value
        })
    }
    const res = await fetch('/admin/setStoreMessage', options);
    const data = await res.json()
    showNoti(data.response)
}


function exitModals() {
    amodals.forEach(modal => {
        modal.classList.remove('active')
    })
    aoverLay.classList.remove('active')
}


const notiModal = document.querySelector('.modal#notiModal')

function showNoti(Text) {
    exitModals();
    notiModal.classList.add('active');
    aoverLay.classList.add('active')
    notiModal.firstElementChild.nextElementSibling.innerText = `${Text}`

}



const exitButtons = document.querySelectorAll('.closeButton')
//close modal buttons
exitButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.parentElement.parentElement.classList.remove('active')
        aoverLay.classList.remove('active')

    })
})


const itemName = document.getElementById('itemName')
const itemPrice = document.getElementById('itemPrice')
const pTags = document.getElementById('postTags')
const itemInfo = document.getElementById('itemInfo')
const itemClass = document.getElementById('itemClass')

document.getElementById('productForm').addEventListener('submit', (e) => {
    if (itemName.value == `` || itemPrice.value == `` || pTags.value == `` || itemInfo.value == `` || itemClass.value == ``) {
        e.preventDefault()
        document.getElementById('errorField').innerText = 'Please Fill In Required Fields'
        checkFields();

    } else {
        checkFields()
        document.getElementById('errorField').innerText = ``
    }
})

function checkFields() {
    if (itemName.value == ``) {
        itemName.style.border = `1px solid red`
    } else {
        itemName.style.border = `1px solid lime`
    }
    if (itemPrice.value == ``) {
        itemPrice.style.border = `1px solid red`
    } else {
        itemPrice.style.border = `1px solid lime`
    }
    if (pTags.value == ``) {
        pTags.style.border = `1px solid red`
    } else {
        pTags.style.border = `1px solid lime`
    }
    if (itemInfo.value == ``) {
        itemInfo.style.border = `1px solid red`
    } else {
        itemInfo.style.border = `1px solid lime`
    }
    if (itemClass.value == ``) {
        itemClass.style.border = `1px solid red`
    } else {
        itemClass.style.border = `1px solid lime`
    }


}

async function deleteOrder(orderId, userId) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, userId, orderState:'erase' })
    }
    const res = await fetch('/updateOrder', options);
    const data = await res.json();
    console.log(data);
}

async function updateOrder(orderId, userId, orderState) {
    console.log(userId + 'and' + orderId)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, userId, orderState })
    }
    const res = await fetch('/updateOrder', options);
    const data = await res.json()
    console.log(data)
}

cancelButtons = document.querySelectorAll('span .cancelButton')
deleteButtons = document.querySelectorAll('span .deleteButton')
processButtons = document.querySelectorAll('span .processButton')
let eraseButtons = document.querySelectorAll('span .eraseButton')
cancelButtons.forEach(cancelButton => {
    cancelButton.addEventListener('click', () => {
        cancelButton.innerHTML = `
            <div class="spinnerContainer">
                <div class="spinner">
                    <div class="spinnerSection">🌞</div>
                </div>
            </div>
        `
        console.log(cancelButton.parentElement.id)
        updateOrder(cancelButton.id, cancelButton.parentElement.id, cancelButton.previousElementSibling.previousElementSibling.id).then((done) => {
            cancelButton.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.nextElementSibling.innerHTML = 'Cancelled'
            cancelButton.innerHTML = 'Done'
        })
    })
})

deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
        deleteButton.innerHTML = `
            <div class="spinnerContainer">
                <div class="spinner">
                    <div class="spinnerSection">🌞</div>
                </div>
            </div>`
        updateOrder(deleteButton.id, deleteButton.parentElement.id, deleteButton.previousElementSibling.id).then((done) => {
            deleteButton.innerHTML = 'Deleted'
            setTimeout(() => {
                deleteButton.parentElement.parentElement.remove()
            }, 1500)
        })
        
    })
})

processButtons.forEach(processButton => {
    processButton.addEventListener('click', () => {
        processButton.innerHTML = `
            <div class="spinnerContainer">
                <div class="spinner">
                    <div class="spinnerSection">🌞</div>
                </div>
            </div>
    `
        updateOrder(processButton.id, processButton.parentElement.id, "Processed").then((done)=>{
            //processButton.innerHTML = 'Done'
        })
    })
})

eraseButtons.forEach(eraseButton => {
    eraseButton.addEventListener('click', () => {
        eraseButton.innerHTML = `
            <div class="spinnerContainer">
                <div class="spinner">
                    <div class="spinnerSection">🌞</div>
                </div>
            </div>
    `
        deleteOrder(eraseButton.id, eraseButton.parentElement.id,).then((done)=>{
            eraseButton.innerHTML = 'Done'
        })
    })
})

setTimeout(() => {
    document.getElementById('onSubmitResponse').classList.add('hideRes')
}, 4500)