import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "admin-service",
  brokers: ["kafka-service:9092"],
  retry: {
    retries: 5,
    initialRetryTime: 300,
    multiplier: 2, // Exponential backoff
  },
});

export default kafka;
