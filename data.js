<!DOCTYPE html>
<html lang="ku" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Boom's Pizza | مێنۆی بەڕێوەبەر</title>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">
    
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-database-compat.js"></script>

    <style>
        :root { --primary-red: #ff3131; --dark-bg: #0a0a0a; --card-bg: #161616; --text-gold: #ffc107; --whatsapp-green: #25D366; }
        body { font-family: 'Vazirmatn', sans-serif; margin: 0; background-color: var(--dark-bg); color: #ffffff; direction: rtl; overflow-x: hidden; }
        
        .admin-nav { display: flex; background: #000; border-bottom: 1px solid var(--primary-red); position: sticky; top: 0; z-index: 5000; }
        .nav-link { flex: 1; padding: 12px; text-align: center; cursor: pointer; font-size: 0.9rem; font-weight: bold; color: #666; transition: 0.3s; }
        .nav-link.active { color: var(--primary-red); border-bottom: 3px solid var(--primary-red); background: #111; }

        header { background-image: linear-gradient(to bottom, rgba(0,0,0,0.4), var(--dark-bg)), url('https://i.postimg.cc/02R8rCjV/99999999.jpg'); background-size: cover; background-position: center; height: 180px; display: flex; flex-direction: column; justify-content: center; align-items: center; border-bottom: 4px solid var(--primary-red); }
        header h1 { font-size: 2.5rem; color: var(--text-gold); text-shadow: 2px 2px 10px #000; margin: 0; }

        .category-container { display: flex; overflow-x: auto; padding: 15px; gap: 15px; background: var(--dark-bg); border-bottom: 1px solid #222; }
        .cat-card { min-width: 85px; text-align: center; cursor: pointer; }
        .cat-card img { width: 65px; height: 65px; border-radius: 50%; border: 2px solid #333; object-fit: cover; transition: 0.3s; }
        .cat-card.active img { border-color: var(--primary-red); transform: scale(1.1); box-shadow: 0 0 15px var(--primary-red); }

        .menu-section { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 15px; }
        .item-card { background: var(--card-bg); border-radius: 15px; overflow: hidden; border: 1px solid #222; position: relative; display: flex; flex-direction: column; }
        .item-card img { width: 100%; height: 120px; object-fit: cover; }
        
        .discount-badge { position: absolute; top: 8px; left: 8px; background: var(--primary-red); color: white; padding: 3px 8px; border-radius: 6px; font-weight: bold; font-size: 0.75rem; z-index: 5; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }

        .item-info { padding: 10px; text-align: center; flex-grow: 1; }
        .item-info h3 { margin: 5px 0; font-size: 1rem; color: #fff; }
        .add-btn { background: var(--primary-red); color: #fff; border: none; padding: 10px; border-radius: 10px; font-weight: bold; margin: 10px; cursor: pointer; font-family: 'Vazirmatn'; }

        #cart-section { background: #111; border-radius: 20px; padding: 20px; margin: 20px 15px 100px; border: 1px solid #333; }
        .order-input { width: 100%; padding: 12px; margin-top: 10px; border-radius: 10px; border: 1px solid #333; background: #222; color: white; font-family: 'Vazirmatn'; box-sizing: border-box; }
        
        .whatsapp-btn { background: var(--whatsapp-green); color: white; padding: 16px; border-radius: 50px; width: 100%; border: none; font-weight: bold; cursor: pointer; font-size: 1rem; font-family: 'Vazirmatn'; margin-top: 15px; }

        .bottom-bar { position: fixed; bottom: 15px; left: 15px; right: 15px; background: var(--primary-red); padding: 15px; border-radius: 50px; display: none; justify-content: space-between; z-index: 2000; box-shadow: 0 5px 20px rgba(0,0,0,0.5); }
        
        .page { display: none; }
        .page.active { display: block; }
    </style>
</head>
<body>

<div class="admin-nav">
    <div class="nav-link active" onclick="switchPage('main-site', this)">🏠 مێنۆ</div>
    <div class="nav-link" onclick="handleAdminAccess('orders-site', this)">📋 داواکارییەکان</div>
    <div class="nav-link" onclick="handleAdminAccess('edit-site', this)">⚙️ دەستکاری</div>
</div>

<div id="main-site" class="page active">
    <header>
        <h1>Boom's Pizza</h1>
    </header>

    <div class="category-container" id="category-bar">
        <div class="cat-card active" onclick="loadFirebaseMenu('pizza', this)"><img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150"><p>پیتزا</p></div>
        <div class="cat-card" onclick="loadFirebaseMenu('burger', this)"><img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150"><p>بەرگر</p></div>
        <div class="cat-card" onclick="loadFirebaseMenu('shawarma', this)"><img src="https://i.postimg.cc/Pr91C9Z7/arabic-chicken-shawarma-sandwich-recipe-1747792750.jpg"><p>شاوەرمە</p></div>
        <div class="cat-card" onclick="loadFirebaseMenu('drink', this)"><img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150"><p>خواردنەوە</p></div>
    </div>

    <div class="menu-section" id="menu-display"></div>

    <div id="cart-section">
        <h3 style="color:var(--text-gold); margin-top:0;">🛒 سەبەتەکەت</h3>
        <div id="cart-items"></div>
        <textarea id="order-note" class="order-input" rows="2" placeholder="تێبینی بۆ داواکاری..."></textarea>
        <div style="text-align:center; margin:20px 0; font-size:1.4rem; font-weight:bold;">کۆ: <span id="total-amount">0</span> د.ع</div>
        <button class="whatsapp-btn" id="sendBtn" onclick="sendToWhatsApp()">ناردنی داواکاری و لۆکەیشن ✅</button>
    </div>
</div>

<div id="edit-site" class="page" style="padding:20px;">
    <div style="background:#111; padding:20px; border-radius:20px; border:1px solid #333;">
        <h3 style="color:var(--text-gold);">➕ زیادکردنی خواردن</h3>
        <input type="text" id="adm-name" class="order-input" placeholder="ناوی خواردن">
        <input type="number" id="adm-price" class="order-input" placeholder="نرخی سەرەکی">
        <input type="number" id="adm-disc" class="order-input" placeholder="نرخی داشکان (ئەگەر هەیە)">
        <input type="text" id="adm-img" class="order-input" placeholder="لێنکی وێنە (Image URL)">
        <select id="adm-cat" class="order-input">
            <option value="pizza">پیتزا</option>
            <option value="burger">بەرگر</option>
            <option value="shawarma">شاوەرمە</option>
            <option value="drink">خواردنەوە</option>
        </select>
        <button class="add-btn" style="width:100%; margin-top:20px; background:var(--whatsapp-green);" onclick="uploadItem()">پاشەکەوتکردن</button>
    </div>
    <div id="admin-items-list" style="margin-top:30px;"></div>
</div>

<div id="orders-site" class="page" style="padding:20px;">
    <h3>📦 لیستنی داواکارییەکان</h3>
    <div id="firebase-orders"></div>
</div>

<div class="bottom-bar" id="floating-cart" onclick="document.getElementById('cart-section').scrollIntoView({behavior:'smooth'})">
    <span id="f-count">0</span>
    <span>سەبەتە 🛒</span>
    <span id="f-total">0</span>
</div>

<script>
    const firebaseConfig = {
        apiKey: "AIzaSyDqoOjm4m1Fxp760mJPy0sv5_NjaJfkm7g",
        authDomain: "boompizza-5d048.firebaseapp.com",
        databaseURL: "https://boompizza-5d048-default-rtdb.firebaseio.com",
        projectId: "boompizza-5d048",
        storageBucket: "boompizza-5d048.firebasestorage.app",
        messagingSenderId: "636068289590",
        appId: "1:636068289590:web:41fe758906140c700ecc97"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    let cart = [];

    function switchPage(id, btn) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        btn.classList.add('active');
        if(id === 'edit-site') fetchAdminList();
    }

    function handleAdminAccess(id, btn) {
        if(prompt("پاسوۆرد داخڵ بکە:") === "1998a") switchPage(id, btn);
        else alert("پاسوۆرد هەڵەیە!");
    }

    function uploadItem() {
        const name = document.getElementById('adm-name').value;
        const price = parseInt(document.getElementById('adm-price').value);
        const disc = document.getElementById('adm-disc').value;
        const img = document.getElementById('adm-img').value;
        const cat = document.getElementById('adm-cat').value;

        if(name && price) {
            db.ref('menu_items').push({
                name, price, 
                discount: disc ? parseInt(disc) : null,
                img: img || 'https://via.placeholder.com/150',
                category: cat
            }).then(() => {
                alert("بە سەرکەوتوویی زیاد کرا");
                fetchAdminList();
            });
        }
    }

    function loadFirebaseMenu(cat, el) {
        if(el) {
            document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
        }
        db.ref('menu_items').orderByChild('category').equalTo(cat).on('value', snap => {
            const display = document.getElementById('menu-display');
            display.innerHTML = '';
            snap.forEach(child => {
                const item = child.val();
                let priceHTML = `<div style="color:var(--text-gold); font-weight:bold; font-size:1.1rem;">${item.price.toLocaleString()} د.ع</div>`;
                let badge = "";
                if(item.discount && item.discount < item.price) {
                    const pct = Math.round(((item.price - item.discount) / item.price) * 100);
                    badge = `<div class="discount-badge">%${pct} داشکان</div>`;
                    priceHTML = `<div style="text-decoration:line-through; color:#666; font-size:0.8rem;">${item.price.toLocaleString()}</div>
                                 <div style="color:var(--text-gold); font-weight:bold; font-size:1.1rem;">${item.discount.toLocaleString()} د.ع</div>`;
                }
                display.innerHTML += `
                    <div class="item-card">
                        ${badge}
                        <img src="${item.img}">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            ${priceHTML}
                        </div>
                        <button class="add-btn" onclick="addToCart('${item.name}', ${item.discount || item.price})">زیادکردن +</button>
                    </div>`;
            });
        });
    }

    function addToCart(name, price) {
        cart.push({name, price});
        updateCart();
    }

    function updateCart() {
        const list = document.getElementById('cart-items');
        let total = 0; list.innerHTML = '';
        cart.forEach((item, index) => {
            total += item.price;
            list.innerHTML += `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #222;">
                <span>${item.name}</span>
                <span>${item.price.toLocaleString()} <button onclick="cart.splice(${index},1); updateCart();" style="color:red; background:none; border:none; padding-right:10px;">X</button></span>
            </div>`;
        });
        document.getElementById('total-amount').innerText = total.toLocaleString();
        document.getElementById('floating-cart').style.display = cart.length > 0 ? 'flex' : 'none';
        document.getElementById('f-count').innerText = cart.length;
        document.getElementById('f-total').innerText = total.toLocaleString();
    }

    // --- سیستەمی لۆکەیشن بۆ هەردوو سیستەم ---
    function sendToWhatsApp() {
        if(cart.length === 0) return alert("سەبەتەکە بەتاڵە!");
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.innerText = "⏳ چاوەڕێ بکە..."; sendBtn.disabled = true;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                // بەستەرێک کە لەسەر Android و iOS هەردووکیان کار دەکات
                const loc = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
                processFinalOrder(loc);
            }, () => {
                alert("تکایە لۆکەیشنەکەت کارا بکە تاوەکو شوێنەکەتمان بۆ بێت.");
                processFinalOrder("📍 لۆکەیشن دیاری نەکراوە");
            });
        } else {
            processFinalOrder("📍 لۆکەیشن پشتگیری ناکرێت");
        }
    }

    function processFinalOrder(locationLink) {
        const orderID = Math.floor(1000 + Math.random() * 9000);
        const note = document.getElementById('order-note').value || "نییە";
        const itemsTxt = cart.map(i => i.name).join(', ');
        const total = document.getElementById('total-amount').innerText;
        
        const orderData = {
            orderID: orderID,
            items: itemsTxt,
            total: total,
            location: locationLink,
            note: note,
            time: new Date().toLocaleString('ku-IQ')
        };

        db.ref('orders/' + orderID).set(orderData).then(() => {
            let txt = `🆔 *داواکاری: #${orderID}*\n🍕 *خواردن:* ${itemsTxt}\n💰 *کۆی گشتی:* ${total} دینار\n📝 *تێبینی:* ${note}\n📍 *شوێن:* ${locationLink}`;
            window.location.href = `https://wa.me/9647504629237?text=${encodeURIComponent(txt)}`;
            document.getElementById('sendBtn').innerText = "ناردنی داواکاری و لۆکەیشن ✅";
            document.getElementById('sendBtn').disabled = false;
        });
    }

    function fetchAdminList() {
        db.ref('menu_items').on('value', snap => {
            const list = document.getElementById('admin-items-list');
            list.innerHTML = '<h4>بەڕێوەبردنی ئایتمەکان:</h4>';
            snap.forEach(child => {
                const item = child.val();
                list.innerHTML += `<div style="background:#222; padding:10px; border-radius:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div><b>${item.name}</b></div>
                    <button onclick="db.ref('menu_items/${child.key}').remove()" style="background:red; color:white; border:none; padding:5px 10px; border-radius:5px;">سڕینەوە</button>
                </div>`;
            });
        });
    }

    db.ref('orders').on('value', snap => {
        const list = document.getElementById('firebase-orders');
        list.innerHTML = '';
        snap.forEach(child => {
            const d = child.val();
            list.innerHTML += `<div style="background:#1a1a1a; padding:15px; border-radius:15px; margin-bottom:10px; border-right:5px solid var(--primary-red);">
                <b>#${d.orderID}</b> - ${d.time}<br>
                🛒 ${d.items}<br>
                💵 ${d.total} د.ع<br>
                📍 <a href="${d.location}" target="_blank" style="color:cyan;">بینینی شوێن</a><br>
                <button onclick="db.ref('orders/${child.key}').remove()" style="color:red; background:none; border:none; margin-top:10px;">🗑️ سڕینەوە</button>
            </div>`;
        });
    });

    window.onload = () => loadFirebaseMenu('pizza');
</script>
</body>
</html>
