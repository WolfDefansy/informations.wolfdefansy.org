const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;


// Pour servir les fichiers statiques (CSS, images, etc.)
app.use("/public", express.static('public'));

// Route principale
app.get('/', (req, res) => {
    const file = path.join(__dirname, 'views/index.html');
    let content = fs.readFileSync(file, 'utf8');
    return res.send(injector(content));
});


app.get('/contact', (req, res) => {
    const file = path.join(__dirname, 'views/contact.html');
    let content = fs.readFileSync(file, 'utf8');
    return res.send(injector(content));
});

app.get('/partenariats', (req, res) => {
    const file = path.join(__dirname, 'views/partenariats.html');
    let content = fs.readFileSync(file, 'utf8');
    return res.send(injector(content));
});


app.get('/entrainement', (req, res) => {
    const file = path.join(__dirname, 'views/entrainement/index.html');
    let content = fs.readFileSync(file, 'utf8');
    return res.send(injector(content));
});


app.get('/recrutement', (req, res) => {
    const file = path.join(__dirname, 'views/recrutement/index.html');
    let content = fs.readFileSync(file, 'utf8');
    return res.send(injector(content));
});

app.get('/recrutement/:page', (req, res) => {
    const subPath = req.params.page;
    const check = path.join(__dirname, 'views/recrutement/sub/', subPath + '.html');

    if (fs.existsSync(check)) {
        const content = fs.readFileSync(check, 'utf8');
        return res.send(injector(content));
    }

    res.status(404).send('Page not found');
});

app.get('/entrainement/:page', (req, res) => {
    const subPath = req.params.page;
    const check = path.join(__dirname, 'views/entrainement/sub/', subPath + '.html');

    if (fs.existsSync(check)) {
        const content = fs.readFileSync(check, 'utf8');
        return res.send(injector(content));
    }

    res.status(404).send('Page not found');
});



// Injecter le contenu dans les fichiers HTML
function injector(content) {
    return content
        .replace('{{inject_navbar}}', fs.readFileSync("views/components/navbar.html", 'utf8'))
        .replace('{{inject_footer}}', fs.readFileSync("views/components/footer.html", 'utf8'));
}

app.listen(PORT, () => {
    console.log(`Serveur en ligne : http://localhost:${PORT}`);
});