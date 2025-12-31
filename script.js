let cart = [];

function openFolder(category, element) {
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
    const display = document.getElementById('menu-display');
    display.innerHTML = '';
    
    menuItems.filter(i => i.category === category).forEach(item => {
        let toppingsHTML = `<div class="toppings-box"><strong>بەهێزکەرەکان:</strong>`;
        toppingsList.forEach(t => {
            toppingsHTML += `
                <label class="topping-item">
                    <input type="checkbox" class="top-input-${item.id}" data-name="${t.name}" data-price="${t.price}"> 
                    ${t.name} (+${t.price}د)
                </label>`;
        });
        toppingsHTML += `</div>`;

        display.innerHTML += `
            <div class="item-card">
                <img src="${item.img}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <span class="ingredients">${item.ingredients}</span>
                    ${toppingsHTML}
                    <span class="price">${item.price.toLocaleString()} دینار</span>
                </div>
                <button class="add-btn" onclick="addToCart(${item.id})">زیادکردن +</button>
            </div>`;
    });
}

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const selectedToppings = [];
    let extraPrice = 0;

    document.querySelectorAll(`.top-input-${itemId}:checked`).forEach(input => {
        selectedToppings.push(input.getAttribute('data-name'));
        extraPrice += parseInt(input.getAttribute('data-price'));
    });

    cart.push({ ...item, finalPrice: item.price + extraPrice, extras: selectedToppings });
    document.querySelectorAll(`.top-input-${itemId}`).forEach(i => i.checked = false);
    renderCart();
}

function renderCart() {
    const cartDiv = document.getElementById('cart-items');
    let total = 0; cartDiv.innerHTML = '';

    cart.forEach((item, index) => {
        total += item.finalPrice;
        cartDiv.innerHTML += `
            <div class="cart-item">
                <button class="remove-btn" onclick="removeFromCart(${index})">لادان</button>
                <strong>${item.name}</strong> - ${item.finalPrice}د
                ${item.extras.length > 0 ? `<span class="cart-item-extras">+ ${item.extras.join(', ')}</span>` : ''}
            </div>`;
    });

    document.getElementById('total-amount').innerText = total.toLocaleString();
    const fCart = document.getElementById('floating-cart');
    if(cart.length > 0) {
        fCart.style.display = 'flex';
        document.getElementById('floating-count').innerText = cart.length;
        document.getElementById('floating-total').innerText = total.toLocaleString() + "د";
    } else { fCart.style.display = 'none'; }
}

function removeFromCart(index) { cart.splice(index, 1); renderCart(); }

function sendToWhatsApp() {
    if(cart.length === 0) return alert("سەبەتەکە بەتاڵە!");
    let txt = `📦 *داواکاری نوێ لە ئەپی Boom's Pizza*\n\n`;
    cart.forEach(item => {
        txt += `🔹 *${item.name}* (${item.finalPrice}د)\n`;
        if(item.extras.length > 0) txt += `   ▫️ زیادکراو: ${item.extras.join(', ')}\n`;
    });
    txt += `\n💰 *کۆی گشتی:* ${document.getElementById('total-amount').innerText} دینار`;
    window.location.href = `https://wa.me/9647861995417?text=${encodeURIComponent(txt)}`;
}

// Snow effect
setInterval(() => {
    const s = document.createElement('div');
    s.className = 'snowflake';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDuration = (Math.random() * 3 + 2) + 's';
    s.innerText = '❄';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 5000);
}, 300);

document.addEventListener('DOMContentLoaded', () => {
    openFolder('pizza', document.querySelector('.cat-card'));
});
