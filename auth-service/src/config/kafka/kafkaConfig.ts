import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: ["kafka-service:9092"],
  retry: {
    retries: 5,
    initialRetryTime: 300,
    multiplier: 2,
  },
});

export default kafka;
