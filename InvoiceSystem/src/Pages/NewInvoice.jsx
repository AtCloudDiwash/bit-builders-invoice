import { useState, useEffect } from "react";
import { supabase } from "../client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function NewInvoice() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  // Inputs
  const [itemName, setItemName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [itemQty, setItemQty] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("item_categories")
        .select("id, category_name, tax_rate");

      if (error) {
        setErrorMsg("Error fetching categories.");
        return;
      }

      setCategories(data);
    }

    fetchCategories();
  }, []);

  // When category is selected, get tax rate
  const handleCategorySelect = (id) => {
    const category = categories.find((cat) => cat.id === Number(id));
    if (!category) return;

    setSelectedCategoryId(id);
    setTaxRate(category.tax_rate);
  };

  // Add item to table
  const handleAddItem = () => {
    if (!itemName || !itemQty || !itemPrice) {
      setErrorMsg("Please fill all fields");
      return;
    }

    const qty = Number(itemQty);
    const price = Number(itemPrice);

    const totalBeforeTax = qty * price;
    const taxAmount = (totalBeforeTax * taxRate) / 100;
    const totalAfterTax = totalBeforeTax + taxAmount;

    const category = categories.find((cat) => cat.id === Number(selectedCategoryId));

    const newItem = {
      sn: items.length + 1,
      name: itemName,
      categoryId: category ? category.id : null,
      categoryName: category ? category.category_name : "",
      qty,
      price,
      taxRate,
      totalBeforeTax,
      taxAmount,
      totalAfterTax,
    };

    setItems([...items, newItem]);

    // Reset fields
    setItemName("");
    setSelectedCategoryId("");
    setItemQty("");
    setItemPrice("");
    setTaxRate(0);
    setErrorMsg("");
  };

  // Totals
  const subtotal = items.reduce((acc, item) => acc + item.totalBeforeTax, 0);
  const totalTax = items.reduce((acc, item) => acc + item.taxAmount, 0);
  const total = subtotal + totalTax;

  // Generate PDF and Checkout
  const handleCheckout = async () => {
    if (items.length === 0) {
      setErrorMsg("Add at least one item before checkout");
      return;
    }

    // 1️⃣ Generate PDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Invoice", 14, 20);
    doc.setFontSize(12);
    const now = new Date();
    doc.text(`Date: ${now.toLocaleString()}`, 14, 28);

    // Table
    const tableColumns = [
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
    const tableRows = items.map((item) => [
      item.sn,
      item.name,
      item.categoryName || "-",
      item.qty,
      item.price.toFixed(2),
      item.taxRate,
      item.totalBeforeTax.toFixed(2),
      item.taxAmount.toFixed(2),
      item.totalAfterTax.toFixed(2),
    ]);

    autoTable(doc, {
      startY: 35,
      head: [tableColumns],
      body: tableRows,
    });

    // Totals
    doc.text(`Subtotal: ${subtotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Tax: ${totalTax.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Total: ${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 22);

    doc.save(`invoice_${now.getTime()}.pdf`);

    // 2️⃣ Send JSON to Supabase
    const dump = JSON.stringify(items, null, 2);

    const { error } = await supabase.from("sales_log").insert({
      dump,
      created_at: now.toISOString(),
    });

    if (error) {
      setErrorMsg("Error saving invoice. Try again.");
      return;
    }

    alert("Invoice saved successfully!");
    setItems([]);
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
      {/* Left side: Table */}
      <div style={{ flex: 2 }}>
        <h2>Invoice Items</h2>
        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Tax (%)</th>
              <th>Total Before Tax</th>
              <th>Tax Amount</th>
              <th>Total After Tax</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.sn}>
                <td>{item.sn}</td>
                <td>{item.name}</td>
                <td>{item.categoryName}</td>
                <td>{item.qty}</td>
                <td>{item.price}</td>
                <td>{item.taxRate}</td>
                <td>{item.totalBeforeTax.toFixed(2)}</td>
                <td>{item.taxAmount.toFixed(2)}</td>
                <td>{item.totalAfterTax.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right side: Inputs + Totals */}
      <div style={{ flex: 1 }}>
        <h2>Add Item</h2>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        {/* Item Name Input */}
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
        />

        {/* Category Dropdown */}
        <select
          value={selectedCategoryId}
          onChange={(e) => handleCategorySelect(e.target.value)}
          style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        {/* Quantity & Price Inputs */}
        <input
          type="number"
          placeholder="Quantity"
          value={itemQty}
          onChange={(e) => setItemQty(e.target.value)}
          style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
        />
        <input
          type="number"
          placeholder="Price per Item"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
        />

        {/* Add Item Button */}
        <button
          onClick={handleAddItem}
          style={{
            display: "block",
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            background: "#0366d6",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            width: "100%",
          }}
        >
          Add Item
        </button>

        {/* Totals */}
        <div style={{ borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
          <p>Subtotal: {subtotal.toFixed(2)}</p>
          <p>Total Tax: {totalTax.toFixed(2)}</p>
          <p>
            <strong>Total: {total.toFixed(2)}</strong>
          </p>
          <button
            onClick={handleCheckout}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "green",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              width: "100%",
            }}
          >
            Checkout & Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}
