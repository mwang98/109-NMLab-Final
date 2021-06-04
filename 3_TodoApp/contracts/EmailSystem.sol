pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract EmailSystem {
    event OnOpenMail(address receiverAddr, uint256 mid);
    event OnSendMail(uint256 mid);

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
        string public_key;
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
        require(generalUsers[_addr].addr != address(0));
        _;
    }
    modifier isUserNotExists(address _addr) {
        require(generalUsers[_addr].addr == address(0));
        _;
    }

    // Public function
    function addUser(string memory _name, string memory _public_key)
        public
        isUserNotExists(msg.sender)
        returns (bool)
    {
        MailBox memory inbox;
        MailBox memory outbox;
        generalUsers[msg.sender] = User(_name, _public_key, msg.sender, inbox, outbox);
        return true;
    }

    function addCorporateUser(address _addr)
        public
        isAdmin(msg.sender)
        isUserExists(_addr)
        returns (bool)
    {
        verifiedUsers[_addr] = generalUsers[_addr];
        return true;
    }

    function validateCorporateUser(address _addr) public view returns (bool) {
        return verifiedUsers[_addr].addr != address(0);
    }

    function sendMail(Mail memory _mail) public returns (bool) {
        mails.push(_mail);
        generalUsers[_mail.senderAddr].outbox.mails.push(_mail.id);
        generalUsers[_mail.receiverAddr].inbox.mails.push(_mail.id);
        return true;
    }
    function getInboxMails() public view returns (Mail[] memory) {
        uint256 numMail = generalUsers[msg.sender].inbox.mails.length;
        Mail[] memory ret = new Mail[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[msg.sender].inbox.mails[i];
            ret[i] = mails[mid];
        }
        return ret;
    }

    function getOutboxMails() public view returns (Mail[] memory) {
        uint256 numMail = generalUsers[msg.sender].outbox.mails.length;
        Mail[] memory ret = new Mail[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[msg.sender].outbox.mails[i];
            ret[i] = mails[mid];
        }
        return ret;
    }

    function openMail(uint256 mid) public {
        mails[mid].countOpen ++;
        emit OnOpenMail(msg.sender, mid);
    }

    function addAdmin(address _addr)
        public
        isAdmin(msg.sender)
        isUserExists(_addr)
        returns (bool)
    {
        verifiedUsers[_addr] = generalUsers[_addr];
        return true;
    }

    // Private methods
    function _encryptContent(string memory _content)
        internal
        returns (string memory) 
    {}

    function _decryptContent(string memory _encryptedContent)
        internal
        returns (string memory )
    {}
}
