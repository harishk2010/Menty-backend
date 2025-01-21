import kafka from "./kafkaConfig";
import { Partitioners } from "kafkajs";

async function produce(topic: string, value: Buffer): Promise<void> {
  try {
    const producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    console.log("connecting auth-service Producer...");

    await producer.connect();
    const messageValue =  
      typeof value === "object" ? JSON.stringify(value) : value;
    console.log(`Sending message to topic: ${topic} => ${messageValue}`);
    await producer.send({
      topic,
      messages: [{ value: messageValue }],
    });
    console.log("Message sent from Auth-Producer");
    await producer.disconnect();
    console.log("Auth-Producer disconnected.");
  } catch (error) {
    console.log(error);
  }
}
export default produce;
