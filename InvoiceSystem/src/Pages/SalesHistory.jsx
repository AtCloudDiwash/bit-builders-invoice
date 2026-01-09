import { useEffect, useState } from "react";
import { supabase } from "../client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch sales logs from Supabase
  useEffect(() => {
    async function fetchSales() {
      const { data, error } = await supabase
        .from("sales_log")
        .select("id, dump, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMsg("Error fetching sales history.");
        return;
      }

      setSales(data);
    }

    fetchSales();
  }, []);

  // Save invoice as PDF
  const handleSavePDF = (sale) => {
    const doc = new jsPDF();
    const items = JSON.parse(sale.dump);

    doc.setFontSize(16);
    doc.text("Invoice", 14, 20);
    doc.setFontSize(12);
    doc.text(`Sale ID: ${sale.id}`, 14, 28);
    doc.text(`Date: ${new Date(sale.created_at).toLocaleString()}`, 14, 36);

    // Prepare table data
    const tableColumn = [
      "SN",
      "Item Name",
      "Category",
      "Qty",
      "Price",
      "Tax %",
      "Total Before Tax",
      "Tax Amount",
      "Total After Tax",
    ];
    const tableRows = [];

    items.forEach((item) => {
      const row = [
        item.sn,
        item.name,
        item.categoryName || "-",
        item.qty,
        item.price.toFixed(2),
        item.taxRate,
        item.totalBeforeTax.toFixed(2),
        item.taxAmount.toFixed(2),
        item.totalAfterTax.toFixed(2),
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
    });

    // Calculate totals
    const subtotal = items.reduce((acc, i) => acc + i.totalBeforeTax, 0);
    const totalTax = items.reduce((acc, i) => acc + i.taxAmount, 0);
    const total = subtotal + totalTax;

    doc.text(`Subtotal: ${subtotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Tax: ${totalTax.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Total: ${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 22);

    doc.save(`invoice_${sale.id}.pdf`);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Sales History</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <table>
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Date</th>
            <th>Items Sold</th>
            <th>Subtotal</th>
            <th>Total Tax</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => {
            const items = JSON.parse(sale.dump);
            const subtotal = items.reduce((acc, i) => acc + i.totalBeforeTax, 0);
            const totalTax = items.reduce((acc, i) => acc + i.taxAmount, 0);
            const total = subtotal + totalTax;

            return (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{new Date(sale.created_at).toLocaleString()}</td>
                <td>
                  {items.map((i) => (
                    <div key={i.sn}>
                      {i.name} ({i.qty} x {i.price.toFixed(2)}) → {i.totalAfterTax.toFixed(2)}
                    </div>
                  ))}
                </td>
                <td>{subtotal.toFixed(2)}</td>
                <td>{totalTax.toFixed(2)}</td>
                <td>{total.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => handleSavePDF(sale)}
                    style={{
                      padding: "0.3rem 0.5rem",
                      background: "#0366d6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Save Invoice
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
