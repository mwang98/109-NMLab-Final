const formatTimestamp = (timestamp) => {
    var locale = navigator.languages[0];
    var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var event = new Date(timestamp);
    return event.toLocaleString(locale, { timeZone });
};

export { formatTimestamp };
