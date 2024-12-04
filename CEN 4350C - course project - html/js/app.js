const loginForm = document.getElementById("login-form");
const regForm = document.getElementById("registration-form");

function openForm() {
  loginForm.style.display = "flex";

  setTimeout(() => {
    loginForm.style.top = "60px";
  }, 100);

}

function closeForm() {
  loginForm.style.top = "-1300px";

  setTimeout(() => {
    loginForm.style.display = "none";
  }, 100);

}

function openRegistration() {
  regForm.style.display = "flex";

  setTimeout(() => {
    regForm.style.top = "60px";
  }, 250);
}

function closeRegistration() {
  regForm.style.top = "-1300px";

  setTimeout(() => {
    regForm.style.display = "none";
  }, 100);
}

window.onclick = function(event) {
  const accountIcon = document.getElementById("account-icon");
  const regButton = document.getElementById("registration-popup");

  const isPopupVisible = window.getComputedStyle(loginForm).display !== "none";
  const isRegistrationVisible = window.getComputedStyle(regForm).display !== "none";

  if(!isPopupVisible && accountIcon.contains(event.target)) {
    openForm()
  }

  if (isPopupVisible && accountIcon.contains(event.target)) {
    closeForm();
  }

  if (isPopupVisible && !loginForm.contains(event.target)){
    closeForm();
  }

  if (!isRegistrationVisible && regButton.contains(event.target)) {
    closeForm();
    openRegistration();
  }

  if (isRegistrationVisible && !regForm.contains(event.target) && !accountIcon.contains(event.target)) {
    closeRegistration();
  }

  if (isRegistrationVisible && accountIcon.contains(event.target)) {
      closeRegistration();
      openForm();
  }
}

let cartCount = 0;
function addToCart() {
  console.log("adding item to cart");
  cartCount++;
  const cartQuantity = document.getElementById("cart-count");

  if (cartCount > 10) {
    document.getElementById("cart-count").style.fontSize = "10px";
    cartQuantity.textContent = 10 + "+";
  } else  {
    cartQuantity.textContent = cartCount.toString();
  }

  if (cartCount > 0) {
    cartQuantity.classList.add("active");
  } else {
    cartQuantity.classList.remove("active");
  }
}

document.querySelector('.add-to-cart').addEventListener("click", addToCart);

function Product(pid, productName, productDescription){
  this.pid = pid;
  this.productName = productName;
  this.productDescription = productDescription;
}

let productInformation = [];

function fetchProductData() {
    return fetch('/get-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response failed');
            }
            return response.json();
        })
        .then(data => {
            productInformation = data;
        })
        .catch(error => {
            console.error('There was a problem with the fetching table data:', error);
        });
}

function loadProductData(productInformation) {
  if (productInformation.length > 0) {
    productInformation.forEach((product, index) => {
      const productDetails = document.getElementById(`product-${index + 1}`);


      if (productDetails) {
        const productName = productDetails.querySelector('.product-name');
        const productDescription = productDetails.querySelector('.product-description');
        const productPrice = productDetails.querySelector('.product-price');

        productName.textContent = product.name;
        productDescription.textContent = product.description;
        productPrice.textContent = product.price;
      }
    });
  } else {
      console.log('No product information found.');
  }
}

function loadNewsletter() {
  const form = document.getElementById('newsletter-signup-form');

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      console.log("Newsletter button pressed");

      const email = document.getElementById('email-input').value;
      console.log("Submitting email:", email);
      fetch('/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          alert('Thank you for subscribing to our newsletter! You will now begin to receive emails with product updates and events.');

          document.getElementById('email-input').value = '';
        })
        .catch((error) => {
          console.error('Newsletter error:', error);
        });
    });
  } else {
    console.error("Form not found!");
  }
}

regForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("registration-email").value;
  const password = document.getElementById("registration-psw").value;

  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message);
      } else {
        alert(data.error || "Registration error");
      }
    })
    .catch(error => console.error("Registration failure: ", error))
});

loginForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("psw").value;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = "/login-success";
      } else {
        alert(data.error || "User login error");
      }
    })
    .catch(error => console.error("Login failure: ", error))
});

document.addEventListener('DOMContentLoaded', (event) => {
  fetchProductData().then( () => {
    loadProductData(productInformation)
  });
  loadNewsletter();
});
