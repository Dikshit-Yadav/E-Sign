import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

export const generatePDF = async (templates) => {
  for (const tpl of templates) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const drawText = (text, x, y, size = 14) => {
      page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
    };

    drawText("Court Document Template", 200, height - 50, 18);
    drawText(`Date: ${tpl.date}`, 50, height - 100);
    drawText(`Customer: ${tpl.customer}`, 50, height - 130);
    drawText(`Amount: ${tpl.amount}`, 50, height - 160);
    drawText(`Due Date: ${tpl.dueDate}`, 50, height - 190);
    drawText(`Address: ${tpl.address}`, 50, height - 220);
    drawText(`Court: ${tpl.court}`, 50, height - 250);
    drawText(`Case ID: ${tpl.caseId}`, 50, height - 280);

    drawText("Signature:", 50, height - 330);
    drawText("__________________", 130, height - 330);

    const qrValue = `Customer: ${tpl.customer}, Case ID: ${tpl.caseId}, Amount: ${tpl.amount}`;
    const qrDataUrl = await QRCode.toDataURL(qrValue);
    const qrImage = await pdfDoc.embedPng(qrDataUrl);
    page.drawImage(qrImage, { x: 400, y: height - 380, width: 80, height: 80 });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Court_Template_${tpl.caseId}.pdf`;
    link.click();
  }
};
