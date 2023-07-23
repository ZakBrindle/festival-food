
//Get the app and db objects from setupFirebase
const { app, db } = setupFirebase();

var accountID = ""; // WHEN LOGGED IN STORE ACCOUNTID 

const publishable_key = "pk_live_51NVd2MEjWpAK8TuWU2ViGWscfzmVYt7KvTy2UoRWYR6KwJapFdGIwp3gzfZVnr8LPyqYhrOuoN3IVVof2J2NAqMW00GYLxjotP";

// Sample data for food items and delivery addresses
const foodOptions = [
  {
    name: "Mexican Burrito",
    price: 20,
    image: "mexican-burrito.jpg",
    extras: [],
    buybuttonid: "buy_btn_1NVfgmEjWpAK8TuWIK5DVM0v",

  },
  {
    name: "Flame Grilled Pizza",
    price: 20,
    image: "flame-grilled-pizza.jpg",
    extras: [],
    buybuttonid: "buy_btn_1NVgBYEjWpAK8TuWfE0fxXAp",
  },
  {
    name: "Cheeseburger and Chips",
    price: 18,
    image: "cheeseburger-and-chips.jpg",
    extras: [],
    buybuttonid: "buy_btn_1NVgECEjWpAK8TuW3YiLzIMt",
  },
  {
    name: "Halloumi and Fries",
    price: 20,
    image: "halloumi-and-fries.jpg",
    extras: [],
    buybuttonid: "buy_btn_1NVgG9EjWpAK8TuWr3Bb89Qs",
  },
  {
    name: "Mac & Cheese",
    price: 20,
    image: "mac-and-cheese.jpg",
    extras: [],
    buybuttonid: "buy_btn_1NVgLeEjWpAK8TuWCcxPHC8H",
  },
  {
    name: "Hot Chocolate",
    price: 8,
    image: "hot-chocolate.jpg",
    extras: [],
    buybuttonid: "buy_btn_1NVgNOEjWpAK8TuWmaeK8HFQ",
  },
  {
    name: "Latte",
    price: 8,
    image: "tea.jpg",
    extras: [],
    buybuttonid: "buy_btn_1NVgOfEjWpAK8TuWoXi88lfv",
  },
  {
    name: "Flat White",
    price: 8,
    image: "tea.jpg",
    extras: [],
    buybuttonid: "buy_btn_1NVgPzEjWpAK8TuWhUMWWiff",
  },
  {
    name: "Cup of Tea",
    price: 8,
    image: "tea.jpg",
    extras: [],
    buybuttonid: "buy_btn_1NVgREEjWpAK8TuWaki58q1g",
  },

  

];




// The function to create the Stripe Buy button
function createStripeBuyButton(food) {
  const buyButtonTemplate = document.getElementById("stripe-buy-button-template");
  const buyButton = buyButtonTemplate.content.cloneNode(true).querySelector("stripe-buy-button");

  // Set the unique buy button ID and publishable key
  buyButton.setAttribute("buy-button-id", food.buybuttonid);
  buyButton.setAttribute("publishable-key", publishable_key); // Use the common publishable key

  return buyButton;
}


function createFoodItem(food, index) {
  const foodItemWrapper = document.createElement("div");
  foodItemWrapper.classList.add("food-item-wrapper");

  const foodImage = document.createElement("img");
  foodImage.classList.add("food-image");
  foodImage.src = "./assets/" + food.image;
  foodImage.alt = food.name;

  const foodItem = document.createElement("div");
  foodItem.classList.add("food-item");

  const foodInfoWrapper = document.createElement("div");
  foodInfoWrapper.classList.add("food-info-wrapper");

  const foodDetail = document.createElement("div"); // New div for food-name and price
  foodDetail.classList.add("food-detail");

  const foodName = document.createElement("span");
  foodName.textContent = food.name;
  foodName.classList.add("food-name");

  const price = document.createElement("span");
  price.textContent = `£${food.price.toFixed(2)}`;
  price.classList.add("price");

  // Append foodName and price to foodDetail
  foodDetail.appendChild(foodName);
  foodDetail.appendChild(price);

  // Append foodDetail to foodInfoWrapper
  foodInfoWrapper.appendChild(foodDetail);

  const spaceDiv = document.createElement("div");
  spaceDiv.style.height = "20px";
  foodInfoWrapper.appendChild(spaceDiv);

  if (food.buybuttonid) {
    const stripeBuyButton = createStripeBuyButton(food);
    foodInfoWrapper.appendChild(stripeBuyButton);
  }

  const spaceDiv2 = document.createElement("div");
  spaceDiv2.style.height = "30px";
  foodInfoWrapper.appendChild(spaceDiv2);

  foodItem.appendChild(foodInfoWrapper);
  
  foodItemWrapper.appendChild(foodImage);
  foodItemWrapper.appendChild(foodItem);
  

  const menuItemToggleContainer = document.createElement("div");
  menuItemToggleContainer.classList.add("menu-item-toggle-container");
  menuItemToggleContainer.style.display = "none";

  const menuItemToggle = document.createElement("input");
  menuItemToggle.type = "checkbox";
  menuItemToggle.id = `menu-item-toggle-${index}`;
  menuItemToggle.checked = true;

  const menuItemToggleLabel = document.createElement("label");
  menuItemToggleLabel.htmlFor = `menu-item-toggle-${index}`;
  menuItemToggleLabel.textContent = "Item Available";

  menuItemToggleContainer.appendChild(menuItemToggle);
  menuItemToggleContainer.appendChild(menuItemToggleLabel);

  foodItem.appendChild(menuItemToggleContainer);  // Append menuItemToggleContainer to foodItem

  return foodItemWrapper;
}



function showFoodToggles() {
  // Get all elements with class "menu-item-toggle-container"
  const menuToggleContainers = document.querySelectorAll(".menu-item-toggle-container");

  // Loop through all found elements and set display style to block
  menuToggleContainers.forEach(function(toggle) {
    toggle.style.display = "block";
  });
}

function hideFoodToggles() {
  // Get all elements with class "menu-item-toggle-container"
  const menuToggleContainers = document.querySelectorAll(".menu-item-toggle-container");

  // Loop through all found elements and set display style to none
  menuToggleContainers.forEach(function(toggle) {
    toggle.style.display = "none";
  });
}




function turnDeliveryOn()
{
  firebase.database().ref('deliveryStatus').set("ON");
  updateDelivery();
}

function turnDeliveryOff()
{
  firebase.database().ref('deliveryStatus').set("OFF");
  updateDelivery();
}

function turnDeliveryCapacity()
{
  firebase.database().ref('deliveryStatus').set("CAPACITY");
  updateDelivery();

}


function forceON()
{
  const statusElement = document.getElementById('status');
const menu = document.getElementById("menu");
const capacityToggleContainer = document.querySelector('.toggle-container-capacity');
const capacity_toggle = document.getElementById('capacity-toggle');

  statusElement.innerHTML = 'active';
  statusElement.style.color = 'green';
  menu.style.display = "block";  
  capacityToggleContainer.style.display = "block";
}







  updateDelivery();
  function updateDelivery() {
    //const { db } = window.firebaseApp;

   let deliveryStatus = "OFF";
    
    //db.ref('deliveryStatus').on('value', (snapshot) => {
    //  deliveryStatus = snapshot.val();
    //  console.log("Firebase: Delivery status - " + deliveryStatus);
    //});
  
const statusElement = document.getElementById('status');
const menu = document.getElementById("menu");
const capacityToggleContainer = document.querySelector('.toggle-container-capacity');
const capacity_toggle = document.getElementById('capacity-toggle');

if(deliveryStatus === "ON")
{
  statusElement.innerHTML = 'active';
  statusElement.style.color = 'green';
  menu.style.display = "block";  
  capacityToggleContainer.style.display = "block";
}
else if(deliveryStatus === "OFF")
{
  statusElement.innerHTML = 'offline';
  statusElement.style.color = 'red';
  menu.style.display = "none";
    capacityToggleContainer.style.display = "none";
    capacity_toggle.checked = false; // default to off
}
else if(deliveryStatus === "CAPACITY")
{
  statusElement.innerHTML = 'at capacity';
  statusElement.style.color = 'orange';
  menu.style.display = "none";    
}


}


// Function to create a unique ID for each food item
function getFoodItemId(food) {
  return food.name.toLowerCase().replace(/\s+/g, '-');
}

// Function to get the quantity from the basket based on food item ID
function getQuantityFromBasket(foodItemId) {
  return basket[foodItemId] || 0;
}

// Function to update the quantity in the item popup
function updateQuantityPopup(foodItemId, change) {
  let quantity = basket[foodItemId] || 0;
  quantity += change;
  quantity = Math.max(quantity, 0);
  basket[foodItemId] = quantity; // Update the basket quantity directly
  updateBasketDisplay(); // Update the basket display
}

// Add food options to the menu as div elements
const foodListContainer = document.getElementById("food-list-container");
var foodItemCount = 1;
foodOptions.forEach((food) => {
  const foodItem = createFoodItem(food, foodItemCount);
  foodItemCount+=1;
  foodListContainer.appendChild(foodItem);
});

// STRIPE PAYMENTS





function isMobileBrowser() {
  return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobileBrowser()) {
  // Code for mobile browsers
  console.log("User is on a mobile device.");
} else {
  // Code for desktop browsers
  console.log("User is on a desktop browser.");
  document.getElementById("app-image-centered").hidden = false;
  
  const appImage = document.getElementById('app-image');

// Check if the image element exists before attempting to remove it
if (appImage) {
  // Remove the image element from the DOM
  appImage.remove();
}


// Find the image element by its ID
const bhImage = document.getElementById('bh-image');

// Check if the image element exists before attempting to modify it
if (bhImage) {
  // Set the width of the image to 100%
  bhImage.style.width = '28%';
}


}



// Get references to the elements
const loginButton = document.querySelector(".login-button");
const loginContainer = document.querySelector(".login-container");
const settingsContainer = document.querySelector(".settings-container");




// Add click event listener to the login button
loginButton.addEventListener("click", () => {
  // Hide the login button
  loginButton.style.display = "none";
  showFoodToggles();
  document.getElementById("notification").style.display = "none";


  // Make the login container visible
  loginContainer.style.display = "block";


});



  const guestButton = document.querySelector(".guest-login-button");

  const menu = document.getElementById("menu");

  guestButton.addEventListener("click", function () {
    loginContainer.style.display = "none";

    accountType = "GUEST";

    // MOVE THIS TO THE LOGIN, THIS SHOULD NOT BE AVAILABLE FOR GUESTS
    settingsContainer.style.display = "block";  // ONLY IN GUEST FOR TESTING
    showFoodToggles();  // --------------       // ONLY IN GUEST FOR TESTING
    
    document.getElementById("notification").style.display = "block";
    if (toggle.checked) {
    menu.style.display = "block";

    }
  });

  const logoutButton = document.getElementById("logout-button");
  
  
  const toggle = document.getElementById('delivery-toggle');
const menuItems = document.getElementById('menu');
const capacity_toggle = document.getElementById('capacity-toggle');


  logoutButton.addEventListener("click", function () {
    hideFoodToggles();
    loginButton.style.display = "block";
    settingsContainer.style.display = "none";
    capacityToggleContainer.style.display = "none";

    menu.style.display = "none";
    
   
  });

toggle.addEventListener('change', function() {
  if (toggle.checked) {
    // Toggle is ON
    
    const statusElement = document.getElementById('status');
    const menu = document.getElementById("menu");
    const capacityToggleContainer = document.querySelector('.toggle-container-capacity');

    statusElement.innerHTML = 'active';
    statusElement.style.color = 'green';
    menu.style.display = "block";  
   // capacityToggleContainer.style.display = "block";
        
    
    console.log("Turn delivery on");

  }
  else {
       turnDeliveryOff();    
    console.log("Turn delivery off");

  }

});

capacity_toggle.addEventListener('change', function() {
  if (capacity_toggle.checked) {
    // Toggle is ON
    turnDeliveryCapacity();  
  } 
  else {
    turnDeliveryOn();        
  }
});



