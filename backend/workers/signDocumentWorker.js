const {parentPort, workerData} = require("worker_threads")
const nodemailer = require("nodemailer")
const ejs = require("ejs");
const path = require("path");

const { doc, template, emailConfig } = workerData;

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
      from: `"Court E-Sign" <${emailConfig.user}>`,
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