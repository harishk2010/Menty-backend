import { Kafka } from "kafkajs";
const getBrokers = () => {
  // Use NODE_ENV to determine which environment we're in
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Get broker URLs from environment variables or use defaults
  const devBroker = process.env.KAFKA_DEV_BROKER || 'localhost:9092';
  const prodBroker = process.env.KAFKA_PROD_BROKER || 'kafka-service:9092';
  console.log(isProduction)
  
  return isProduction ? [prodBroker] : [devBroker];
};
const kafka = new Kafka({
  clientId: "admin-service",
  brokers: getBrokers(),
  retry: {
    retries: 5,
    initialRetryTime: 300,
    multiplier: 2, // Exponential backoff
  },
});

export default kafka;
