let discordUser = null;

window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const token = fragment.get('access_token');

    if (token) {
        fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(user => {
            discordUser = user;
            document.getElementById('login-btn').classList.add('hidden');
            document.getElementById('user-info').classList.remove('hidden');
            document.getElementById('user-name').innerText = user.username;
            document.getElementById('user-avatar').src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
            
            // Odblokuj sklep
            document.querySelectorAll('.buy-btn').forEach(btn => btn.classList.remove('disabled'));
            document.getElementById('shop-msg').innerText = "Sklep odblokowany! Wybierz usługę.";
        });
    }
};

function buy(item) {
    if (!discordUser) return alert("Najpierw się zaloguj!");

    const webhookURL = "https://discordapp.com/api/webhooks/1483481974399041626/aq6VLpKbtxjqNb53AEWk7CjCAcXzvxeHbVxCYHU-uc3n8S-rKwz-TLOZQZ8pjedrfmSd";
    
    const message = {
        embeds: [{
            title: "NOWE ZAMÓWIENIE!",
            color: 16711756,
            fields: [
                { name: "Gracz", value: `${discordUser.username}#${discordUser.discriminator} (ID: ${discordUser.id})`, inline: true },
                { name: "Produkt", value: item, inline: true }
            ],
            timestamp: new Date()
        }]
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    }).then(() => {
        alert("Zamówienie wysłane! Administracja odezwie się na Discordzie.");
    });
}