// consumer.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "user-service",
    brokers: ["kafka:9092"],
    // brokers: ["localhost:9092"], //Container
});

const consumer = kafka.consumer({ groupId: "user-group" });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "user-created", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const user = JSON.parse(message.value.toString());
            console.log("Nhận sự kiện user-created từ kafka:", user.email);
            //Tiếp tục xử lý 
            //...
        },
    });
};

run().catch(console.error);
