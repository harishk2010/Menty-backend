import kafka from "./kafkaConfig";
import { Partitioners } from "kafkajs";

async function produce(topic: string, value: object): Promise<void> {
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  try {
    console.log("Connecting to course-Service Producer...");
    await producer.connect();

    const messageValue =
      typeof value === "object" ? JSON.stringify(value) : value;
    console.log(`Sending message to topic: ${topic} => ${messageValue}`);

    await producer.send({
      topic,
      messages: [{ value: messageValue }],
    });

    console.log("Message sent successfully from course-Producer.");
  } catch (error:any) {
    console.error("Error in course-Producer:", error.message, error.stack);
  } finally {
    await producer.disconnect();
    console.log("verification-Producer disconnected.");
  }
}

export default produce;
