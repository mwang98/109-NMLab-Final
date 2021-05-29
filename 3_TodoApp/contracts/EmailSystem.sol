pragma solidity ^0.5.0;

contract EmailSystem {
    event OnOpenMail(address receiverAddr);
    event OnSendMail(bytes32 mid);

    struct MailBox {
        uint256[] mails;
    }

    struct Mail {
        uint256 id;
        address senderAddr;
        address receiverAddr;
        string subject;
        string timestamp;
        string contents;
        string[] multimediaContents; // IPFS hash values
        int256 countOpen;
    }

    struct User {
        string name;
        address addr;
        MailBox inbox;
        MailBox outbox;
    }

    address adminAddr;

    mapping(address => User) generalUsers;
    mapping(address => User) verifiedUsers;
    Mail[] mails;

    // init
    constructor() public {
        adminAddr = msg.sender;
    }

    // Modifier
    modifier isAdmin(address _addr) {
        require(_addr == adminAddr);
        _;
    }
    modifier isUserExists(address _addr) {
        require(generalUsers[_addr] != bytes(0x0));
        _;
    }
    modifier isUserNotExists(address _addr) {
        require(generalUsers[_addr] == bytes(0x0));
        _;
    }

    // Public function
    function addUser(address _addr, string _name)
        public
        isUserNotExists(_addr)
        returns (bool)
    {}

    function addCorporateUser(address _addr)
        public
        isAdmin(msg.sender)
        isUserExists(_addr)
        returns (bool)
    {}

    function validateCorporateUser(address _addr) public view returns (bool) {
        return verifiedUsers[_addr] != bytes(0x0);
    }

    function sendMail(Mail _mail) public returns (bool) {}

    function getInboxMails() public returns (Mail[] memory) {}

    function getOutboxMails() public returns (Mail[] memory) {}

    function openMail(uint256 memory mid) public {}

    function addAdmin(address _addr)
        public
        isAdmin(msg.sender)
        returns (bool)
    {}

    // Private methods
    function _encryptContent(string memory _content)
        internal
        returns (string)
    {}

    function _decryptContent(string memory _encryptedContent)
        internal
        returns (string)
    {}
}
