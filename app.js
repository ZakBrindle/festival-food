




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

// Create a basket object to store the selected items
const basket = {};

function removeItemFromBasket(foodItemId) {
  const basketItem = basket[foodItemId];
  if (basketItem) {
    basketItem.quantity -= 1;
    if (basketItem.quantity === 0) {
      delete basket[foodItemId];
    }
  }
  updateBasketDisplay();
}

function addToBasket(food, quantity, foodItemId, foodItem) {
  const selectedExtras = getSelectedExtras(food);
  const basketItemId = `${foodItemId}-${selectedExtras.join("-")}`;

  if (basket.hasOwnProperty(basketItemId)) {
    // Item with the same extras already exists in the basket, increment the quantity
    basket[basketItemId].quantity += quantity;
  } else {
    // Item does not exist in the basket, add it with the quantity and extras
    basket[basketItemId] = {
      food: food,
      quantity: quantity,
      extras: selectedExtras,
    };
  }

  // Reset the checkboxes after adding the item to the basket
  const extrasContainer = document.querySelectorAll(`.extras input[name="extras-${getFoodItemId(food)}"]`);
  extrasContainer.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Hide the elements by setting opacity to 0
  foodItem.childNodes.forEach((element) => {
    if (element.classList && element.classList.contains("added-message")) {
      return;
    }
    element.style.opacity = "0";
  });

  const addedMessage = foodItem.querySelector(".added-message");
  addedMessage.style.display = "block";

  // Set a timeout to restore the visibility of the elements after 1.5 seconds
  setTimeout(() => {
    // Restore opacity to 1 for the elements that were initially hidden
    foodItem.childNodes.forEach((element) => {
      if (element.classList && element.classList.contains("added-message")) {
        return;
      }
      element.style.opacity = "1";
    });
    addedMessage.style.display = "none";
  }, 1500);

  updateBasketDisplay();
  console.log(`Added to basket: ${food.name} (Quantity: ${quantity}) with Extras: ${selectedExtras.join(", ")}`);
}






function updateBasketDisplay() {
  const basketList = document.getElementById("basket-list");
  basketList.innerHTML = "";

  let totalPrice = 0;
  let itemCount = 0;

  Object.values(basket).forEach((basketItem) => {
    const foodItem = basketItem.food;
    const quantity = basketItem.quantity;
    const extras = basketItem.extras;

    const basketItemElement = document.createElement("li");
    basketItemElement.classList.add("basket-item");

    const itemNameElement = document.createElement("span");
    itemNameElement.classList.add("basket-item-name");
    itemNameElement.textContent = `${quantity}x ${foodItem.name}`;

    if (extras.length > 0) {
      const extrasText = document.createElement("span");
      extrasText.textContent = ` with ${extras.join(", ")}`;
      itemNameElement.appendChild(extrasText);
    }

    const removeIcon = document.createElement("span");
    removeIcon.innerHTML = "&#128465;";
    removeIcon.classList.add("remove-icon");
    removeIcon.style.fontSize = "50px";
    removeIcon.addEventListener("click", () => {
      removeItemFromBasket(getFoodItemId(foodItem) + "-" + extras.join("-"));
    });

    basketItemElement.appendChild(itemNameElement);
    basketItemElement.appendChild(removeIcon);
    basketList.appendChild(basketItemElement);

    // Calculate and accumulate the total price
    const itemPrice = foodItem.price * quantity;
    totalPrice += itemPrice;

    // Increment the item count
    itemCount += quantity;
  });

  // Display the total price in pounds (£)
  const totalPriceElement = document.createElement("div");
  totalPriceElement.textContent = `Total: £${totalPrice.toFixed(2)}`;
  totalPriceElement.classList.add("total-price");
  basketList.appendChild(totalPriceElement);

  // Update the basket count
  const basketCountElement = document.getElementById("basket-count");
  basketCountElement.textContent = itemCount;

  toggleBasketButtonVisibility();
}




function getSelectedExtras(food) {
  const extrasContainer = document.querySelectorAll(`.extras input[name="extras-${getFoodItemId(food)}"]:checked`);
  const selectedExtras = Array.from(extrasContainer.values()).map((checkbox) => checkbox.value);
  return selectedExtras;
}


// Call the updateBasketDisplay function initially to populate the basket display
updateBasketDisplay();

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

  const foodName = document.createElement("span");
  foodName.textContent = food.name;
  foodName.classList.add("food-name");
  const price = document.createElement("span");
  price.textContent = `£${food.price.toFixed(2)}`;
  price.classList.add("price");
  
  const extrasContainer = document.createElement("div");
  extrasContainer.classList.add("extras");
  
  food.extras.forEach((extra) => {
    const label = document.createElement("label");
    label.classList.add("extra-label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = `extras-${getFoodItemId(food)}`;
    checkbox.value = extra;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(extra));
    extrasContainer.appendChild(label);
  });
  
  foodItem.appendChild(foodName);
  foodItem.appendChild(price);
  foodItem.appendChild(extrasContainer);
  
  // Add a space under the extrasContainer
  const spaceDiv = document.createElement("div");
  spaceDiv.style.height = "20px"; // Adjust the height as needed
  foodItem.appendChild(spaceDiv);

   

  
  // Create the Stripe Buy button if buybuttonid exists
  if (food.buybuttonid) {
    const stripeBuyButton = createStripeBuyButton(food);
    foodItem.appendChild(stripeBuyButton);
  } else {
    // If buybuttonid doesn't exist, create the "Add to Basket" button
    const addToBasketButton = document.createElement("button");
    addToBasketButton.textContent = "Add to Basket";
    addToBasketButton.classList.add("add-to-basket-button");

    const addedMessage = document.createElement("span");
    addedMessage.textContent = "Added to basket 🛒";
    addedMessage.classList.add("added-message");
    foodItem.appendChild(addedMessage); // Add the "Added to basket" message initially (hidden by default)

    addToBasketButton.addEventListener("click", () => {
      addToBasket(food, 1, getFoodItemId(food), foodItem, addedMessage); // Pass the addedMessage element to the addToBasket function
    });

    foodItem.appendChild(addToBasketButton);
  }

  const spaceDiv2 = document.createElement("div");
  spaceDiv2.style.height = "30px"; // Adjust the height as needed
  foodItem.appendChild(spaceDiv2);

   // Create the item availability toggle
   const menuItemToggleContainer = document.createElement("div");
   menuItemToggleContainer.classList.add("menu-item-toggle-container");
   menuItemToggleContainer.style.display = "none"; // Hide the container initially
 
   const menuItemToggle = document.createElement("input");
   menuItemToggle.type = "checkbox";
   menuItemToggle.id = `menu-item-toggle-${index}`; // Unique id
   menuItemToggle.checked = true; // Checkbox is checked by default
   const menuItemToggleLabel = document.createElement("label");
   menuItemToggleLabel.htmlFor = `menu-item-toggle-${index}`; // Corresponding for attribute
   menuItemToggleLabel.textContent = "Item Available";
   
   menuItemToggleContainer.appendChild(menuItemToggle);
   menuItemToggleContainer.appendChild(menuItemToggleLabel);
 
   foodItem.appendChild(menuItemToggleContainer);
  

  foodItemWrapper.appendChild(foodImage);
  foodItemWrapper.appendChild(foodItem);
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

const deliveryAddresses = generateDeliveryAddresses();
  
  // Generate the delivery addresses dynamically
  function generateDeliveryAddresses() {
    const addresses = [];
    const letters = "ABCDEFG";
    const yurtsPerLetter = 20;
    const cardSuits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const cardValues = [
      "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10"
    ];
  
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      for (let j = 1; j <= yurtsPerLetter; j++) {
        const address = `Yurt ${letter}${j}`;
        addresses.push(address);
      }
    }
  
    cardSuits.forEach((suit) => {
      cardValues.forEach((value) => {
        const address = `Flag ${value} of ${suit}`;
        addresses.push(address);
      });
    });
  
    return addresses;
  }


  
  // Function to populate the delivery addresses based on the selected option
  function populateDeliveryAddresses() {
    const addressSelect = document.getElementById("delivery-address");
    const selectedOption = document.querySelector('input[name="address-type"]:checked').value;
    addressSelect.innerHTML = "";
  
    let filteredAddresses = [];
    if (selectedOption === "yurt") {
      filteredAddresses = deliveryAddresses.filter((address) => address.includes("Yurt"));
    } else if (selectedOption === "flag") {
      filteredAddresses = deliveryAddresses.filter((address) => address.includes("Flag"));
    }
  
    filteredAddresses.forEach((address) => {
      const option = document.createElement("option");
      option.text = address;
      addressSelect.appendChild(option);
    });
  }
  
 // Event listeners for address type selection and form submission
const addressTypeRadios = document.querySelectorAll('input[name="address-type"]');
addressTypeRadios.forEach((radio) => {
  radio.addEventListener("change", populateDeliveryAddresses);
});
const orderForm = document.getElementById("order");


// STRIPE PAYMENTS

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Retrieve the selected food and delivery address
  const foodSelection = document.getElementById("basket-list").value;
  const deliveryAddress = document.getElementById("delivery-address").value;

  // Process the order and display the confirmation to the user
  const confirmationCode = generateConfirmationCode();


  
  const totalPriceElement = document.querySelector(".total-price");
  const totalPriceText = totalPriceElement.textContent;
  const totalPriceValue = parseFloat(totalPriceText.replace("Total: £", "")) * 100;
 
  
  try {
    console.log("Making STRIPE request in app.js...");
    const stripe = Stripe('pk_live_51NVd2MEjWpAK8TuWU2ViGWscfzmVYt7KvTy2UoRWYR6KwJapFdGIwp3gzfZVnr8LPyqYhrOuoN3IVVof2J2NAqMW00GYLxjotP');
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: totalPriceValue,
        currency: 'gbp',
        description: `Order ${confirmationCode}`,
        confirmation_code: confirmationCode
      })
    });
  
    const { clientSecret } = await response.json();
  
    // Use the clientSecret to complete the payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });
  
    if (result.error) {
      console.error(result.error.message);
      alert('Payment failed. Please try again.');
    } else {
      alert(`Order placed successfully! Confirmation code: ${confirmationCode}`);
    }
  } catch (error) {
    console.error(error);
    alert('Payment failed. Please try again.');
  }
  


});





// Function to generate a random 5-digit confirmation code
function generateConfirmationCode() {
  return Math.floor(10000 + Math.random() * 90000);
}

// Function to initialize the page
function initializePage() {
  generateDeliveryAddresses();
  populateDeliveryAddresses();
}

// Call initializePage() on page load
window.addEventListener("load", initializePage);

function openItemPopup(food) {
  showItemPopup(food);

  const addToBasketButton = document.getElementById("add-to-basket-button");
  addToBasketButton.addEventListener("click", () => {
    addToBasket(food, 1, getFoodItemId(food));
  });
}

// END OF PAYMENT -------------



// Scroll to the basket section when the floating button is clicked
const scrollToBasketButton = document.getElementById("scroll-to-basket");
scrollToBasketButton.addEventListener("click", () => {
  const basketSection = document.getElementById("basket-section");
  basketSection.scrollIntoView({ behavior: "smooth" });
});

function toggleBasketButtonVisibility() {
  const basketButton = document.getElementById("floating-button");
  const totalPriceElement = document.querySelector(".total-price");
  const placeOrderElement = document.getElementById("checkout-button");
  const emptyBasketElement = document.querySelector(".empty-basket-element");


  if (Object.keys(basket).length === 0) {
    basketButton.style.display = "none";
    totalPriceElement.style.display = "none";
    placeOrderElement.style.display = "none";
    emptyBasketElement.style.display = "block";

    

  } else {
    basketButton.style.display = "block";
    totalPriceElement.style.display = "block";
    placeOrderElement.style.display = "block";
    emptyBasketElement.style.display = "none";


  }
}


// Call the toggleBasketButtonVisibility function initially to set the initial visibility
toggleBasketButtonVisibility();



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

    // MOVE THIS TO THE LOGIN, THIS SHOULD NOT BE AVAILABLE FOR GUESTS
    settingsContainer.style.display = "block";  // ONLY IN GUEST FOR TESTING
    showFoodToggles();  // --------------       // ONLY IN GUEST FOR TESTING
    
    document.getElementById("notification").style.display = "block";
    if (toggle.checked) {
    menu.style.display = "block";

    }
  });

  const logoutButton = document.getElementById("logout-button");


  logoutButton.addEventListener("click", function () {
    hideFoodToggles();
    loginContainer.style.display = "block";
    settingsContainer.style.display = "none";
    document.getElementById("notification").style.display = "block";
    if (toggle.checked) {
    menu.style.display = "block";
    }
   
  });



  const toggle = document.getElementById('delivery-toggle');
const statusElement = document.getElementById('status');
const menuItems = document.getElementById('menu');
const capacityToggleContainer = document.querySelector('.toggle-container-capacity');
const capacity_toggle = document.getElementById('capacity-toggle');


toggle.addEventListener('change', function() {
  if (toggle.checked) {
    // Toggle is ON
    statusElement.innerHTML = 'active';
    statusElement.style.color = 'green';
    menu.style.display = "block";
    capacityToggleContainer.style.display = "block";

  } else {
    // Toggle is OFF
    statusElement.innerHTML = 'offline';
    statusElement.style.color = 'red';
    menu.style.display = "none";
    capacityToggleContainer.style.display = "none";
    capacity_toggle.checked = false; // default to off
  }

});


capacity_toggle.addEventListener('change', function() {
  if (capacity_toggle.checked) {
    // Toggle is ON
    statusElement.innerHTML = 'at capacity';
    statusElement.style.color = 'orange';
    menu.style.display = "none";    

  } else {
    // Toggle is OFF
    statusElement.innerHTML = 'active';
    statusElement.style.color = 'green';
    menu.style.display = "block";
  }
});





  // Call the function to load Stripe and retrieve order details
  const orderId = 'pi_3NVgtPEjWpAK8TuW1DUyTZ0F';


   // Function to load Stripe script asynchronously
   function loadStripe(callback) {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = callback;
    document.body.appendChild(script);
  }

  // Function to retrieve order details
  async function getOrderDetails(orderId) {
    try {
      // Replace 'YOUR_STRIPE_API_KEY' with your actual Stripe API key
      const stripe = Stripe('pk_live_51NVd2MEjWpAK8TuWU2ViGWscfzmVYt7KvTy2UoRWYR6KwJapFdGIwp3gzfZVnr8LPyqYhrOuoN3IVVof2J2NAqMW00GYLxjotP');

      // Use the Stripe API to retrieve the order
      const order = await stripe.orders.retrieve(orderId);

      // Extract and display order details
      console.log('Order ID:', order.id);
      console.log('Amount:', order.amount);
      console.log('Currency:', order.currency);
      console.log('Status:', order.status);

      // Check if there are extra notes
      if (order.metadata && order.metadata.notes) {
        console.log('Extra Notes:', order.metadata.notes);
      } else {
        console.log('No extra notes found for this order.');
      }
    } catch (error) {
      console.error('Error retrieving order:', error.message);
    }
  }

 
  loadStripe(() => getOrderDetails(orderId));