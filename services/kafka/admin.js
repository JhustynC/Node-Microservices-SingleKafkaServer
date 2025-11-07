import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: ["localhost:9094"],
});

const admin = kafka.admin();

const run = async () => {
  try {
    console.log("Connecting to Kafka...");
    await admin.connect();
    console.log("Connected successfully!");

    // List existing topics first
    const existingTopics = await admin.listTopics();
    console.log("Existing topics:", existingTopics);

    const topicsToCreate = [
      { topic: "payment-successful", numPartitions: 1, replicationFactor: 1 },
      { topic: "order-successful", numPartitions: 1, replicationFactor: 1 },
      { topic: "email-successful", numPartitions: 1, replicationFactor: 1 },
    ];

    // Filter out topics that already exist
    const newTopics = topicsToCreate.filter(
      (topic) => !existingTopics.includes(topic.topic)
    );

    if (newTopics.length > 0) {
      console.log("Creating new topics:", newTopics.map((t) => t.topic));
      const result = await admin.createTopics({
        topics: newTopics,
        waitForLeaders: true,
      });
      console.log("Topics created:", result);
    } else {
      console.log("All topics already exist. No new topics to create.");
    }

    // List all topics after creation
    const allTopics = await admin.listTopics();
    console.log("All topics:", allTopics);
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.cause) {
      console.error("Error cause:", error.cause);
    }
  } finally {
    await admin.disconnect();
    console.log("Disconnected from Kafka");
  }
};

run();
