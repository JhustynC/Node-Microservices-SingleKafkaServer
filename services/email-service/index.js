import confluent from '@confluentinc/kafka-javascript';
const { Kafka } = confluent.KafkaJS;

const kafka = new Kafka({
  kafkaJS: {
    clientId: 'email-service',
    brokers: ['localhost:9094'],
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({
  kafkaJS: {
    groupId: 'email-group',
    fromBeginning: true,
  },
});

const run = async () => {
  try {
    await producer.connect();
    console.log('=== Producer connected ===');

    await consumer.connect();
    console.log('=== Consumer connected ===');

    await consumer.subscribe({ topic: 'order-successful' });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        const { userId, orderId } = JSON.parse(value);

        console.log(`📧 Email enviado al usuario ID ${userId} para la orden ${orderId}`);

        const dummyEmailId = '091584203985';
        await producer.send({
          topic: 'email-successful',
          messages: [{ value: JSON.stringify({ userId, emailId: dummyEmailId }) }],
        });
      },
    });
  } catch (err) {
    console.error('X Error en el servicio de email:', err);
  }
};

run();
