# Chrislaurenz-Server Environment Setup

```bash
Setup instructions 
```

## 1. Dowload XAMPP Server

```bash
On the following url, download and install the necessary exacutable.
Url: https://www.apachefriends.org/index.html
```

## 2. Find and start the Apache and the MySql server installed with XAMPP

```bash
- In your Program-list search for XAMPP and start it with a click (or a doucle-click)
- On the XAMPP Control Panel click on the action button "Start" to start the appropriate 
  program (Apache & MySQL)
- Then click on "Admin" in other to open the "dashboard - Page" 
  (or open the following link: http://localhost:80/dashboard/)
- At next click on "phpMyAdmin" or open the following link: http://localhost:8080/phpmyadmin/
- On the shown page you can now manage your databases
```

## 3. Manage the database

```bash
- Import the provided database backup. Find the database backup under following link: <a href="https://github.com/borisfoko/ChrislaurenzPlatforms/blob/master/chrislaurenz-server/database/k123354_chrislaurenz.sql" target="_blank">DB-Backup</a>
- On the menubar click on the "Import" and browse for the \*.sql file provided on the 
  previous step and click on the "Go" button on the bottom of the page
  Now you have your database configure. Database name: k123354_chrislaurenz, Username: k123354_bkfgoal, Password: CompanyLeonidasDanceParaphTools1629
```

## 4. Now you can start the backend application (Chrislaurenz-Server)

```bash
cd chrislaurenz-server
npm install
npm start
```
  
## 5. Explore the API

```bash
- http://localhost:8000/api/product
- http://localhost:8000/api/blog
- ... (etc)
```
