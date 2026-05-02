# eSign - Digital Signature Platform

## Description

**eSign is a full-stack web application built using the MERN stack that allows users to upload, sign, and manage documents digitally. The platform ensures secure authentication and efficient document handling, making it useful for real-world scenarios like agreements, approvals, and remote signing.**

**This project demonstrates backend architecture, authentication, file handling, and real-time user workflows.**

---

## Features

###  Authentication & Security

* User Login using JWT
* Role-based access (Admin, Officer, Reader)

---

###  Admin Panel

* Add and manage courts
* Assign Readers and Officers to courts
* Send role assignment emails to users
* View court details:

  * Total Readers
  * Total Officers
  * Total Documents Signed / Rejected
* Filter and manage data efficiently

---

###  Reader (User) Features

* Create document requests
* Fill forms and submit for signature
* Upload supporting documents
* Download template forms
* Send documents for signature
* Remove document requests
* Track document status (Pending / Signed / Rejected)

---

### Officer Features

* View assigned document requests
* Verify document details
* Reject request if details are invalid
* Approve and sign valid documents
* Update signature status

---

###  Document Management

* Upload documents
* View and manage uploaded files
* Download signed documents

---

###  Digital Signature

* Add digital signatures to documents
* Position signature on document
* Save signed version securely

---

###  Email Integration

* Send documents via email
* Notifications using Nodemailer

---

###  Security Features

* Protected routes
* Input validation
* Secure file storage

---

##  Tech Stack

* **Frontend:** EJS, HTML, CSS, JavaScript, React, Ant Design
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT
* **File Handling:** Multer / Cloud Storage
* **Email Service:** Nodemailer

---

##  Project Folder Structure

```bash
esign/
│
├── backend/
│   │
│   ├── models/
│   │   ├── User.js                # Admin / Officer / Reader schema
│   │   ├── Document.js            # Document schema
│   │   ├── Court.js               # Court schema 
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── documentController.js
│   │   ├── officerController.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── documents.js
│   │   ├── admin.js
│   │   ├── officer.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── uploadSignature.js     # Multer config
│   │
│   ├── views/                    # EJS Templates
│   │   ├── documentpreview.ejs
│   │   ├── emailDoc.ejs
│   │
│   ├── workers/
│   │   ├── signDocumentWorker.js
│   │
│   ├── uploads/                  # Uploaded documents
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── cluster.js                # Cluster setup
│   ├── server.js                 # Main server file
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/              # images, icons, fonts
│   │   │
│   │   ├── components/          # reusable UI components
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── AddUsercourt.jsx
│   │   │   │   ├── CourtActions.jsx
│   │   │   │   ├── CourtModals.jsx
│   │   │   │   ├── CourtStatus.jsx
│   │   │   │   ├── CourtTable.jsx
│   │   │   │   ├── DocumentTable.jsx
│   │   │   │   ├── UserTable.jsx
│   │   │   │
│   │   │   ├── officer/
│   │   │   │   ├── DocumentTable.jsx
│   │   │   │   ├── OfficerSidebar.jsx
│   │   │   │
│   │   │   ├── reader/
│   │   │   │   ├── DocumentForm.jsx
│   │   │   │   ├── DocumentTable.jsx
│   │   │   │   ├── ReaderSidebar.jsx
│   │   │   │   ├── TemplateForm.jsx
│   │   │   │
│   │   │   ├── Addcourt.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Logout.jsx
│   │   │   ├── ProtectedRouteWrapper.jsx
│   │   │   ├── SideBar.jsx
│   │   │
│   │   ├── pages/               # route-based pages
│   │   │   ├── CourtDetails.jsx
│   │   │   ├── DocumentPreview.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OfficerHome.jsx
│   │   │   ├── ReaderHome.jsx
│   │   │
│   │   ├── styles/
│   │   │   ├── header.css
│   │   │   ├── login.css
│   │   │   ├── sidebar.css
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │
│   ├── .env
│   ├── package.json
```


---

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/esign-app.git
cd esign-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### 4. Run the application

```bash
npm start
```

---

##  Usage

1. Login with role
2. Create a document request
3. Fill form and upload documents
4. Send for signature
5. Officer reviews and signs/rejects
6. Track status and download signed document

---

##  Screenshots

(Add screenshots here)

---

##  Future Improvements

* Role-based Super Admin panel
  * Manage all courts globally
  * Monitor system-wide analytics
  * Control Admin access & permissions
* Real-time notifications (Socket.IO)
* Document version history

---

##  Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

##  Author

Dikshit Yadav
Full-Stack MERN Developer

---

##  License

This project is licensed under the MIT License.
