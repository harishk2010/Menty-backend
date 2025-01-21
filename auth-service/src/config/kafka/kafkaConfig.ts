import { Kafka } from "kafkajs";

const kafka=new Kafka({
    clientId:"auth-service",
    brokers:['localhost:9092'],
    retry: {
        retries: 5, // Number of retry attempts
        initialRetryTime: 300, // Initial retry interval in ms
        multiplier: 2, // Exponential backoff
      },
})

export default kafka