## 功能
1.使用者可註冊帳號  

2.使用者於登入後才可使用功能

3.使用者可於首頁瀏覽所有支出及總金額

4.使用者可依類別篩選顯示的支出紀錄及總金額

5.使用者可建立支出紀錄
 
6.使用者可編輯及刪除支出紀錄

## 環境建置與需求
Node.js v14.16.0  
Mongodb v5.0.6
## 安裝與執行步驟
1.請先確認已安裝node.js及Mongodb  
  
2.使用終端機將此專案下載至本機
```
git clone https://github.com/smile19439/expense-tracker.git
```  
3.cd至存放專案的資料夾後，使用npm安裝套件
```
npm install
```
  
4.輸入以下指令載入種子資料
```
npm run seed
```
5.若您有安裝nodemon，可使用以下指令執行
```
npm run dev
```
若您沒有安裝nodemon，則可使用以下指令
```
npm run start
```
6.終端機顯示以下訊息即代表成功啟動  
>App is runing on http://localhost:3000
  
7.點擊以下路徑即可開始使用
>http://localhost:3000
