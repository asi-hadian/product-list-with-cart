document.addEventListener("DOMContentLoaded", async () => {
const productsList = document.querySelector(".products");
const cartList = document.querySelector(".cart-item-list");
const yourCart = document.querySelector(".your-cart");
const cartTitle = document.querySelector(".cart-title");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");

// basketshop
const cart = [];
// render carts------------------------------------------
window.addEventListener("load", async () => {
  updateCartUI();
  const res = await fetch("../data/products.json");
  const product = await res.json();
  
  productsList.innerHTML = "";
  product.products.forEach((item) => {
    productsList.innerHTML += `
         <div
          class="products-card bg-white  shadow-sm rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="relative">
             <picture>
            <source media="(min-width: 1024px)" srcset="${item.image.desktop}">
            <source media="(min-width: 640px)" srcset="${item.image.tablet}">
            <img src="${item.image.mobile}" class="w-full h-64 object-cover">
          </picture>
            <button
              class=" add-to-cart-btn border border-gray-300 flex justify-center rounded-full w-48 absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white p-2 hover:border-red-700"
            data-id="${item.name}"
            data-price="${item.price}"
            data-name="${item.name}"
            data-image="${item.image.thumbnail}"
              >
             <img src="../assets/images/icon-add-to-cart.svg"/>
              <span class="font-bold hover:text-red-700 ml-2"> Add to cart</span>
            </button>
            
            <div class="counter-btn hidden border border-gray-300 w-48 absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-900 text-white p-2 rounded-full flex justify-between items-center">
            <button class="minus px-3 text-xl">-</button>
             <span class="count font-bold">1</span>
              <button class="plus px-3 text-xl">+</button>
             </div>
          </div>
          <div class="p-4 my-8 flex flex-col items-left">
            <p class="text-gray-400 py-2">${item.category}</p>
            <h4 class="font-bold text-[18px]">${item.name}</h4>
            <h3 class="text-red-700 font-bold py-2">$${item.price.toFixed(
              2
            )}</h3>
          </div>
        </div>
        `;
  });
});

document.addEventListener("click", (e) => {
  // -----------------------add to cart--------------------
  const addBtn = e.target.closest(".add-to-cart-btn");
  if (addBtn) {
    const card = addBtn.closest(".products-card");
    const counter = card.querySelector(".counter-btn");
    const countSpan = counter.querySelector(".count");

    addBtn.classList.add("hidden");
    counter.classList.remove("hidden");

    countSpan.textContent = 1;

    const name = addBtn.dataset.name;
    const price = parseFloat(addBtn.dataset.price);

    let existing = cart.find((p) => p.name === name);

    if (existing) {
      existing.count++;
    } else {
      cart.push({
        name: name,
        price: price,
        count: 1,
        image: addBtn.dataset.image,
      });
    }
    updateCartUI();
    return;
  }

  // ------------------ PLUS ------------------
  if (e.target.classList.contains("plus")) {
    const counter = e.target.closest(".counter-btn");
    const card = counter.closest(".products-card");
    const name = card.querySelector(".add-to-cart-btn").dataset.name;
    const countSpan = counter.querySelector(".count");

    let item = cart.find((p) => p.name === name);
    item.count++;
    countSpan.textContent = item.count;

    updateCartUI();
    return;
  }

  // ------------------ MINUS ------------------
  if (e.target.classList.contains("minus")) {
    const counter = e.target.closest(".counter-btn");
    const card = counter.closest(".products-card");
    const name = card.querySelector(".add-to-cart-btn").dataset.name;
    const countSpan = counter.querySelector(".count");

    let item = cart.find((p) => p.name === name);
    item.count--;

    if (item.count === 0) {
      cart.splice(cart.indexOf(item), 1);

      // برگشت به Add
      counter.classList.add("hidden");
      card.querySelector(".add-to-cart-btn").classList.remove("hidden");
    } else {
      countSpan.textContent = item.count;
    }

    updateCartUI();
    return;
  }

  // close products-----------
  if (e.target.classList.contains("close-product")) {
    const cartItem = e.target.closest(".cart-item-item");
    const name = cartItem.dataset.name;

    const index = cart.findIndex((p) => p.name === name);
    if (index !== -1) {
      cart.splice(index, 1);
    }

    // find the cart that is related to romoved cart
    const productCard = document
      .querySelector(`.add-to-cart-btn[data-name="${name}"]`)
      ?.closest(".products-card");

    if (productCard) {
      const addBtn = productCard.querySelector(".add-to-cart-btn");
      const counter = productCard.querySelector(".counter-btn");

      addBtn.classList.remove("hidden");
      counter.classList.add("hidden");
    }

    updateCartUI();
  }

  //  confirm order------------------------------------
  if (e.target.classList.contains("confirm-order")) {
    showModal();
  }

  // close modal---------------------------
  const closeBtn = e.target.closest(".close-modal");
  if (closeBtn || e.target.classList.contains("modal")) {
    modal.style.display = "none";
  }

  // newOrderBtn button-----------------
  if (e.target.classList.contains("newOrderBtn")) {
    cart.length = 0;
    modal.style.display = "none";
    document.querySelectorAll(".counter-btn").forEach((c) => {
      c.classList.add("hidden");
    });
    document.querySelectorAll(".add-to-cart-btn").forEach((c) => {
      c.classList.remove("hidden");
    });
    updateCartUI();
  }
});

function updateCartUI() {
  cartList.innerHTML = "";
  cartTitle.textContent = `Your Cart(${cart.length})`;

  if (cart.length === 0) {
    cartList.innerHTML = `
   <div class="cart-item-empty">
        <img src="../assets/images/illustration-empty-cart.svg" class="mx-auto my-8">
        <p class="text-center text-amber-800 text-lg">Your added items will appear here</p>
      </div>
    `;
  }

  let sum = 0;
  cart.forEach((item) => {
    const totalPrice = (item.count * item.price).toFixed(2);
    sum += item.count * item.price;
    cartList.innerHTML += `
    <div class="cart-item-item  flex-1 border-b-2 p-4" data-name="${item.name}">
    
          <div class="flex justify-between items-center p-2">
            <p class="text-xl font-bold">${item.name}</p>
            <i
              class=" close-product fa-regular fa-circle-xmark text-gray-400 hover:text-gray-900 text-xl cursor-pointer"
            ></i>
          </div>
         <div class="flex mb-1">
            <p class="text-red-700 text-xl font-bold">${item.count}x</p>
            <span class="ml-12">@$${item.price.toFixed(2)} </span> 
            <span class="ml-7"> $${totalPrice}</span>
          </div>
          
        
        
        </div>
      
    `;
  });

  if (cart.length > 0) {
    cartList.innerHTML += `
    <div class="flex justify-between items-center p-2 my-4 ">
          <p class="text-gray-500 text-xl">order total</p>
          <span class="font-bold text-3xl">$${sum.toFixed(2)}</span>
          </div>
              <div class="tree-card flex p-4 justify-center items-center rounded-lg bg-brand-light mt-4">
                <img src="../assets/images/icon-carbon-neutral.svg">
                <p class="ml-2 text-lg">
                    This is a <strong class="text-xl">carbon-neutral</strong> delivery
                </p>
            </div>

            <button
                type="submit"
                class="confirm-order bg-red-900 w-2/3 p-4 mx-[60px] my-8 text-white rounded-full text-xl cursor-pointer hover:bg-red-800 transition-shadow duration-300"
            >
                Confirm Order
            </button>
        `;
  }
}

function showModal() {
  const modalList = document.querySelector(".items");
  const modalTotal = document.querySelector(".total-order");
  modal.style.display = "block";
  modalList.innerHTML = " ";

  let sum = 0;
  cart.forEach((item) => {
    const totalPrice = (item.count * item.price).toFixed(2);
    sum += item.count * item.price;

    modalList.innerHTML += `
     <div class="item">
              <div class="img-item">
                <img
                  src="${item.image}"
                  class="img"
                />
              </div>
              <div class="item-info">
                <p class="item-name">${item.name}</p>
                <p class="item-price">
                  <span class="item-count">${item.count}x</span> @$${item.price}
                </p>
              </div>
                 <div>
              <p class="item-total">$${totalPrice}</p>
            </div>
            </div>
         
          
          `;
  });
  modalTotal.innerHTML = `
           <p>order total</p>
            <h2>$${sum.toFixed(2)}</h2>
          `;
}
})
