pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract EmailSystem {
    event OnOpenMail(address receiverAddr, string uuid);
    event OnSendMail(uint256 mid);

    struct MailBox {
        uint256[] mail_ids;
    }

    struct Mail {
        string uuid;
        address senderAddr;
        address receiverAddr;
        string subject;
        string timestamp;
        string contents;
        string[3][] multimediaContents; // IPFS hash values
        bool isOpen;
    }
/*
USER
  name: str,
  addr: public_key,
  description: str,
  icon: MultiMediaContents,
  inbox: List[Mail],
  outbox: List[Mail],
  draftbox: List[Mail],
  isCertified: bool,
  applications: List[Application]
*/
    struct User {
        string name;
        string public_key;
        string description;
        string[3] icon;
        MailBox inbox;
        MailBox outbox;
        MailBox draftbox;
        bool isCertified;
    }
    address adminAddr;

    mapping(address => User) generalUsers;
    mapping(address => User) verifiedUsers;
    mapping(string => Mail) mails;
    string[] public id2uuids;

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
        string memory _s;
        require(keccak256(bytes(generalUsers[_addr].public_key)) != keccak256(bytes(_s)));
        _;
    }
    modifier isUserNotExists(address _addr) {
        string memory _s;
        require(keccak256(bytes(generalUsers[_addr].public_key)) == keccak256(bytes(_s)));
        _;
    }

    // Public function
    function setUser
        (address          _addr,
         string    memory _name, 
         string    memory _public_key, 
         string    memory discription, 
         string[3] memory icon,
         bool             isCertified)
        public
    {
        MailBox memory inbox;
        MailBox memory outbox;
        MailBox memory draftbox;
        generalUsers[_addr] = User(_name, _public_key, discription, icon, inbox, outbox, draftbox, isCertified);
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
        string memory _s;
        return (keccak256(bytes(verifiedUsers[_addr].public_key)) != keccak256(bytes(_s)));
    }

    function sendMail(Mail memory _mail) public returns (bool) {
        if( mailExist(_mail.uuid)){
            mails[_mail.uuid] = _mail;
            uint256 id=0;
            for(; id < id2uuids.length; ++id){
                if(keccak256(bytes(id2uuids[id])) == keccak256(bytes(_mail.uuid))) break;
            }
            for(uint256 i=0; i<generalUsers[_mail.senderAddr].outbox.mail_ids.length; ++i){
                if(generalUsers[_mail.senderAddr].outbox.mail_ids[i]==id)return false;
            }
            for(uint256 i=0; i<generalUsers[_mail.senderAddr].inbox.mail_ids.length; ++i){
                if(generalUsers[_mail.senderAddr].inbox.mail_ids[i]==id)return false;
            }
            bool found = false;
            for(uint256 i=0; i<generalUsers[_mail.senderAddr].draftbox.mail_ids.length; ++i){
                if(generalUsers[_mail.senderAddr].inbox.mail_ids[i]==id){
                    found = true;
                    break;
                }
            }
            if(found == false) return false;
            generalUsers[_mail.senderAddr].outbox.mail_ids.push(id);
            generalUsers[_mail.receiverAddr].inbox.mail_ids.push(id);
            
            // remove from draftbox
            uint256 index=0;
            uint256 length = generalUsers[_mail.senderAddr].draftbox.mail_ids.length;
            found = false;
            for(; index < length; ++index){
                if( generalUsers[_mail.senderAddr].draftbox.mail_ids[index] == id){
                    found = true;
                    break;
                }
            }
            if(found == true){            
                for(uint256 i=index; i+1 < length; ++i){
                    generalUsers[_mail.senderAddr].draftbox.mail_ids[i] =
                    generalUsers[_mail.senderAddr].draftbox.mail_ids[i+1];
                }
                if(length > 0){
                    delete generalUsers[_mail.senderAddr].draftbox.mail_ids[length-1];
                    generalUsers[_mail.senderAddr].draftbox.mail_ids.length--;
                }
            }
            return true;
        }
        else{
            uint256 id = id2uuids.length;
            id2uuids.push(_mail.uuid);
            mails[_mail.uuid] = _mail;
            generalUsers[_mail.senderAddr].outbox.mail_ids.push(id);
            generalUsers[_mail.receiverAddr].inbox.mail_ids.push(id);
            return true;
        }
    }
    function saveMail(address _addr, Mail memory _mail) public returns (bool) {
        if( mailExist(_mail.uuid)){
            mails[_mail.uuid] = _mail;
            return true;
        }
        else{
            uint256 id = id2uuids.length;
            id2uuids.push(_mail.uuid);
            mails[_mail.uuid] = _mail;
            generalUsers[_addr].draftbox.mail_ids.push(id);
            return true;
        }
    }
    function deleteMail(address _addr, Mail memory _mail) public returns (bool) {
        if( mailExist(_mail.uuid)){
            uint256 id=0;
            for(; id < id2uuids.length; ++id){
                if(keccak256(bytes(id2uuids[id])) == keccak256(bytes(_mail.uuid))) break;
            }
            
            uint256 index;
            uint256 length;
            bool found;
            // delete from draftbox
            index=0;
            length = generalUsers[_addr].draftbox.mail_ids.length;
            found = false;
            for(; index < length; ++index){
                if( generalUsers[_addr].draftbox.mail_ids[index] == id){
                    found = true;
                    break;
                }
            }
            if(found == true){
                for(uint256 i=index; i+1 < length; ++i){
                    generalUsers[_addr].draftbox.mail_ids[i] =
                    generalUsers[_addr].draftbox.mail_ids[i+1];
                }
                if(length > 0){
                    delete generalUsers[_addr].draftbox.mail_ids[length-1];
                    generalUsers[_addr].draftbox.mail_ids.length--;
                }
            }
            // delete from inbox
            index=0;
            length = generalUsers[_addr].inbox.mail_ids.length;
            found = false;
            for(; index < length; ++index){
                if( generalUsers[_addr].inbox.mail_ids[index] == id){
                    found = true;
                    break;
                }
            }
            if(found == true){
                for(uint256 i=index; i+1 < length; ++i){
                    generalUsers[_addr].inbox.mail_ids[i] =
                    generalUsers[_addr].inbox.mail_ids[i+1];
                }
                if(length > 0){
                    delete generalUsers[_addr].inbox.mail_ids[length-1];
                    generalUsers[_addr].inbox.mail_ids.length--;
                }
            }
            // delete from outbox
            index=0;
            length = generalUsers[_addr].outbox.mail_ids.length;
            found = true;
            for(; index < length; ++index){
                if( generalUsers[_addr].outbox.mail_ids[index] == id){
                    found = true;
                    break;
                }
            }
            if(found == true){
                for(uint256 i=index; i+1 < length; ++i){
                    generalUsers[_addr].outbox.mail_ids[i] =
                    generalUsers[_addr].outbox.mail_ids[i+1];
                }
                if(length > 0){
                    delete generalUsers[_addr].outbox.mail_ids[length-1];
                    generalUsers[_addr].outbox.mail_ids.length--;
                }
            }
            return true;
        }
        else{
            return false;
        }
    }
    function mailExist(string memory uuid) public view returns(bool) {
        Mail memory m = mails[uuid];
        address _a;
        string memory _s;
        if(keccak256(bytes(m.uuid)) != keccak256(bytes(_s))){return true;}
        if(m.senderAddr != _a){return true;}
        if(m.receiverAddr != _a){return true;}
        if(keccak256(bytes(m.subject)) != keccak256(bytes(_s))){return true;}
        if(keccak256(bytes(m.timestamp)) != keccak256(bytes(_s))){return true;}
        if(keccak256(bytes(m.contents)) != keccak256(bytes(_s))){return true;}
        if(m.multimediaContents.length != 0){return true;}
        if(m.isOpen != false){return true;}
        return false;
    }
    
    function getInboxMail_ids(address _addr) public view returns (uint256[] memory) {
        uint256 numMail = generalUsers[_addr].inbox.mail_ids.length;
        uint256[] memory ret = new uint256[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[_addr].inbox.mail_ids[i];
            ret[i] = mid;
        }
        return ret;
    }
    function getInboxMails(address _addr) public view returns (Mail[] memory) {
        uint256 numMail = generalUsers[_addr].inbox.mail_ids.length;
        Mail[] memory ret = new Mail[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[_addr].inbox.mail_ids[i];
            ret[i] = mails[id2uuids[mid]];
        }
        return ret;
    }
    function getOutboxMail_ids(address _addr) public view returns (uint256[] memory) {
        uint256 numMail = generalUsers[_addr].outbox.mail_ids.length;
        uint256[] memory ret = new uint256[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[_addr].outbox.mail_ids[i];
            ret[i] = mid;
        }
        return ret;
    }
    function getOutboxMails(address _addr) public view returns (Mail[] memory) {
        uint256 numMail = generalUsers[_addr].outbox.mail_ids.length;
        Mail[] memory ret = new Mail[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[_addr].outbox.mail_ids[i];
            ret[i] = mails[id2uuids[mid]];
        }
        return ret;
    }
    function getDraftboxMail_ids(address _addr) public view returns (uint256[] memory) {
        uint256 numMail = generalUsers[_addr].draftbox.mail_ids.length;
        uint256[] memory ret = new uint256[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[_addr].draftbox.mail_ids[i];
            ret[i] = mid;
        }
        return ret;
    }
    function getDraftboxMails(address _addr) public view returns (Mail[] memory) {
        uint256 numMail = generalUsers[_addr].draftbox.mail_ids.length;
        Mail[] memory ret = new Mail[](numMail);
        for (uint256 i = 0; i < numMail; i++) {
            uint256 mid = generalUsers[_addr].draftbox.mail_ids[i];
            ret[i] = mails[id2uuids[mid]];
        }
        return ret;
    }
    function getUser(address _addr) public view 
        returns (string memory, string memory, string memory ,string[3] memory, bool){
        User memory _u = generalUsers[_addr];
        return (_u.name, _u.public_key, _u.description, _u.icon, _u.isCertified);
    }
    function openMail(Mail memory _mail) public {
        string memory uuid = _mail.uuid;
        mails[uuid].isOpen = true;
        emit OnOpenMail(msg.sender, uuid);
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
}