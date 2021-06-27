# Progress

## Client
### Front-end
- Data structure
  Mail
  ```javascript
  {
    id: str,
    senderAddr: str,
    receiverAddr: str,
    subject: str,
    timestamp: str,
    contents: str,
    multimediaContents: List[MultiMediaContents],
    isOpen: bool
  }
  ```

  User
  ```javascript
  {
    name: str,
    pubKey: str,
    description: str,
    icon: MultiMediaContents,
    inbox: List[Mail],
    outbox: List[Mail],
    draftbox: List[Mail],
    isCertified: bool,
    isAdmin: bool,
    applications: List[Application]
  }
  ```
  
  Application 
    ```javascript
    {
      id: int,
      name: str,
      address: str,
      description: str,
      status: str
    }
    ``` 
  
  MultiMediaContents
  ```javascript
  {
    fileName: str,
    fileType: str,
    IPFSHash: str,
  }
  ```

- Mail Previewer
  - 支援以下資料格式
    - [x] Text
    - [x] PDF
    - [x] Image
    - [ ] Video
  - [ ] 上傳後移除
- Send Mail
  - [x] 加密
  - [x] 解密


## 進度規劃
- User Profile
  - [x] Mock User Data: x3
  - [x] User Profile / Welcome Pages  
    - 前端：
      - [x]  呈現 name, address, description, icons
      - [x]  保存更改設定
    - 後端：
      - [x] Get user data: 回傳非 List 的資料
      - [x] Set user datas: 丟非 List 的資料
- 寄信
  - [x] New mail 的 route 跳轉設定
  - [ ] Reply 的 route 跳轉設定
  - [ ] Component - Eth 串連
    - [x] 自動帶入 senderName、 senderAddr
    - [x] 給定 receiverAddr 自動帶入 receiverName
  - [ ] 加解密
- 收信
  - [x] Component - Eth 串連
- 刪除信件
  - [x] Component - Eth 串連
- Certified User page
  - User:
    - [x] 申請成為 corporate account
    - [x] 已通過認證的 corporate account
  - Admin:
    - [x] Pending applications
    - [x] 已通過認證的 corporate account
  - 後端：
    - [x] user 提交申請
    - [x] user 擷取自己的申請紀錄
    - [x] admin 擷取所有的申請紀錄
    - [x] admin 更新申請
 - UI 顯示
   - [x] 是否為 Certified User
     - [x] Profile Page
     - [x] Mail Card
     - [x] Mail Editor
   - [x] 上傳 User Icon
 - 修改
   - UI
     - [ ] Save / Send UI

### IPFS Server
Run IPFS server on docker
```shell
docker run -it -p 4002:4002 -p 4003:4003 -p 5002:5002 -p 9090:9090 ipfs/js-ipfs:latest
```
- [ ] Upload files to IPFS
- [ ] Pull files from IPFS 

## Blockchain
