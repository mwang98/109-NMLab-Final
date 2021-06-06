# Progress

## Client
### Front-end
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
- Corporate User page
  - User:
    - [ ] 申請成為 corporate account
    - [ ] 已通過認證的 corporate account
  - Admin:
    - [ ] Pending applications
    - [ ] 已通過認證的 corporate account

### IPFS Server
Run IPFS server on docker
```shell
docker run -it -p 4002:4002 -p 4003:4003 -p 5002:5002 -p 9090:9090 ipfs/js-ipfs:latest
```
- [ ] Upload files to IPFS
- [ ] Pull files from IPFS 

## Blockchain
