import { Kafka } from "kafkajs";

const kafka=new Kafka({
    clientId:"course-service",
    brokers:['localhost:9092'],
    retry: {
        retries: 5, 
        initialRetryTime: 300,
        multiplier: 2, 
      },
})

export default kafka