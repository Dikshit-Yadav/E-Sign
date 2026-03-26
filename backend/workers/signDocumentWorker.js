const {parentPort, workerData} = require("worker_threads")
const nodemailer = require("nodemailer")
const ejs = require("ejs");
const path = require("path");

const { doc, template, emailConfig } = workerData;
//    let html = `<html>
//   <head>
//     <title>Document Preview - ${doc.title}</title>
//     <style>
//       body {
//         font-family: "Times New Roman", serif;
//         margin: 50px auto;
//         max-width: 800px;
//         padding: 40px;
//         background: #fff;
//         border: 1px solid #ccc;
//         box-shadow: 0px 0px 10px rgba(0,0,0,0.15);
//       }
//       h1 {
//         text-align: center;
//         text-transform: uppercase;
//         font-size: 24px;
//         margin-bottom: 30px;
//         border-bottom: 2px solid #000;
//         padding-bottom: 8px;
//       }
//       .field {
//         margin-bottom: 14px;
//         font-size: 16px;
//         display: flex;
//         justify-content: space-between;
//         border-bottom: 1px dashed #bbb;
//         padding: 4px 0;
//       }
//       .label {
//         font-weight: bold;
//         flex: 0 0 150px;
//       }
//       .value {
//         flex: 1;
//         text-align: right;
//       }
//       .signature-section {
//         margin-top: 50px;
//         text-align: left;
//       }
//       .signature-box {
//         display: inline-block;
//         border-top: 1px solid #000;
//         margin-top: 50px;
//         padding-top: 5px;
//         font-size: 14px;
//         text-align: center;
//       }
//       .signature-section img {
//         display: block;
//         margin-top: 10px;
//         max-width: 180px;
//         padding: 4px;
//         border-radius: 4px;
//         position: relative;
//         bottom: 145px;
//       }
//     </style>
//   </head>
//   <body>
//     <h1>${doc.title || "Court Document"}</h1>

//     <div class="field"><span class="label">Date:</span><span class="value">${doc.createdAt.toISOString().split("T")[0]}</span></div>
//     <div class="field"><span class="label">Customer:</span><span class="value">${doc.createdBy?.name || "N/A"}</span></div>
//     <div class="field"><span class="label">Amount:</span><span class="value">${template?.amount || "N/A"}</span></div>
//     <div class="field"><span class="label">Due Date:</span><span class="value">${template?.dueDate || "N/A"}</span></div>
//     <div class="field"><span class="label">Address:</span><span class="value">${template?.address || "N/A"}</span></div>
//     <div class="field"><span class="label">Court:</span><span class="value">${template?.court || "N/A"}</span></div>
//     <div class="field"><span class="label">Case ID:</span><span class="value">${template?.caseId || "N/A"}</span></div>

//     <div class="signature-section">
//       <h3>Authorized Signature</h3>
//       ${doc.signedBy?.officer
//         ? `
//             <div class="signature-box">
//               <strong>${doc.signedBy.officer.name}</strong><br/>
//               <small>Signed on: ${doc.signedBy.signedAt ? new Date(doc.signedBy.signedAt).toLocaleString() : "N/A"}</small>
//               <img src="${doc.signedBy.signature}" alt="Signature" />
//             </div>
//           `
//         : "<p>No signature provided yet.</p>"
//       }
//     </div>
//   </body>
// </html>
// `;

async function sendMail() {
  // console.log(emailConfig.user,doc.createdBy.email)
  try {
    const templatePath = path.join(__dirname, "../views/emailDoc.ejs");

    const html = await ejs.renderFile(templatePath, {
      doc,
      template
    });
    // console.log(html);
    const transporter = nodemailer.createTransport(emailConfig);
    await transporter.sendMail({
      from: `"Court E-Sign" <${emailConfig.auth.user}>`,
      to: doc.createdBy.email,
      subject: `Your Document Signed`,
      html,
    });

    parentPort.postMessage({ success: true });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
}

sendMail();
