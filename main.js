const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
// Sur Vercel, le PORT est défini automatiquement via process.env.PORT.
// Nous utilisons 3000 comme valeur par défaut en local.
const PORT = process.env.PORT || 3000;

// --- CORRECTION CLÉ POUR LES ERREURS 404 SUR LES FICHIERS STATIQUES ---
// 1. Servez le contenu du dossier 'public' directement à la racine (/) de l'URL.
//    Ceci correspond à la convention Vercel et résout les problèmes de chemin.
app.use(express.static(path.join(__dirname, 'public')));
// ----------------------------------------------------------------------


// Fonction utilitaire pour lire et injecter les composants HTML
function injector(content) {
    // Les chemins pour les composants (head, navbar, footer) restent valides
    // car ils sont lus directement depuis le système de fichiers.
    try {
        const head = fs.readFileSync(path.join(__dirname, "views/components/head.html"), 'utf8');
        const navbar = fs.readFileSync(path.join(__dirname, "views/components/navbar.html"), 'utf8');
        const footer = fs.readFileSync(path.join(__dirname, "views/components/footer.html"), 'utf8');

        let injected = content
            .replace('{{inject_head}}', head)
            .replace('{{inject_navbar}}', navbar)
            .replace('{{inject_footer}}', footer);
        
        // ATTENTION : Si la ligne ci-dessous était uniquement pour corriger 
        // les chemins statiques (CSS/images) après l'utilisation de /public, 
        // vous DEVEZ la supprimer car le 'app.use' corrigé fait le travail.
        // Si elle est là pour d'autres raisons (ex: gérer le CSS dans les composants), 
        // laissez-la, mais assurez-vous de sa nécessité.
        // Puisque vous avez des chemins statiques dans l'HTML qui n'incluent plus /public, 
        // nous la commentons/supprimons.
        // injected = injected.replace(/\/public\//g, '/');

        return injected;

    } catch (error) {
        console.error("Erreur lors de l'injection des composants:", error.message);
        // En cas d'erreur de lecture de fichier (ex: views/components/head.html manquant)
        return content; 
    }
}


// Route principale
app.get('/', (req, res) => {
    const file = path.join(__dirname, 'views/index.html');
    try {
        let content = fs.readFileSync(file, 'utf8');
        return res.send(injector(content));
    } catch (e) {
        res.status(500).send('Erreur interne du serveur: Fichier index.html non trouvé.');
    }
});


// Autres routes (la logique est conservée)
app.get('/contact', (req, res) => {
    const file = path.join(__dirname, 'views/contact.html');
    try {
        let content = fs.readFileSync(file, 'utf8');
        return res.send(injector(content));
    } catch (e) {
        res.status(500).send('Erreur interne du serveur.');
    }
});

app.get('/partenariats', (req, res) => {
    const file = path.join(__dirname, 'views/partenariats.html');
    try {
        let content = fs.readFileSync(file, 'utf8');
        return res.send(injector(content));
    } catch (e) {
        res.status(500).send('Erreur interne du serveur.');
    }
});


app.get('/entrainement', (req, res) => {
    const file = path.join(__dirname, 'views/entrainement/index.html');
    try {
        let content = fs.readFileSync(file, 'utf8');
        return res.send(injector(content));
    } catch (e) {
        res.status(500).send('Erreur interne du serveur.');
    }
});


app.get('/recrutement', (req, res) => {
    const file = path.join(__dirname, 'views/recrutement/index.html');
    try {
        let content = fs.readFileSync(file, 'utf8');
        return res.send(injector(content));
    } catch (e) {
        res.status(500).send('Erreur interne du serveur.');
    }
});

app.get('/recrutement/:page', (req, res) => {
    const subPath = req.params.page;
    const check = path.join(__dirname, 'views/recrutement/sub/', subPath + '.html');

    if (fs.existsSync(check)) {
        const content = fs.readFileSync(check, 'utf8');
        return res.send(injector(content));
    }

    // Le 404 est géré ici pour les sous-routes dynamiques
    res.status(404).send('Page non trouvée');
});

app.get('/entrainement/:page', (req, res) => {
    const subPath = req.params.page;
    const check = path.join(__dirname, 'views/entrainement/sub/', subPath + '.html');

    if (fs.existsSync(check)) {
        const content = fs.readFileSync(check, 'utf8');
        return res.send(injector(content));
    }

    // Le 404 est géré ici pour les sous-routes dynamiques
    res.status(404).send('Page non trouvée');
});


// Route pour servir le fichier robots.txt et sitemap.xml.
// Ces fichiers seront maintenant servis par 'express.static' si ils sont dans 'public'.
// Si vous voulez conserver ces routes explicites, assurez-vous qu'elles ne soient pas en conflit
// avec express.static (lequel est prioritaire ici).
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sitemap.xml'));
});

// GESTION DU 404 FINAL: Si aucune des routes n'a été trouvée, renvoyez un 404.
// Doit être placé à la fin du fichier, après toutes les autres routes.
app.use((req, res, next) => {
    res.status(404).send("Page non trouvée - WolfDefansy");
});

app.listen(PORT, () => {
    console.log(`Serveur en ligne : http://localhost:${PORT}`);
});
