# Microservices Kafka E-commerce System

Sistema de microservicios basado en Kafka para procesar pagos, órdenes, envío de emails y análisis de datos en tiempo real.

## Descripción

Este proyecto implementa una arquitectura de microservicios usando Apache Kafka como sistema de mensajería. El sistema procesa pagos de un carrito de compras y desencadena una serie de servicios que crean órdenes, envían emails de confirmación y generan análisis.

## Arquitectura

```
Client (Postman) 
    ↓
Payment Service (Express) → Kafka Topic: payment-successful
    ↓
Order Service (Consumer) → Kafka Topic: order-successful
    ↓
Email Service (Consumer) → Kafka Topic: email-successful
    ↓
Analytic Service (Consumer) → Monitorea todos los eventos
```

## Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web para el servicio de pago
- **Apache Kafka** - Sistema de mensajería distribuida
- **KafkaJS** - Cliente Kafka para Node.js
- **Docker & Docker Compose** - Contenedorización
- **Next.js** - Framework frontend (cliente)

## Requisitos Previos

- **Node.js** (v18 o superior)
- **Docker** y **Docker Compose**

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd microservices-single-kafka-server
```

### 2. Configurar Kafka

Navega al directorio de Kafka y levanta los contenedores:

```bash
cd services/kafka
docker-compose up -d
```

Esto iniciará:
- **Zookeeper** (puerto 2181)
- **Kafka** (puerto 9094 para conexiones externas)
- **Kafka UI** (puerto 8080) - Interfaz web para administrar Kafka

Verifica que los contenedores estén corriendo:

```bash
docker ps
```

### 3. Crear Topics de Kafka

Ejecuta el script de administración para crear los topics necesarios:

```bash
cd services/kafka
node admin.js
```

Esto creará los siguientes topics:
- `payment-successful`
- `order-successful`
- `email-successful`

### 4. Instalar Dependencias de los Servicios

Instala las dependencias para cada servicio:

```bash
# Payment Service
cd services/payment-service
npm install

# Order Service
cd ../order-service
npm install

# Email Service
cd ../email-service
npm install

# Analytic Service
cd ../analytic-service
npm install
```

### 5. Instalar Dependencias del Cliente (Opcional)

Si quieres ejecutar el frontend:

```bash
cd services/client
npm install
```

## 🎯 Ejecutar los Servicios

### Orden de Inicio Recomendado

1. **Kafka** (debe estar corriendo primero)
2. **Payment Service** (API REST)
3. **Order Service** (Consumer)
4. **Email Service** (Consumer)
5. **Analytic Service** (Consumer)

### Iniciar Servicios Individualmente

Abre múltiples terminales y ejecuta cada servicio:

#### Terminal 1: Payment Service
```bash
cd services/payment-service
node index.js
```
Servicio disponible en: `http://localhost:8000`

#### Terminal 2: Order Service
```bash
cd services/order-service
node index.js
```

#### Terminal 3: Email Service
```bash
cd services/email-service
node index.js
```

#### Terminal 4: Analytic Service
```bash
cd services/analytic-service
node index.js
```
## Probar la API

### Usando Postman o cURL

**Endpoint:** `POST http://localhost:8000/payment-service`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "123",
  "cart": [
    {
      "id": 1,
      "name": "Nike Air Max",
      "price": 129.9,
      "image": "/product1.png",
      "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      "id": 2,
      "name": "Adidas Superstar Cap",
      "price": 29.9,
      "image": "/product2.png",
      "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    }
  ]
}
```

## Estructura del Proyecto

```
microservices-single-kafka-server/
├── services/
│   ├── kafka/
│   │   ├── docker-compose.yml    # Configuración de Kafka, Zookeeper y Kafka UI
│   │   ├── admin.js              # Script para crear topics
│   │   └── package.json
│   ├── payment-service/
│   │   ├── index.js              # API REST para procesar pagos
│   │   └── package.json
│   ├── order-service/
│   │   ├── index.js              # Consumer que crea órdenes
│   │   └── package.json
│   ├── email-service/
│   │   ├── index.js              # Consumer que envía emails
│   │   └── package.json
│   ├── analytic-service/
│   │   ├── index.js              # Consumer que analiza eventos
│   │   └── package.json
└── README.md
```

## Monitoreo

### Kafka UI

Accede a la interfaz web de Kafka en: `http://localhost:8080`

Desde aquí puedes:
- Ver todos los topics
- Inspeccionar mensajes
- Ver consumer groups
- Monitorear el estado del cluster

### Logs de los Servicios

Cada servicio imprime logs en consola:
- **Payment Service**: Confirma cuando se procesa un pago
- **Order Service**: Muestra cuando se crea una orden
- **Email Service**: Muestra cuando se envía un email
- **Analytic Service**: Muestra análisis de todos los eventos

## Detener los Servicios

### Detener Kafka
```bash
cd services/kafka
docker-compose down
```

## Configuración de Kafka

El archivo `services/kafka/docker-compose.yml` contiene la configuración de Kafka:

- **Puerto externo**: 9094 (para conexiones desde el host)
- **Puerto interno**: 9092 (para comunicación entre contenedores)
- **Kafka UI**: Puerto 8080
- **Replication Factor**: 1 (configurado para desarrollo con un solo broker)

