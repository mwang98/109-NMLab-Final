import uint8ArrayConcat from "uint8arrays/concat";
import EthCrypto from 'eth-crypto';

const ab2str = async (buf) => {
    var bufView = new Uint8Array(buf);
    var unis =""
    for (var i = 0; i < bufView.length; i++) {
        unis=unis+String.fromCharCode(bufView[i]);
    }
    return unis
}
const str2ab = async (str) => {
    var bufView = new Uint8Array(str.length);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}
const decryptWithPrivateKey = async (priKey, content) => {
    var originContent = content;
    var strAry = content.split(';');
    content = {
        iv:strAry[0],
        ephemPublicKey:strAry[1],
        ciphertext:strAry[2],
        mac:strAry[3]
    }
    try {
        content = await EthCrypto.decryptWithPrivateKey(priKey, content);
    }
    catch (e) {
        console.log(e)
        return originContent;
    }
    return content;
};
const encryptWithPublicKey = async (pubKey, content) => {
    var originContent = content;
    try { // statements to try
        content = await EthCrypto.encryptWithPublicKey(pubKey, content);
    }
    catch (e) {
        console.log(e);
        return originContent;
    }
    content = content.iv+';'+
                content.ephemPublicKey+';'+
                content.ciphertext+';'+
                content.mac;
    return content
}
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

export { ab2str, str2ab, decryptWithPrivateKey, encryptWithPublicKey, formatTimestamp, extractUserInfo, extractApplicaiton, uploadFile, downloadFile, toUrlNBuffer };
