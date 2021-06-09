//using the infura.io node, otherwise ipfs requires you to run a //daemon on your own computer/server.
const { create, urlSource } = require("ipfs-http-client");
const ipfs = create("http://127.0.0.1:5002");

async function getHash(str) {
    const buffer = await Buffer.from(str, "ascii");
    const result = await ipfs.add(buffer);

    console.log(ipfs.getEndpointConfig());
    console.log(await ipfs.version());
    console.log(buffer);
    console.log(buffer.toString());
    console.log(result);

    const file = await ipfs.add(urlSource("https://ipfs.io/images/ipfs-logo.svg"));
    console.log(file);
}

getHash("Hello world");
