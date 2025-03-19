import { Kafka } from "kafkajs";

const getBrokers = () => {
 
  const isProduction = process.env.NODE_ENV === 'production';
  
  const devBroker = process.env.KAFKA_DEV_BROKER || 'localhost:9092';
  const prodBroker = process.env.KAFKA_PROD_BROKER || 'kafka-service:9092';
  console.log(isProduction)
  
  return isProduction ? [prodBroker] : [devBroker];
};

const kafka = new Kafka({
  clientId: "booking-service",
  brokers: getBrokers(),
  retry: {
    retries: 5,
    initialRetryTime: 300,
    multiplier: 2, 
  },
});

export default kafka;
