const IPFS = require("ipfs-core");

const getIPFSserver = async () => {
    const node = await IPFS.create();
    return node;
};

export { getIPFSserver };
