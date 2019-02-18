const zeromq = require("zeromq");

const subscriber = zeromq.socket("sub");
subscriber.on("message", async (topic, message) => {
  topic = topic.toString("utf8");
  message_utf8 = message.toString("utf8");

  const assettx = JSON.parse(message_utf8);

  console.log(message);

  //Test output
  console.log(assettx);

  console.log(
    `
  `,
    assettx._id,
    `
  `,
    assettx.txid,
    `
  `,
    assettx.asset,
    `
  `,
    assettx.sender,
    `
  `,
    assettx.receiver,
    `
  `,
    assettx.amount
  );
});

// connect to message producer
subscriber.connect("tcp://127.0.0.1:3030");
subscriber.subscribe("assetallocation");
console.log("subscribed to syscoin topic zmqpubassetallocation");
