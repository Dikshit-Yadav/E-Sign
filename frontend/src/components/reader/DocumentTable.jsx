import React, { useState, useEffect } from "react";
import TemplateForm from "./TemplateForm";
import { Table, Dropdown, Menu, Button, message, Form, Tag, Select, Popconfirm, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import Cookies from "js-cookie";

const { Option } = Select;

const DocumentTable = ({ docs, refreshDocs }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [form] = Form.useForm();
  // const [docs, setDocs] = useState([]);
  const [docTemplates, setDocTemplates] = useState({});
  const [officers, setOfficers] = useState([]);
  const [officerDropdown, setOfficerDropdown] = useState(null);
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  // const [sentForSignature, setSentForSignature] = useState({});

  // const fetchDocs = async () => {
  //   try {
  //     const userId = Cookies.get("userId");
  //     const res = await fetch(`http://localhost:4500/documents?userId=${userId}`);
  //     const data = await res.json();
  //     setDocs(data);

  //     const templatesMap = {};
  //     data.forEach((doc) => {
  //       if (doc.templates?.length > 0) {
  //         templatesMap[doc._id] = doc.templates;
  //       }
  //     });
  //     setDocTemplates(templatesMap);
  //   } catch (err) {
  //     console.error("Error fetching docs:", err);
  //     message.error("Failed to fetch documents");
  //   }
  // };

  const removeDocument = async (docId) => {
    try {
      const res = await fetch(`http://localhost:4500/documents/${docId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      message.success("Document removed!");
      refreshDocs();
    } catch (err) {
      message.error("Failed to remove document");
    }
  };

  const fetchOfficers = async (docId) => {
    try {
      setLoadingOfficers(true);
      const res = await fetch(`http://localhost:4500/documents/${docId}/officers`);
      const data = await res.json();
      setOfficers(data);
      setOfficerDropdown(docId);
    } catch (err) {
      console.error("Error fetching officers:", err);
      message.error("Failed to load officers");
    } finally {
      setLoadingOfficers(false);
    }
  };

  // useEffect(() => {
  //   fetchDocs();
  // }, []);

  const handleTitleClick = (record) => {
    setSelectedDoc(record);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const customers = values.customerName.split(",").map((c) => c.trim());
      const amounts = values.amount.split(",").map((a) => a.trim());
      const dueDates = values.dueDate.split(",").map((d) => d.trim());
      const addresses = values.address.split(",").map((a) => a.trim());
      const courts = values.court.split(",").map((c) => c.trim());
      const caseIds = values.caseId.split(",").map((c) => c.trim());

      const templates = customers.map((customer, idx) => ({
        date: values.date?.format("YYYY-MM-DD"),
        customer,
        amount: amounts[idx] || amounts[0],
        dueDate: dueDates[idx] || dueDates[0],
        address: addresses[idx] || addresses[0],
        court: courts[idx] || courts[0],
        caseId: caseIds[idx] || caseIds[0],
      }));

      setDocTemplates((prev) => ({ ...prev, [selectedDoc._id]: templates }));
      setIsModalVisible(false);
      form.resetFields();

      const res = await fetch(
        `http://localhost:4500/documents/${selectedDoc._id}/save-template`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId: selectedDoc._id, templates }),
        }
      );

      const updatedDoc = await res.json();
      if (!res.ok) throw new Error(updatedDoc.message);

      setDocs((prev) =>
        prev.map((doc) => (doc._id === updatedDoc.doc._id ? updatedDoc.doc : doc))
      );

      message.success("Template(s) saved to MongoDB!");
    } catch (err) {
      console.error("Error saving template:", err);
      message.error("Failed to save to DB");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };


  // const generatePDF = async (templates) => {
  //   try {
  //     for (const tpl of templates) {
  //       const pdfDoc = await PDFDocument.create();
  //       const page = pdfDoc.addPage([600, 800]);
  //       const { height } = page.getSize();

  //       const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  //       const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  //       const drawText = (text, x, y, size = 12, bold = false, align = "left") => {
  //         const textWidth = (bold ? fontBold : font).widthOfTextAtSize(text, size);
  //         const drawX = align === "center" ? (600 - textWidth) / 2 : x;
  //         page.drawText(text, {
  //           x: drawX,
  //           y,
  //           size,
  //           font: bold ? fontBold : font,
  //           color: rgb(0, 0, 0),
  //         });
  //       };

  //       let y = height - 60;

  //       // Title
  //       drawText("Court Document Template", 0, y, 18, true, "center");

  //       y -= 40;

  //       // Helper to draw fields
  //       const drawField = (label, value) => {
  //         drawText(`${label}:`, 50, y, 12, true);
  //         drawText(value || "N/A", 200, y);
  //         y -= 25;
  //         // Draw separator line
  //         page.drawLine({
  //           start: { x: 50, y: y + 10 },
  //           end: { x: 550, y: y + 10 },
  //           thickness: 0.5,
  //           color: rgb(0.7, 0.7, 0.7),
  //           dashArray: [2, 2],
  //         });
  //       };

  //       drawField("Date", tpl.date);
  //       drawField("Customer", tpl.customer);
  //       drawField("Amount", tpl.amount);
  //       drawField("Due Date", tpl.dueDate);
  //       drawField("Address", tpl.address);
  //       drawField("Court", tpl.court);
  //       drawField("Case ID", tpl.caseId);

  //       y -= 40;

  //       // Signature Section
  //       drawText("Authorized Signature", 50, y, 14, true);
  //       y -= 20;

  //       // Signature Line
  //       page.drawLine({
  //         start: { x: 130, y },
  //         end: { x: 300, y },
  //         thickness: 1,
  //         color: rgb(0, 0, 0),
  //       });
  //       y -= 15;

  //       drawText(tpl.signedBy?.officer?.name || "Not signed", 130, y, 12);
  //       y -= 15;

  //       drawText(
  //         `Signed on: ${tpl.signedBy?.signedAt ? new Date(tpl.signedBy.signedAt).toLocaleString() : "N/A"}`,
  //         130,
  //         y,
  //         10
  //       );

  //       // Optional signature image
  //       if (tpl.signedBy?.signature) {
  //         const sigImage = await pdfDoc.embedPng(tpl.signedBy.signature);
  //         const sigDims = sigImage.scale(0.25);
  //         page.drawImage(sigImage, {
  //           x: 400,
  //           y: y - 30,
  //           width: sigDims.width,
  //           height: sigDims.height,
  //         });
  //       }

  //       // Optional QR Code
  //       const qrValue = `Customer: ${tpl.customer}, Case ID: ${tpl.caseId}, Amount: ${tpl.amount}`;
  //       const qrDataUrl = await QRCode.toDataURL(qrValue);
  //       const qrImage = await pdfDoc.embedPng(qrDataUrl);
  //       page.drawImage(qrImage, {
  //         x: 400,
  //         y: 80,
  //         width: 80,
  //         height: 80,
  //       });

  //       // Download PDF
  //       const pdfBytes = await pdfDoc.save();
  //       const blob = new Blob([pdfBytes], { type: "application/pdf" });
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = `Court_Template_${tpl.caseId}.pdf`;
  //       link.click();
  //     }

  //     message.success("PDF(s) downloaded!");
  //   } catch (err) {
  //     console.error(err);
  //     message.error("PDF generation failed");
  //   }
  // };
  const generatePDF = async (templates) => {
    try {
      for (const tpl of templates) {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { height } = page.getSize();

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const drawText = (text, x, y, size = 12, bold = false, align = "left") => {
          const textWidth = (bold ? fontBold : font).widthOfTextAtSize(text, size);
          const drawX = align === "center" ? (600 - textWidth) / 2 : x;
          page.drawText(text, {
            x: drawX,
            y,
            size,
            font: bold ? fontBold : font,
            color: rgb(0, 0, 0),
          });
        };

        let y = height - 60;
        drawText("Court Document Template", 0, y, 18, true, "center");
        y -= 40;

        const drawField = (label, value) => {
          drawText(`${label}:`, 50, y, 12, true);
          drawText(value || "N/A", 200, y);
          y -= 25;
        };

        drawField("Date", tpl.date);
        drawField("Customer", tpl.customer);
        drawField("Amount", tpl.amount);
        drawField("Due Date", tpl.dueDate);
        drawField("Address", tpl.address);
        drawField("Court", tpl.court);
        drawField("Case ID", tpl.caseId);

        y -= 40;
        drawText("Authorized Signature", 50, y, 14, true);
        y -= 20;

        page.drawLine({
          start: { x: 130, y },
          end: { x: 300, y },
          thickness: 1,
          color: rgb(0, 0, 0),
        });

        y -= 15;
        drawText(tpl.signedBy?.officer?.name || "Not signed", 130, y, 12);

        if (tpl.signedBy?.signature) {
          const sigImage = await pdfDoc.embedPng(tpl.signedBy.signature);
          const sigDims = sigImage.scale(0.25);
          page.drawImage(sigImage, {
            x: 400,
            y: y - 30,
            width: sigDims.width,
            height: sigDims.height,
          });
        }

        const qrValue = `Customer: ${tpl.customer}, Case ID: ${tpl.caseId}, Amount: ${tpl.amount}`;
        const qrDataUrl = await QRCode.toDataURL(qrValue);
        const qrImage = await pdfDoc.embedPng(qrDataUrl);
        page.drawImage(qrImage, { x: 400, y: 80, width: 80, height: 80 });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Court_Template_${tpl.caseId}.pdf`;
        link.click();
      }

      message.success("PDF(s) downloaded!");
    } catch (err) {
      console.error(err);
      message.error("PDF generation failed");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (_, record) => (
        <Button type="link" disabled={record.status === "signed"}
        style={{color:"green"}}
         onClick={() => handleTitleClick(record)}>
          {record.title}
        </Button>
      ),
    },
    { title: "Number of Documents", dataIndex: "numberOfDocuments" },
    { title: "Rejected Documents", dataIndex: "rejectedDocuments" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (val) =>
        val ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(val)) : "-",
    },
    {
      title: "Last Activity",
      dataIndex: "updatedAt",
      render: (val) =>
        val ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(val)) : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const color = status === "approved" ? "green" : status === "pending" ? "blue" : "red";
        return <Tag color={color}>{status?.toUpperCase() || "UNKNOWN"}</Tag>;
      },
    },
    {
      title: "Actions",
      render: (_, record) => {
        const templates = record.template || docTemplates[record._id];
        const menu = (
          <Menu>
            <Menu.Item
              key="download"
              // disabled={!templates?.length}
              onClick={() => generatePDF(templates)}
            >
              Download Templates
            </Menu.Item>
            <Menu.Item key="send"
             disabled={record.status === "signed"}
              onClick={() => fetchOfficers(record._id)}>
              Send for Signature
            </Menu.Item>
            <Menu.Item key="remove" danger>
              <Popconfirm
                title="Are you sure you want to delete this document?"
                onConfirm={() => removeDocument(record._id)}
              >
                Remove
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );

        return (
          <>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button>
                Actions <DownOutlined />
              </Button>
            </Dropdown>

            {officerDropdown === record._id && (
              <div style={{ marginTop: 10 }}>
                {loadingOfficers ? (
                  <Spin size="small" />
                ) : (
                  <Select
                    placeholder="Select Officer"
                    style={{ width: 200 }}
                    onChange={async (officerId) => {
                      try {
                        const res = await fetch(
                          `http://localhost:4500/documents/${record._id}/send`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ officerId }),
                          }
                        );
                        if (!res.ok) throw new Error("Failed to send");
                        message.success("Document sent for signature!");

                        refreshDocs();
                        setOfficerDropdown(null);
                      } catch {
                        message.error("Failed to send document");
                      }
                    }}
                  >
                    {officers.map((officer) => (
                      <Option key={officer._id} value={officer._id}>
                        {officer.name || officer.email}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Table dataSource={docs} columns={columns} rowKey="_id" />

      <TemplateForm
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        form={form}
        selectedTitle={selectedDoc?.title}
      />
    </>
  );
};

export default DocumentTable;
