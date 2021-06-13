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
    iconIPFSHash: profile[3],
    isCertified: profile[4],
    isAdmin: profile[5],
});

export { formatTimestamp, extractUserInfo };
