const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

function injector(content) {
  try {
    const head = fs.readFileSync(
      path.join(__dirname, "views/components/head.html"),
      "utf8"
    );
    const navbar = fs.readFileSync(
      path.join(__dirname, "views/components/navbar.html"),
      "utf8"
    );
    const footer = fs.readFileSync(
      path.join(__dirname, "views/components/footer.html"),
      "utf8"
    );
    const recruit = fs.readFileSync(
      path.join(__dirname, "views/components/recruit.html"),
      "utf8"
    );

    let injected = content
      .replace("{{inject_head}}", head)
      .replace("{{inject_navbar}}", navbar)
      .replace("{{inject_footer}}", footer)
      .replace("{{inject_recruit}}", recruit);

    return injected;
  } catch (error) {
    console.error("Erreur lors de l'injection des composants:", error.message);

    return content;
  }
}

app.get("/", (req, res) => {
  const file = path.join(__dirname, "views/index.html");
  try {
    let content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    res
      .status(500)
      .send("Erreur interne du serveur: Fichier index.html non trouvé.");
  }
});

app.get("/news", (req, res) => {
  const file = path.join(__dirname, "views/news.html");
  try {
    let content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    res
      .status(500)
      .send("Erreur interne du serveur: Fichier index.html non trouvé.");
  }
});

app.get("/partners/oteria", (req, res) => {
  const file = path.join(__dirname, "views/partners/oteria.html");
  try {
    let content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    res
      .status(500)
      .send("Erreur interne du serveur: Fichier index.html non trouvé.");
  }
});

app.get("/partners", (req, res) => {
  const file = path.join(__dirname, "views/partners/index.html");
  try {
    let content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    res
      .status(500)
      .send("Erreur interne du serveur: Fichier index.html non trouvé.");
  }
});

app.get("/contact", (req, res) => {
  const file = path.join(__dirname, "views/contact.html");
  try {
    let content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    res.status(500).send("Erreur interne du serveur.");
  }
});

app.get("/project", (req, res) => {
  const file = path.join(__dirname, "views/project/index.html");
  try {
    let content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    res.status(500).send("Erreur interne du serveur.");
  }
});

app.get("/project/trailers", (req, res) => {
  const file = path.join(__dirname, "views/project/trailers.html"); // corrigé
  if (!fs.existsSync(file)) {
    return res.status(404).send("Page non trouvée");
  }
  try {
    const content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    console.error("Erreur lecture trailers.html:", e);
    res.status(500).send("Erreur interne du serveur.");
  }
});

app.get("/project/ambitions", (req, res) => {
  const file = path.join(__dirname, "views/project/ambitions.html"); // corrigé
  if (!fs.existsSync(file)) {
    return res.status(404).send("Page non trouvée");
  }
  try {
    const content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    console.error("Erreur lecture trailers.html:", e);
    res.status(500).send("Erreur interne du serveur.");
  }
});

app.get("/project/staff", (req, res) => {
  const file = path.join(__dirname, "views/project/staff.html");
  try {
    let content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    res.status(500).send("Erreur interne du serveur.");
  }
});

app.get("/partenariats", (req, res) => {
  const file = path.join(__dirname, "views/partenariats.html");
  try {
    let content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    res.status(500).send("Erreur interne du serveur.");
  }
});

app.get("/entrainement", (req, res) => {
  const file = path.join(__dirname, "views/entrainement/index.html");
  try {
    let content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    res.status(500).send("Erreur interne du serveur.");
  }
});

app.get("/recrutement", (req, res) => {
  const file = path.join(__dirname, "views/recrutement/index.html");
  try {
    let content = fs.readFileSync(file, "utf8");
    return res.send(injector(content));
  } catch (e) {
    res.status(500).send("Erreur interne du serveur.");
  }
});

app.get("/recrutement/:page", (req, res) => {
  const subPath = req.params.page;
  const check = path.join(
    __dirname,
    "views/recrutement/sub/",
    subPath + ".html"
  );

  if (fs.existsSync(check)) {
    const content = fs.readFileSync(check, "utf8");
    return res.send(injector(content));
  }

  res.status(404).send("Page non trouvée");
});

app.get("/entrainement/:page", (req, res) => {
  const subPath = req.params.page;
  const check = path.join(
    __dirname,
    "views/entrainement/sub/",
    subPath + ".html"
  );

  if (fs.existsSync(check)) {
    const content = fs.readFileSync(check, "utf8");
    return res.send(injector(content));
  }

  res.status(404).send("Page non trouvée");
});

app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "public/robots.txt"));
});

app.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(__dirname, "public/sitemap.xml"));
});

app.use((req, res, next) => {
  const file = path.join(__dirname, "views/404.html");
  if (fs.existsSync(file)) {
    res.status(404).sendFile(file); // Serve the 404 page directly
  } else {
    res.status(404).send("Page non trouvée"); // Fallback if 404 page doesn't exist
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en ligne : http://localhost:${PORT}`);
});
