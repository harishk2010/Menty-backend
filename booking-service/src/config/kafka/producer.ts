import kafka from "./kafkaConfig";
import { Partitioners } from "kafkajs";

async function produce(topic: string, value: object): Promise<void> {
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  try {
    console.log("Connecting to booking-Service Producer...");
    await producer.connect();

    const messageValue =
      typeof value === "object" ? JSON.stringify(value) : value;
    console.log(`Sending message to topic: ${topic} => ${messageValue}`);

    await producer.send({
      topic,
      messages: [{ value: messageValue }],
    });

    console.log("Message sent successfully from booking-Producer.");
  } catch (error:any) {
    console.error("Error in booking-Producer:", error.message, error.stack);
  } finally {
    await producer.disconnect();
    console.log("booking-Producer disconnected.");
  }
}

export default produce;
