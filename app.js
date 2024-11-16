const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/category");
const brandRoutes = require("./routes/brand");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const customerRoutes = require("./routes/customer");
const authRoutes = require("./routes/auth");
const { verifyToken, isAdmin } = require("./middleware/auth-middleware");
const app = express();
const port = process.env.MONGOPORT || 3000;
require("dotenv").config();

// Define los orígenes permitidos
const allowedOrigins = [
  'https://tienda-frontend-sigma.vercel.app',
  'https://tienda-frontend-2ru6vz26y-r3dgraves-projects.vercel.app'
];

// Configura CORS dinámico
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor corriendo");
});

app.use("/category", verifyToken, isAdmin, categoryRoutes);
app.use("/brand", verifyToken, isAdmin, brandRoutes);
app.use("/orders", verifyToken, isAdmin, orderRoutes);
app.use("/product", verifyToken, isAdmin, productRoutes);
app.use("/customer", verifyToken, customerRoutes);
app.use("/auth", authRoutes);

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Conexión a MongoDB establecida correctamente");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
  }
}

connectDb();

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  next();
});
