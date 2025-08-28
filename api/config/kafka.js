const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "user-service",
    brokers: ["kafka:9092"],
    // brokers: ["localhost:9092"], //Container
});

const producer = kafka.producer();

const sendUserCreatedEvent = async (user) => {
    await producer.connect();
    await producer.send({
        topic: "user-created",
        messages: [
            { value: JSON.stringify(user) },
        ],
    });
    console.log("Sent user-created event:", user.email);
    await producer.disconnect();
};

module.exports = { sendUserCreatedEvent };
