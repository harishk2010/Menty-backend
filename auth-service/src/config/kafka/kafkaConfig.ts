import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: ["kafka:9092"],
  retry: {
    retries: 5,
    initialRetryTime: 300,
    multiplier: 2,
  },
});

export default kafka;
