# README

# Decentralized Email System for more security

109-2 Network & Multimedia Lab Final Project

- B06901061 電機四 王廷峻
- B06901170 電機四 黃彥翔

---

## Prerequisites

Make sure the following npm packages are installed globally

```
├── ganache-cli@6.9.1
├── truffle@5.1.24
├── ipfs-core@0.7.1
├── ipfs-http-client@50.1.1
└── ipfs@0.55.3

```

## How to
Note that if the program is not running on a macOS system, please run 

```
~$ bash rename.sh
```
### Start a local Ethereum network

```
~$ cd App
```

To start ganache-cli emulator:

```
~$ ganache-cli --account_keys_path FILE.json
```

FILE.json will contain accounts information.

To show the activated accounts information:

```
~$ python3 account.py FILE.json
```

To compile and deploy the smart contract:

```
~$ truffle compile 
~$ truffle migrate
```

Then, move build/ into crypto-email/src/

```
~$ mv build crypto-email/src/
```
Note that if there is already a directory crypto-email/src/build/ please remove it by:
```
~$ rm -rf crypto-email/src/build/
```

In directory App/crypto-email/, use yarn to install the packages:

```
~$ yarn install
~$ yarn add eth-crypto
```
p.s. try sudo if any unexpected errors

Finally, the DApp can be started by:

```
~$ yarn start
```
p.s. try sudo if any unexpected errors

### Web client
First, open MetaMask on google Chrome or Microsoft Edge.

Second, Import the valid accounts by entering their private keys. The network should be localhost 8545.

The accounts info can be found by:

```
~$ python3 account.py FILE.json
```

Visit the site http://localhost:3000/ to use the Decentralizedd email system.

Remember to connected the imported accounts to the site.

## Motivations

Email is the most critical communication service we use in our everyday life. Governments, multinational corporations, schools, or even individuals rely upon email systems to discuss policies, trade secrets, announcements, etc. However, the existing centralized email system has the following problems—first, the security problem. Email security draws much attention, for example, the Hillary Clinton email controversy. The email service provider could monitor the email. Or, once the server is hacked, the secrets in the email service would all be leaked. The second is the preservation problem. The centralized systems all have the risk of losing the data stored on a server by any possibility. For example, a devastating fire destroyed a data center of the largest hosting provider in Europe, OVH, in 2021 March. The fire smashed 25 servers of "RUST," a survival video game, and the developer, Facepunch, claimed that the data was lost. It might be a disaster if such an accident occurs on an email data center since the information in emails was far more critical than games. Thus, we decide to build a decentralized email system upon the Ethereum blockchain.

## Features

- Use 3 basic functionalities of a general email system, including
    - Sending mails
    - Receiving mails
    - Saving drafts
- Send & Save either encrypted or  plan-text mails
    - Subjects, mail contents, and multimedia contents attached in emails are securely encrypted by the public key of a receiver or that of the user when sending and saving mails
    - File names and contents are encrypted as well
- Upload & download & preview files on the website
    - Currently supports files `*.pdf`, `*.jpg`,`*.png`, and `*.txt`
    - Files are stored in the IPFS node
- Access read & unread status
    - Mail receivers and senders are notified as long as mails are opened
- Officially certified users to avoid email phishing
    - Mails from certified users are trustworthy since we officially verify their identities
    - General users can be certified when their applications are submitted and successfully accepted by admins
    - Admin users can authorize others as admins and review user applications
- Modify account information
    - Public key, brief self-introduction, and profile image are editable

## Appendix

### Technical details

### Ethereum back-end

Compiler

- solidity ^0.5.0
- experimental ABIEncoderV2

Data structure

1.  User—to store the user information

    ```
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
    ```

2. Application—to store applications made by users

    Note that only admin users can certify the applications.

    ```
    struct App {
            uint256 id;
            string name;
            address addr;
            string description;
            string status;
        }
    ```

3. Mail—to store the data of emails

    Note that Javascript, not Solidity, does the encryption and decryption of an email on the front-end. Thus, the miners will not get any information for the public key or private key.

    ```
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
    ```

4. Mailbox, Appbox—integer arrays which store the IDs of Mails and Applications respectively
5. We used mapping(address => User) to store all of our users. The mails are also stored by mapping, mapping(string => Mail), which maps a UUID string to a Mail structure.
6. We also introduce the certification system. The users who have the authority to reject or accept a certification application are called "admin." Whether a user is an admin or not is store in the User structure. However, the first admin—genesisAdmin, is stored as a member variable in the contract to prevent a power vacuum. The users whose application is accepted will become certificated users, which is stored by an address array.

Supported back-end functions

1. User-related ( * means admin only)
    - setUser                   —set up user profile
    - getCertifiedUsers —get all certified users
    - *acceptUser           —accept user's application (certificate user)
    - *rejectApp               —reject user's application
    - *banUser                 —make user uncertificated
    - *addAdmin              —make a user become admin
    - getUser                    —get users profile
2. Application-related ( * means admin only)
    - *getAllApp               —get all users' applications
    - getUserApp             —get user's applications by address
    - submitApp               —submit an application to admin users
3. Email-related ( * means admin only)
    - sendMail                   —send an email
    - saveMail                    —save an email
    - deleteMail                 —delete an email from the user's mailbox (note that the mail does not deleted from the database)
    - getInboxMails           —get all mails from Inbox
    - getOutboxMails        —get all mails from Outbox
    - getDraftboxMails      —get all mails from Draftbox
    - openMail                     —change the mail's status to 'read'
