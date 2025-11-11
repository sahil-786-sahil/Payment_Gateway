document.addEventListener("DOMContentLoaded", function () {
  // Menu data
  const menuData = {
    juice: [
      { name: "Orange Juice", price: 50, icon: "🍊", category: "juice" },
      { name: "Mango Juice", price: 60, icon: "🥭", category: "juice" },
      { name: "Apple Juice", price: 55, icon: "🍎", category: "juice" },
      { name: "Watermelon Juice", price: 45, icon: "🍉", category: "juice" },
      { name: "Pineapple Juice", price: 65, icon: "🍍", category: "juice" },
      { name: "Mixed Fruit Juice", price: 70, icon: "🍹", category: "juice" },
    ],
    fastfood: [
      { name: "Veg Burger", price: 80, icon: "🍔", category: "fastfood" },
      { name: "Cheese Burger", price: 100, icon: "🍔", category: "fastfood" },
      { name: "Pizza Slice", price: 90, icon: "🍕", category: "fastfood" },
      { name: "Full Pizza", price: 250, icon: "🍕", category: "fastfood" },
      { name: "Sandwich", price: 60, icon: "🥪", category: "fastfood" },
      {
        name: "Grilled Sandwich",
        price: 80,
        icon: "🥪",
        category: "fastfood",
      },
    ],
    snacks: [
      { name: "Veg Patties", price: 30, icon: "🥟", category: "snacks" },
      { name: "Samosa", price: 20, icon: "🥟", category: "snacks" },
      { name: "French Fries", price: 50, icon: "🍟", category: "snacks" },
      { name: "Pav Bhaji", price: 70, icon: "🍛", category: "snacks" },
      { name: "Chaat", price: 40, icon: "🥘", category: "snacks" },
      { name: "Momos", price: 60, icon: "🥟", category: "snacks" },
    ],
  };

  let cart = [];

  // Display menu items
  function displayMenu(category = "all") {
    const menuContainer = document.getElementById("menuItems");
    menuContainer.innerHTML = "";

    const items =
      category === "all"
        ? [...menuData.juice, ...menuData.fastfood, ...menuData.snacks]
        : menuData[category] || [];

    items.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "menu-item";
      itemDiv.innerHTML = `
                <div class="menu-item-icon">${item.icon}</div>
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">₹${item.price}</div>
                <button class="add-btn" onclick="addToCart('${item.name}', ${item.price}, '${item.icon}')">
                    <i class="fas fa-plus"></i> Add to Cart
                </button>
            `;
      menuContainer.appendChild(itemDiv);
    });
  }

  // Category buttons
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const category = this.dataset.category;
      displayMenu(category);
    });
  });

  // Add to cart function (global scope for onclick)
  window.addToCart = function (name, price, icon) {
    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, icon, quantity: 1 });
    }
    updateCart();
  };

  // Update cart display
  function updateCart() {
    const cartContainer = document.getElementById("cartItems");

    if (cart.length === 0) {
      cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 40px; margin-bottom: 10px;"></i>
                    <p>No items in cart. Add items from menu!</p>
                </div>
            `;
    } else {
      cartContainer.innerHTML = cart
        .map(
          (item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.icon} ${item.name}</div>
                        <div class="cart-item-price">₹${item.price} × ${item.quantity}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        <button class="remove-btn" onclick="removeItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `
        )
        .join("");
    }

    updatePricing();
  }

  // Update quantity (global scope)
  window.updateQuantity = function (index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    updateCart();
  };

  // Remove item (global scope)
  window.removeItem = function (index) {
    cart.splice(index, 1);
    updateCart();
  };

  // Update pricing
  function updatePricing() {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById("tax").textContent = `₹${tax.toFixed(2)}`;
    document.getElementById("total").textContent = `₹${total.toFixed(2)}`;
    document.getElementById(
      "payButton"
    ).innerHTML = `<i class="fas fa-lock"></i> Place Order ₹${Math.round(total)}`;
  }

  // Payment handler
  document.getElementById("payButton").addEventListener("click", function () {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Reset validation
    document.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("error");
    });

    let hasError = false;
    if (!name) {
      document.getElementById("name").parentElement.classList.add("error");
      hasError = true;
    }
    if (!email || !isValidEmail(email)) {
      document.getElementById("email").parentElement.classList.add("error");
      hasError = true;
    }
    if (!phone || !isValidPhone(phone)) {
      document
        .getElementById("phone")
        .parentElement.parentElement.classList.add("error");
      hasError = true;
    }
    if (cart.length === 0) {
      alert("Please add items to your cart before placing an order.");
      return;
    }

    if (hasError) {
      shakeButton();
      alert("Please fill all required fields correctly.");
      return;
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.05;
    const total = Math.round(subtotal + tax);

    const payButton = this;
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    payButton.disabled = true;

    // Create order items string
    const orderItems = cart
      .map((item) => `${item.name} (${item.quantity})`)
      .join(", ");

    // Create Razorpay order via backend
    fetch("http://localhost:8080/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        courseName: `A-One Juice & Fast Food - ${orderItems}`,
        amount: total,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const razorpayOrderId = data.id;

        const options = {
          key: "rzp_test_RdhNT1BUM6CROU", // Your Razorpay test key
          amount: total * 100,
          currency: "INR",
          name: "A-One Juice & Fast Food Centre",
          description: "Online Food Order",
          image:
            "https://d3fu8elvld6rb5.cloudfront.net/codeforsuccess.in/img/spark3-bannner.jpg",
          order_id: razorpayOrderId,
          theme: {
            color: "#4f46e5",
          },
          prefill: {
            name: name,
            email: email,
            contact: phone,
          },
          notes: {
            order_items: orderItems,
          },
          modal: {
            backdropclose: false,
            escape: false,
            ondismiss: function () {
              payButton.innerHTML = `<i class="fas fa-lock"></i> Place Order ₹${total}`;
              payButton.disabled = false;
            },
          },
          handler: function (response) {
            // On success: update backend
            fetch("http://localhost:8080/api/payment/update-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                status: "SUCCESS",
              }),
            })
              .then(() => {
                payButton.innerHTML =
                  '<i class="fas fa-check"></i> Order Successful!';
                payButton.style.background =
                  "linear-gradient(to right, #10b981, #059669)";
                alert(
                  `🎉 Thank you for your order!\nYour payment of ₹${total} was successful.\n\nOrder Details:\n${cart
                    .map((item) => `${item.icon} ${item.name} x${item.quantity}`)
                    .join("\n")}\n\nYour order will be ready soon!`
                );

                // Clear cart after successful payment
                cart = [];
                updateCart();

                setTimeout(() => {
                  payButton.innerHTML =
                    '<i class="fas fa-lock"></i> Place Order ₹0';
                  payButton.style.background =
                    "linear-gradient(to right, #4f46e5, #6366f1)";
                  payButton.disabled = false;
                }, 3000);
              })
              .catch(() => {
                alert("Payment succeeded but failed to update backend.");
                payButton.innerHTML = `<i class="fas fa-lock"></i> Place Order ₹${total}`;
                payButton.disabled = false;
              });
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
        payButton.disabled = false;
        payButton.innerHTML = `<i class="fas fa-lock"></i> Place Order ₹${total}`;
      });
  });

  // Helper functions
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
  }

  function shakeButton() {
    const payButton = document.getElementById("payButton");
    payButton.classList.add("shake");
    setTimeout(() => {
      payButton.classList.remove("shake");
    }, 500);
  }

  // Initialize
  displayMenu();
  updateCart();
});