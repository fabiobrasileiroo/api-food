const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const { swaggerUi, swaggerSpec } = require('./swagger');
const cors = require('cors'); // Importar o pacote CORS

const app = express();
const port = 3000;

// Configurar o middleware CORS
app.use(cors()); // Liberar o CORS para todas as origens

app.use(bodyParser.json());

// Caminho para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, 'database.db');

// Cria e abre o banco de dados
const db = new sqlite3.Database(dbPath);

// Cria as tabelas se ainda não existirem
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id TEXT PRIMARY KEY,
      name TEXT,
      image TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY,
      name TEXT,
      price REAL,
      time TEXT,
      delivery REAL,
      rating REAL,
      image TEXT,
      restaurantId TEXT,
      FOREIGN KEY (restaurantId) REFERENCES restaurants (id)
    )
  `);
});

// Dados iniciais
const initialData = {
  restaurants: [
    { id: "1", name: "KFC", image: "https://i.imgur.com/sZ1Jye3.png" },
    { id: "2", name: "McDonald's", image: "https://i.imgur.com/su4iB3p.png" },
    { id: "3", name: "Outback", image: "https://i.imgur.com/jg3GJVN.png" },
    { id: "4", name: "Sushi Dev", image: "https://i.imgur.com/ffYWFBX.png" },
    { id: "5", name: "Burguer Grill", image: "https://i.imgur.com/kmQvG2T.png" },
    { id: "6", name: "Marmitas express", image: "https://i.imgur.com/uXRuDFD.png" }
  ],
  foods: [
    { id: "1", name: "Frango assado", price: 39.90, time: "50-60 min", delivery: 5.99, rating: 4.8, image: "https://i.imgur.com/CEVUdju.png", restaurantId: "1" },
    { id: "2", name: "Marmita fit", price: 29, time: "30-40 min", delivery: 2.99, rating: 4.9, image: "https://i.imgur.com/uXRuDFD.png", restaurantId: "6" },
    { id: "3", name: "Burguer Dev", price: 40, time: "50-60 min", delivery: 5.99, rating: 4.5, image: "https://i.imgur.com/O5c3lyU.png", restaurantId: "5" },
    { id: "4", name: "Picanha Grill", price: 36, time: "50-60 min", delivery: 5.99, rating: 4.4, image: "https://i.imgur.com/0UjG3wk.png", restaurantId: "3" },
    { id: "5", name: "Açai 300ml", price: 20, time: "20-30 min", delivery: 2.99, rating: 4.4, image: "https://i.imgur.com/BaUUCkc.png", restaurantId: "3" }
  ]
};

const insertInitialData = () => {
  db.serialize(() => {
    const stmt1 = db.prepare('INSERT OR IGNORE INTO restaurants (id, name, image) VALUES (?, ?, ?)');
    initialData.restaurants.forEach(restaurant => {
      stmt1.run(restaurant.id, restaurant.name, restaurant.image);
    });
    stmt1.finalize();

    const stmt2 = db.prepare('INSERT OR IGNORE INTO foods (id, name, price, time, delivery, rating, image, restaurantId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    initialData.foods.forEach(food => {
      stmt2.run(food.id, food.name, food.price, food.time, food.delivery, food.rating, food.image, food.restaurantId);
    });
    stmt2.finalize();
  });
};

insertInitialData();

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoints
/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Retorna todos os restaurantes
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       image:
 *                         type: string
 */
app.get('/restaurants', (req, res) => {
  db.all('SELECT * FROM restaurants', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ restaurants: rows });
  });
});

/**
 * @swagger
 * /foods:
 *   get:
 *     summary: Retorna todos os alimentos
 *     responses:
 *       200:
 *         description: Lista de alimentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 foods:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       time:
 *                         type: string
 *                       delivery:
 *                         type: number
 *                       rating:
 *                         type: number
 *                       image:
 *                         type: string
 *                       restaurantId:
 *                         type: string
 */
app.get('/foods', (req, res) => {
  db.all('SELECT * FROM foods', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ foods: rows });
  });
});

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Adiciona um novo restaurante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurante adicionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 */
app.post('/restaurants', (req, res) => {
  const { id, name, image } = req.body;
  const stmt = db.prepare('INSERT INTO restaurants (id, name, image) VALUES (?, ?, ?)');
  stmt.run(id, name, image, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
  stmt.finalize();
});

/**
 * @swagger
 * /foods:
 *   post:
 *     summary: Adiciona um novo alimento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               time:
 *                 type: string
 *               delivery:
 *                 type: number
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *               restaurantId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Alimento adicionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 */
app.post('/foods', (req, res) => {
  const { id, name, price, time, delivery, rating, image, restaurantId } = req.body;
  const stmt = db.prepare('INSERT INTO foods (id, name, price, time, delivery, rating, image, restaurantId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(id, name, price, time, delivery, rating, image, restaurantId, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
  stmt.finalize();
});

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Deleta um restaurante pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Restaurante deletado
 */
app.delete('/restaurants/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM restaurants WHERE id = ?');
  stmt.run(id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.sendStatus(204);
  });
  stmt.finalize();
});

/**
 * @swagger
 * /foods/{id}:
 *   delete:
 *     summary: Deleta um alimento pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Alimento deletado
 */
app.delete('/foods/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM foods WHERE id = ?');
  stmt.run(id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.sendStatus(204);
  });
  stmt.finalize();
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
