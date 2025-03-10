import kafka from "./kafkaConfig";
import { Partitioners } from "kafkajs";

async function produce(topic: string, value: object): Promise<void> {
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  try {
    await producer.connect();

    const messageValue =
      typeof value === "object" ? JSON.stringify(value) : value;

    await producer.send({
      topic,
      messages: [{ value: messageValue }],
    });
  } catch (error: any) {
    console.error("Error in course-Producer:", error.message, error.stack);
  } finally {
    await producer.disconnect();
  }
}

export default produce;
