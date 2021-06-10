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
    addr: str,
    description: str,
    icon: MultiMediaContents,
    inbox: List[Mail],
    outbox: List[Mail],
    draftbox: List[Mail],
    isCertified: bool,
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
    - [ ] Text
    - [ ] PDF
    - [ ] Image
    - [ ] Video
  - [ ] 上傳後移除
- Send Mail
  - [ ] 加密
  - [ ] 解密
- Login Page
  - [ ] Register user/admin (userName, Avatar, password)
  - [ ] Login user/amin (address, password)


## 進度規劃
- User Profile
  - [ ] Mock User Data: x3
  - [ ] User Profile / Welcome Pages  
    - 前端：
      - [ ]  呈現 name, address, description, icons
      - [ ]  保存更改設定
    - 後端：
      - [ ] Get user data
      - [ ] Set user datas
- 寄信
  - [ ] New mail 的 route 跳轉設定
  - [ ] Reply 的 route 跳轉設定
  - [ ] Component - Eth 串連
    - [ ] 自動帶入 senderName、 senderAddr
    - [ ] 給定 receiverAddr 自動帶入 receiverName
  - [ ] 加解密
- 收信
  - [ ] Component - Eth 串連
- Certified User page
  - User:
    - [ ] 申請成為 corporate account
    - [ ] 已通過認證的 corporate account
  - Admin:
    - [ ] Pending applications
    - [ ] 已通過認證的 corporate account
  - 後端：
    - [ ] user 提交申請
    - [ ] user 擷取自己的申請紀錄
    - [ ] admin 擷取所有的申請紀錄
    - [ ] admin 更新申請


### IPFS Server
Run IPFS server on docker
```shell
docker run -it -p 4002:4002 -p 4003:4003 -p 5002:5002 -p 9090:9090 ipfs/js-ipfs:latest
```
- [ ] Upload files to IPFS
- [ ] Pull files from IPFS 

## Blockchain
