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
    const head = fs.readFileSync(path.join(__dirname, "views/components/head.html"), 'utf8');
    const navbar = fs.readFileSync(path.join(__dirname, "views/components/navbar.html"), 'utf8');
    const footer = fs.readFileSync(path.join(__dirname, "views/components/footer.html"), 'utf8');

    let injected = content
        .replace('{{inject_head}}', head)
        .replace('{{inject_navbar}}', navbar)
        .replace('{{inject_footer}}', footer);

    // Remplace tous les /public/... par / pour le navigateur
    injected = injected.replace(/\/public\//g, '/');

    return injected;
}





// Route pour servir le fichier robots.txt
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/robots.txt'));
});

// Route pour servir le fichier sitemap.xml
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sitemap.xml'));
});



app.listen(PORT, () => {
    console.log(`Serveur en ligne : http://localhost:${PORT}`);
});
