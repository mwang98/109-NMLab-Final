pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract EmailSystem {
    event OnOpenMail(address receiverAddr, string uuid);
    event OnSendMail(uint256 mid);

    struct MailBox {
        uint256[] mailIds;
    }
    struct AppBox {
        uint256[] appIds;
    }
    struct Mail {
        string uuid;
        address senderAddr;
        address receiverAddr;
        string subject;
        uint256 timestamp;
        string contents;
        string[3][] multiMediaContents; // IPFS hash values
        bool isOpen;
    }
    struct App {
        uint256 id;
        string name;
        address addr;
        string description;
        string status;
    }
    struct User {
        string name;
        string pubKey;
        string description;
        string iconIPFSHash;
        MailBox inbox;
        MailBox outbox;
        MailBox draftbox;
        bool isCertified;
        bool isAdmin;
        AppBox appBox;
    }

    mapping(address => User) generalUsers;
    address[] certifiedUsers;
    mapping(string => Mail) mails;
    address genesisAdmin;
    App[] apps;
    string[] id2uuids;

    // init
    constructor() public {}

    // Modifier
    modifier isAdmin(address addr) {
        require(generalUsers[addr].isAdmin == true);
        _;
    }
    modifier isUserExists(address addr) {
        string memory s;
        require(
            keccak256(bytes(generalUsers[addr].pubKey)) != keccak256(bytes(s))
        );
        _;
    }
    modifier isUserNotExists(address addr) {
        string memory s;
        require(
            keccak256(bytes(generalUsers[addr].pubKey)) == keccak256(bytes(s))
        );
        _;
    }

    // Public function
    function setUser(
        address addr,
        string memory name,
        string memory pubKey,
        string memory discription,
        string memory iconIPFSHash,
        bool isCertified
    ) public {
        MailBox memory inbox;
        MailBox memory outbox;
        MailBox memory draftbox;
        AppBox memory appBox;
        address a;
        bool i = false;
        if (genesisAdmin == addr || genesisAdmin == a) {
            i = true;
            genesisAdmin = addr;
        }
        generalUsers[addr] = User(
            name,
            pubKey,
            discription,
            iconIPFSHash,
            inbox,
            outbox,
            draftbox,
            isCertified,
            i,
            appBox
        );
    }

    function getCertifiedUsers() public view returns (address[] memory) {
        return certifiedUsers;
    }

    function banUser(address addr) public isAdmin(msg.sender) {
        generalUsers[addr].isCertified = false;
    }

    function acceptApp(uint256 aid) public isAdmin(msg.sender) {
        apps[aid].status = "accepted";
        if (generalUsers[apps[aid].addr].isCertified == false) {
            generalUsers[apps[aid].addr].isCertified = true;
            certifiedUsers.push(apps[aid].addr);
        }
    }

    function rejectApp(uint256 aid) public isAdmin(msg.sender) {
        apps[aid].status = "rejected";
    }

    function getAppLength() public view returns (uint256) {
        return apps.length;
    }

    function getAllApp()
        public
        view
        isAdmin(msg.sender)
        returns (App[] memory)
    {
        return apps;
    }

    function getUserApp(address addr) public view returns (App[] memory) {
        uint256 numApp = generalUsers[addr].appBox.appIds.length;
        App[] memory ret = new App[](numApp);
        for (uint256 i = 0; i < numApp; i++) {
            uint256 aid = generalUsers[addr].appBox.appIds[i];
            ret[i] = apps[aid];
        }
        return ret;
    }

    function submitApp(App memory app) public {
        uint256 aid = apps.length;
        app.id = aid;
        generalUsers[app.addr].appBox.appIds.push(aid);
        apps.push(app);
    }

    function sendMail(Mail memory mail) public returns (bool) {
        if (mailExist(mail.uuid)) {
            mails[mail.uuid] = mail;
            uint256 id = 0;
            for (; id < id2uuids.length; ++id) {
                if (
                    keccak256(bytes(id2uuids[id])) ==
                    keccak256(bytes(mail.uuid))
                ) break;
            }
            for (
                uint256 i = 0;
                i < generalUsers[mail.senderAddr].outbox.mailIds.length;
                ++i
            ) {
                if (generalUsers[mail.senderAddr].outbox.mailIds[i] == id)
                    return false;
            }
            for (
                uint256 i = 0;
                i < generalUsers[mail.senderAddr].inbox.mailIds.length;
                ++i
            ) {
                if (generalUsers[mail.senderAddr].inbox.mailIds[i] == id)
                    return false;
            }
            bool found = false;
            for (
                uint256 i = 0;
                i < generalUsers[mail.senderAddr].draftbox.mailIds.length;
                ++i
            ) {
                if (generalUsers[mail.senderAddr].draftbox.mailIds[i] == id) {
                    found = true;
                    break;
                }
            }
            if (found == false) return false;
            generalUsers[mail.senderAddr].outbox.mailIds.push(id);
            generalUsers[mail.receiverAddr].inbox.mailIds.push(id);

            // remove from draftbox
            uint256 index = 0;
            uint256 length =
                generalUsers[mail.senderAddr].draftbox.mailIds.length;
            found = false;
            for (; index < length; ++index) {
                if (
                    generalUsers[mail.senderAddr].draftbox.mailIds[index] == id
                ) {
                    found = true;
                    break;
                }
            }
            if (found == true) {
                for (uint256 i = index; i + 1 < length; ++i) {
                    generalUsers[mail.senderAddr].draftbox.mailIds[
                        i
                    ] = generalUsers[mail.senderAddr].draftbox.mailIds[i + 1];
                }
                if (length > 0) {
                    delete generalUsers[mail.senderAddr].draftbox.mailIds[
                        length - 1
                    ];
                    generalUsers[mail.senderAddr].draftbox.mailIds.length--;
                }
            }
            return true;
        } else {
            uint256 id = id2uuids.length;
            id2uuids.push(mail.uuid);
            mails[mail.uuid] = mail;
            generalUsers[mail.senderAddr].outbox.mailIds.push(id);
            generalUsers[mail.receiverAddr].inbox.mailIds.push(id);
            return true;
        }
    }

    function saveMail(address addr, Mail memory mail) public returns (bool) {
        if (mailExist(mail.uuid)) {
            mails[mail.uuid] = Mail({
                uuid: mail.uuid,
                senderAddr: mail.senderAddr,
                receiverAddr: mail.receiverAddr,
                subject: mail.subject,
                timestamp: mail.timestamp,
                contents: mail.contents,
                multiMediaContents: mail.multiMediaContents,
                isOpen: mail.isOpen
            });
            return true;
        } else {
            uint256 id = id2uuids.length;
            id2uuids.push(mail.uuid);
            mails[mail.uuid] = Mail({
                uuid: mail.uuid,
                senderAddr: mail.senderAddr,
                receiverAddr: mail.receiverAddr,
                subject: mail.subject,
                timestamp: mail.timestamp,
                contents: mail.contents,
                multiMediaContents: mail.multiMediaContents,
                isOpen: mail.isOpen
            });
            generalUsers[addr].draftbox.mailIds.push(id);
            return true;
        }
    }

    function deleteMail(address addr, Mail memory mail) public returns (bool) {
        if (mailExist(mail.uuid)) {
            uint256 id = 0;
            for (; id < id2uuids.length; ++id) {
                if (
                    keccak256(bytes(id2uuids[id])) ==
                    keccak256(bytes(mail.uuid))
                ) break;
            }

            uint256 index;
            uint256 length;
            bool found;
            // delete from draftbox
            index = 0;
            length = generalUsers[addr].draftbox.mailIds.length;
            found = false;
            for (; index < length; ++index) {
                if (generalUsers[addr].draftbox.mailIds[index] == id) {
                    found = true;
                    break;
                }
            }
            if (found == true) {
                for (uint256 i = index; i + 1 < length; ++i) {
                    generalUsers[addr].draftbox.mailIds[i] = generalUsers[addr]
                        .draftbox
                        .mailIds[i + 1];
                }
                if (length > 0) {
                    delete generalUsers[addr].draftbox.mailIds[length - 1];
                    generalUsers[addr].draftbox.mailIds.length--;
                }
            }
            // delete from inbox
            index = 0;
            length = generalUsers[addr].inbox.mailIds.length;
            found = false;
            for (; index < length; ++index) {
                if (generalUsers[addr].inbox.mailIds[index] == id) {
                    found = true;
                    break;
                }
            }
            if (found == true) {
                for (uint256 i = index; i + 1 < length; ++i) {
                    generalUsers[addr].inbox.mailIds[i] = generalUsers[addr]
                        .inbox
                        .mailIds[i + 1];
                }
                if (length > 0) {
                    delete generalUsers[addr].inbox.mailIds[length - 1];
                    generalUsers[addr].inbox.mailIds.length--;
                }
            }
            // delete from outbox
            index = 0;
            length = generalUsers[addr].outbox.mailIds.length;
            found = true;
            for (; index < length; ++index) {
                if (generalUsers[addr].outbox.mailIds[index] == id) {
                    found = true;
                    break;
                }
            }
            if (found == true) {
                for (uint256 i = index; i + 1 < length; ++i) {
                    generalUsers[addr].outbox.mailIds[i] = generalUsers[addr]
                        .outbox
                        .mailIds[i + 1];
                }
                if (length > 0) {
                    delete generalUsers[addr].outbox.mailIds[length - 1];
                    generalUsers[addr].outbox.mailIds.length--;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    function mailExist(string memory uuid) public view returns (bool) {
        Mail memory m = mails[uuid];
        address a;
        string memory s;
        if (keccak256(bytes(m.uuid)) != keccak256(bytes(s))) {
            return true;
        }
        if (m.senderAddr != a) {
            return true;
        }
        if (m.receiverAddr != a) {
            return true;
        }
        if (keccak256(bytes(m.subject)) != keccak256(bytes(s))) {
            return true;
        }
        if (m.timestamp != 0) {
            return true;
        }
        if (keccak256(bytes(m.contents)) != keccak256(bytes(s))) {
            return true;
        }
        if (m.multiMediaContents.length != 0) {
            return true;
        }
        if (m.isOpen != false) {
            return true;
        }
        return false;
    }

    function getInboxMailIds(address addr)
        public
        view
        returns (uint256[] memory)
    {
        uint256 numMail = generalUsers[addr].inbox.mailIds.length;
        uint256[] memory ret = new uint256[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[addr].inbox.mailIds[i];
            ret[i] = mid;
        }
        return ret;
    }

    function getInboxMails(address addr) public view returns (Mail[] memory) {
        uint256 numMail = generalUsers[addr].inbox.mailIds.length;
        Mail[] memory ret = new Mail[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[addr].inbox.mailIds[i];
            ret[i] = mails[id2uuids[mid]];
        }
        return ret;
    }

    function getOutboxMailIds(address addr)
        public
        view
        returns (uint256[] memory)
    {
        uint256 numMail = generalUsers[addr].outbox.mailIds.length;
        uint256[] memory ret = new uint256[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[addr].outbox.mailIds[i];
            ret[i] = mid;
        }
        return ret;
    }

    function getOutboxMails(address addr) public view returns (Mail[] memory) {
        uint256 numMail = generalUsers[addr].outbox.mailIds.length;
        Mail[] memory ret = new Mail[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[addr].outbox.mailIds[i];
            ret[i] = mails[id2uuids[mid]];
        }
        return ret;
    }

    function getDraftboxMailIds(address addr)
        public
        view
        returns (uint256[] memory)
    {
        uint256 numMail = generalUsers[addr].draftbox.mailIds.length;
        uint256[] memory ret = new uint256[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[addr].draftbox.mailIds[i];
            ret[i] = mid;
        }
        return ret;
    }

    function getDraftboxMails(address addr)
        public
        view
        returns (Mail[] memory)
    {
        uint256 numMail = generalUsers[addr].draftbox.mailIds.length;
        Mail[] memory ret = new Mail[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[addr].draftbox.mailIds[i];
            ret[i] = mails[id2uuids[mid]];
        }
        return ret;
    }

    function getUser(address addr)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            bool,
            bool
        )
    {
        User memory u = generalUsers[addr];
        return (
            u.name,
            u.pubKey,
            u.description,
            u.iconIPFSHash,
            u.isCertified,
            u.isAdmin
        );
    }

    function openMail(string memory uuid) public {
        mails[uuid].isOpen = true;
        emit OnOpenMail(msg.sender, uuid);
    }

    function addAdmin(address addr)
        public
        isAdmin(msg.sender)
        isUserExists(addr)
        returns (bool)
    {
        generalUsers[addr].isAdmin = true;
        return true;
    }
}
