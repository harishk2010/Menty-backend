import kafka from "./kafkaConfig";
import { Partitioners } from "kafkajs";

async function produce(topic: string, value: object): Promise<void> {
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  try {
    console.log("Connecting to chat-Service Producer...");
    await producer.connect();

    const messageValue =
      typeof value === "object" ? JSON.stringify(value) : value;
    console.log(`Sending message to topic: ${topic} => ${messageValue}`);

    await producer.send({
      topic,
      messages: [{ value: messageValue }],
    });

    console.log("Message sent successfully from chat-Producer.");
  } catch (error:any) {
    console.error("Error in chat-Producer:", error.message, error.stack);
  } finally {
    await producer.disconnect();
    console.log("chat-Producer disconnected.");
  }
}

export default produce;
