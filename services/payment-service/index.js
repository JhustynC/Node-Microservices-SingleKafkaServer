import express from "express";
import cors from "cors";
import { Kafka, Partitioners } from "kafkajs";
import morgan from "morgan";

const app = express();

//* --- Middlewares globales ---
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(morgan("dev")); 

//* --- Configuración de Kafka ---
const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9094"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log("Producer connected to Kafka");
  } catch (err) {
    console.error("X Error connecting to Kafka:", err);
  }
};

//* --- Rutas ---
app.post("/payment-service", async (req, res, next) => {
  try {
    const { cart, userId } = req.body;

    // TODO: Procesar pago...

    //? Enviar mensaje a Kafka
    await producer.send({
      topic: "payment-successful",
      messages: [{ value: JSON.stringify({ userId, cart }) }],
    });

    setTimeout(() => {
      res.status(200).send("Payment successful");
    }, 2500);
  } catch (err) {
    next(err); 
  }
});

//* --- Middleware de errores ---
app.use((err, req, res, next) => {
  console.error("X Error:", err);
  res.status(err.status || 500).send(err.message || "Internal Server Error");
});

app.listen(8000, () => {
  connectToKafka();
  console.log("Payment service running on port 8000");
});
