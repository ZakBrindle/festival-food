




const publishable_key = "pk_live_51NVd2MEjWpAK8TuWU2ViGWscfzmVYt7KvTy2UoRWYR6KwJapFdGIwp3gzfZVnr8LPyqYhrOuoN3IVVof2J2NAqMW00GYLxjotP";

// Sample data for food items and delivery addresses
const foodOptions = [
  {
    name: "Mexican Burrito",
    price: 20,
    image: "mexican-burrito.jpg",
    extras: [" Jalapenos", " No Jalapenos"],
    buybuttonid: "buy_btn_1NVfgmEjWpAK8TuWIK5DVM0v",

  },
  {
    name: "Flame Grilled Pizza",
    price: 20,
    image: "flame-grilled-pizza.jpg",
    extras: [" Margarita", " Chicken", " Sweetcorn", " All the veggies", " Meat Feast"],
    buybuttonid: "buy_btn_1NVgBYEjWpAK8TuWfE0fxXAp",
  },
  {
    name: "Cheeseburger and Chips",
    price: 20,
    image: "cheeseburger-and-chips.jpg",
    extras: [" Onions", " No Onions", " Red Sauce", " Brown Sauce", " BBQ Sauce"],
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
  },
  {
    name: "Hot Chocolate",
    price: 8,
    image: "hot-chocolate.jpg",
    extras: [],
  },
  {
    name: "Latte",
    price: 8,
    image: "tea.jpg",
    extras: [" Milk", " No Milk", " Sugar", " Brown Suger", " Caramel", " Vanilla", " Hazelnut" ],
    buybuttonid: "buy_btn_1NVg3kEjWpAK8TuW9H8SInRY",
  },
  {
    name: "Flat White",
    price: 8,
    image: "tea.jpg",
    extras: [" Milk", " No Milk", " Sugar", " Brown Suger"],
    buybuttonid: "buy_btn_1NVg3kEjWpAK8TuW9H8SInRY",
  },
  {
    name: "Cup of Tea",
    price: 8,
    image: "tea.jpg",
    extras: [" Milk", " No Milk", " Sugar", " Brown Suger"],
    buybuttonid: "buy_btn_1NVg3kEjWpAK8TuW9H8SInRY",
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

function createFoodItem(food) {
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

  

  foodItemWrapper.appendChild(foodImage);
  foodItemWrapper.appendChild(foodItem);
  return foodItemWrapper;
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
foodOptions.forEach((food) => {
  const foodItem = createFoodItem(food);
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



