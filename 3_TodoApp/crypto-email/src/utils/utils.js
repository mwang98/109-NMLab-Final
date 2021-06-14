import uint8ArrayConcat from "uint8arrays/concat";

const formatTimestamp = (timestamp) => {
    var locale = navigator.languages[0];
    var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var event = new Date(timestamp);
    return event.toLocaleString(locale, { timeZone });
};

const extractUserInfo = (profile) => ({
    name: profile[0],
    pubKey: profile[1],
    description: profile[2],
    iconIPFSHash: profile[3] !== "" ? profile[3] : null,
    isCertified: profile[4],
    isAdmin: profile[5],
});

const extractApplicaiton = (app) => ({
    id: parseInt(app.id, 10),
    address: app.addr,
    name: app.name,
    description: app.description,
    status: app.status,
});

const uploadFile = async (ipfs, buffer) => {
    const { path } = await ipfs.add(buffer);
    return path;
};

const downloadFile = async (ipfs, IPFSHash) => {
    var url = "";
    var buffer = null;

    if (!IPFSHash) return { url, buffer };

    let content = [];
    for await (const chunk of ipfs.cat(IPFSHash)) {
        content.push(chunk);
    }
    const contentRaw = uint8ArrayConcat(content);
    return toUrlNBuffer(contentRaw.buffer);
};

const toUrlNBuffer = async (arrBuf) => {
    const blob = new Blob([arrBuf]);
    const url = URL.createObjectURL(blob);
    const buffer = await Buffer.from(arrBuf);
    return { url, buffer };
};

export { formatTimestamp, extractUserInfo, extractApplicaiton, uploadFile, downloadFile, toUrlNBuffer };
