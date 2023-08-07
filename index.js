import { menuArray } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const containerEl = document.getElementById('container')
const totalPriceEl = document.getElementById('total-price')
const paymentForm = document.getElementById('payment-form')
const cardDetailsModal = document.getElementById('card-details-modal')
const orderConfirmation = document.getElementById('order-confirmation-middle')
const orderConfirmationContainer = document.getElementById('order-confirmation-container')
const thanksDivEl = document.getElementById('thank-div')
let totalPriceNumber = 0

document.addEventListener('click', function(e) {
    if(e.target.dataset.plusBtn) {
        showItemsToBuy(e.target.dataset.plusBtn)
    }
    else if(e.target.id === 'order-btn') {
        showCardDetailsModal()
    }
    else if(e.target.dataset.remove) {
        removeItemsToBuy(e.target.dataset.remove)
    }
})

function showItemsToBuy(itemId) {
    thanksDivEl.classList.add('hidden')
    orderConfirmation.classList.remove('hidden')
    
    const orderConfirmationInner = document.getElementById('order-confirmation-inner')

    let itemHtml = ``

    menuArray.forEach(function(menuItem) {

        if(menuItem.uuid === itemId) {
            itemHtml = `
                <div class="confirmation-price" id="confirmation-price-${menuItem.uuid}">
                    <div class="remove-option">
                        <h2>${menuItem.name}</h2>
                        <p data-remove="${menuItem.uuid}">remove</p>
                    </div>
                    <h3>$${menuItem.price}</h3>
                </div>`
                increasePrice(menuItem.price)
        }
    })
    orderConfirmationInner.innerHTML += itemHtml
    totalPriceEl.innerHTML = `$${totalPriceNumber}`
}

function increasePrice(number) {
    totalPriceNumber += number
}

function showCardDetailsModal() {
    cardDetailsModal.classList.remove('hidden') 
    disableBtns(true)
}

function disableBtns(state) {
    const orderBtn = document.getElementById('order-btn')
    orderBtn.disabled = state
    
    const buttons = document.querySelectorAll('.plus-btn')
    for(let btn of buttons) {
        btn.disabled = state
    }  
}

function removeItemsToBuy(itemId) {
    document.getElementById(`confirmation-price-${itemId}`).remove()

    menuArray.forEach(function(menuItem) {
        if(itemId === menuItem.uuid) {
            decreasePrice(menuItem.price)
        }
    })
    
    totalPriceEl.innerHTML = `$${totalPriceNumber}`
    
    if(totalPriceNumber === 0) {
        document.getElementById('order-confirmation-middle').classList.add('hidden')
    }
}

function decreasePrice(number) {
    totalPriceNumber -= number
}

paymentForm.addEventListener('submit', function(e) {
    e.preventDefault()
    handleThankMessage()
})

function handleThankMessage() {
    paymentForm.reset()
    cardDetailsModal.classList.add('hidden')
    orderConfirmation.classList.add('hidden')
    thanksDivEl.classList.remove('hidden')
    thanksDivEl.innerHTML = `<p class="thank-message">Thanks, James! Your order is on its way!</p>`
    resetOrder()
}

function resetOrder() {
    totalPriceNumber = 0
    disableBtns(false)
    
    const confirmationPriceItems = document.querySelectorAll('.confirmation-price')
    for(let item of confirmationPriceItems) {
        item.remove()
    }
}

function render() {
    getFeedHtml()
}

function getFeedHtml() {
    let feedHtml = ``

    menuArray.forEach(function(menuItem) {

        let ingredients = ``

        menuItem.ingredients.forEach(function(ingredient, index) {

            if(index === menuItem.ingredients.length - 1) {
                ingredients += `${ingredient}`
            } else {
                ingredients += `${ingredient}, `
            }
        })

        feedHtml += `
            <div class="menu-item">
                <div class="menu-item-description">
                    <div class="icon-container"><p class="icon">${menuItem.emoji}</p></div>
                    <div class="menu-item-text">
                        <h2>${menuItem.name}</h2>
                        <p>${ingredients}</p>
                        <h2 class="price">$${menuItem.price}</h2>
                    </div>
                </div>
                <button class="plus-btn" data-plus-btn='${menuItem.uuid}'>+</button>
            </div>
        `
    })

    containerEl.innerHTML = feedHtml
}

render()