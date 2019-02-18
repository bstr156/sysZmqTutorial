const zeromq = require("zeromq");
const SyscoinClient = require("@syscoin/syscoin-core");

async function parseTx() {
  //Syscoin RPC connection details as specified in syscoin.conf
  const syscoin = new SyscoinClient({
    host: process.env.SYSCOIND_HOST || "localhost",
    port: process.env.SYSCOIND_PORT || 8370,
    username: process.env.SYSCOIND_USER || "u",
    password: process.env.SYSCOIND_PASS || "p",
    timeout: 30000
  });

  //Decode the hex string!
  const decodedTx = await syscoin.decodeRawTransaction(messageHex);

  //Produce some legible output!
  console.log(`
Here is entire decoded raw transaction as JSON:
`);
  console.log(decodedTx);
  console.log("");
  console.log("");
  console.log("Individual JSON key/value pairs are accessible... See?:");
  console.log("");
  console.log("txid: ", decodedTx.txid);
  console.log("size: ", decodedTx.size);
  console.log("");
  console.log("");

  //Loop through vOut JSON to display the address and value of each output
  const   txkeyvOutCount = decodedTx.vout.length;
  for (var txkeyvOut = 0; txkeyvOut < txkeyvOutCount; txkeyvOut++) {

     console.log("vOut.scriptPubKey.addresses: ", decodedTx.vout[txkeyvOut]["scriptPubKey"]["addresses"].toString());

     console.log("vOut.value: ", decodedTx.vout[txkeyvOut]["value"]);
     console.log("");
  }

  console.log(`


`);

}

const subscriber = zeromq.socket("sub");
subscriber.on("message", async (topic, message) => {
  topic = topic.toString("utf8");

  /*All 0MQ output is hex buffer. In the case of rawTransaction, 
    string hex must be passed to decodeRawTransaction to obtain JSON formatted data. 
    So then, let's convert buffer hex to string hex so we can pass it. */
  messageHex = message.toString("hex");

  //For each new streamed message (raw transaction) execute function to decode and output as JSON
  parseTx();
});

// connect to message producer
subscriber.connect("tcp://127.0.0.1:3030");
subscriber.subscribe("rawtx");
console.log("subscribed to syscoin topic zmqpubrawtx");
