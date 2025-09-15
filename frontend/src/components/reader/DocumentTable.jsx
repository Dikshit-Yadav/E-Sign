import React, { useState, useEffect } from "react";
import TemplateForm from "./TemplateForm";
import { Table, Dropdown, Menu, Button, message, Form } from "antd";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { DownOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";


const DocumentTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [form] = Form.useForm();
  const [docs, setDocs] = useState([]);
  const [docTemplates, setDocTemplates] = useState({});
  const [officers, setOfficers] = useState([]);
  const [officerDropdown, setOfficerDropdown] = useState(null);

  const removeDocument = (docId) => {
    fetch(`http://localhost:4500/documents/${docId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        message.success("Document removed!");
        fetchDocs();
      })
      .catch(() => message.error("Failed to remove document"));
  };

  const fetchDocs = async () => {
    try {
       const userId = Cookies.get("userId");
      const res = await fetch(`http://localhost:4500/documents?userId=${userId}`);
      const data = await res.json();
      setDocs(data);

      const templatesId = {};
      data.forEach((doc) => {
        if (doc.templates && doc.templates.length > 0) {
          templatesId[doc._id] = doc.templates;
        }
      });
      setDocTemplates(templatesId);
    } catch (err) {
      console.error("Error fetching docs:", err);
    }
  };

  const fetchOfficers = async (docId) => {
    try {
      const res = await fetch(`http://localhost:4500/documents/${docId}/officers`);
      const data = await res.json();

      setOfficers(data);
      setOfficerDropdown(docId);
    } catch (err) {
      console.error("Error fetching officers:", err);
    }
  };




  useEffect(() => {


    fetchDocs();
  }, []);

  const handleTitleClick = (record) => {
    setSelectedDoc(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
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

      try {
        const response = await fetch(
          `http://localhost:4500/documents/${selectedDoc._id}/save-template`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentId: selectedDoc._id, templates }),
          }
        );

        const updatedDoc = await response.json();
        if (!response.ok) throw new Error(updatedDoc.message);

        setDocs((prev) =>
          prev.map((doc) =>
            doc._id === updatedDoc.doc._id ? updatedDoc.doc : doc
          )
        );

        message.success("Template(s) saved to MongoDB!");
      } catch (err) {
        console.error("Error saving to DB:", err);
        message.error("Failed to save to DB");
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const generatePDF = async (templates) => {
    try {
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
        page.drawImage(qrImage, {
          x: 400,
          y: height - 380,
          width: 80,
          height: 80,
        });

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
        <Button type="link" onClick={() => handleTitleClick(record)}>
          {record.title}
        </Button>
      ),
    },
    { title: "Number of Documents", dataIndex: "numberOfDocuments" },
    { title: "Rejected Documents", dataIndex: "rejectedDocuments" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (val) => (val ? new Date(val).toLocaleString() : "-"),
    },
    {
      title: "Last Activity Date",
      dataIndex: "updatedAt",
      render: (val) => (val ? new Date(val).toLocaleString() : "-"),
    },
    { title: "Request Status", dataIndex: "status" },

    {
      title: "Action",
      render: (_, record) => {
        const templates = record.template || docTemplates[record._id];

        if (!templates || templates.length === 0) {
          return <span style={{ color: "#aaa" }}>Fill Form First</span>;
        }

        const menu = (
          <Menu>
            <Menu.Item key="download" onClick={() => generatePDF(templates)}>
              Download Templates
            </Menu.Item>
            <Menu.Item key="send" onClick={() => fetchOfficers(record._id)}>
              Send for Signature
            </Menu.Item>


            <Menu.Item key="remove" danger onClick={() => removeDocument(record._id)}>
              Remove
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
                <select
                  onChange={(e) => {
                    const officerId = e.target.value;
                    if (officerId) {
                      fetch(`http://localhost:4500/documents/${record._id}/send`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ officerId }),
                      })
                        .then((res) => res.json())
                        .then(() => {
                          message.success("Document sent for signature!");
                          fetchDocs();
                          setOfficerDropdown(null);
                        })
                        .catch(() => message.error("Failed to send"));
                    }
                  }}
                >
                  <option value="">Select Officer</option>
                  {officers.map((officer) => (
                    <option key={officer._id} value={officer._id}>
                      {officer.name || officer.email}
                    </option>
                  ))}

                </select>
              </div>
            )}

          </>
        );
      }
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
