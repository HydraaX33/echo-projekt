let discordUser = null;

window.onload = () => {
    // Sprawdzanie tokenu w adresie po powrocie z Discorda
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const token = fragment.get('access_token');

    if (token) {
        fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(user => {
            discordUser = user;
            // Zmiana UI po zalogowaniu
            document.getElementById('login-btn').classList.add('hidden');
            document.getElementById('user-info').classList.remove('hidden');
            document.getElementById('user-name').innerText = user.username.toUpperCase();
            document.getElementById('user-avatar').src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
            
            // Odblokowanie sklepu
            document.querySelectorAll('.buy-btn').forEach(btn => btn.classList.remove('disabled'));
            document.getElementById('shop-msg').innerText = "Witaj! Sklep jest gotowy.";
            document.getElementById('shop-msg').style.color = "#00ff88";
        })
        .catch(err => console.error("Błąd logowania:", err));
    }
};

function buy(item) {
    if (!discordUser) return alert("Musisz się zalogować przez Discord!");

    // TUTAJ WKLEJ SWÓJ WEBHOOK Z KANAŁU DISCORD
    const webhookURL = "https://discordapp.com/api/webhooks/1483481974399041626/aq6VLpKbtxjqNb53AEWk7CjCAcXzvxeHbVxCYHU-uc3n8S-rKwz-TLOZQZ8pjedrfmSd";
    
    const message = {
        embeds: [{
            title: "🛒 NOWE ZAMÓWIENIE - WARSZAWSKI PROJEKT",
            color: 16711756,
            fields: [
                { name: "👤 Klient", value: `${discordUser.username} (ID: ${discordUser.id})`, inline: true },
                { name: "📦 Usługa", value: item, inline: true }
            ],
            footer: { text: "System Automatyczny WP" },
            timestamp: new Date()
        }]
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    }).then(() => {
        alert("Zgłoszenie wysłane! Administracja wkrótce się odezwie.");
    }).catch(() => {
        alert("Błąd wysyłania. Sprawdź Webhook!");
    });
}
