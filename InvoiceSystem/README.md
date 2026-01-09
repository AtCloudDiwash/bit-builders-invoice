# Invoicer App

A simple, beginner-friendly **Invoice System** built using **React** and **Supabase**, designed to manage sales, taxes, and categories efficiently. The app allows cashiers to create invoices, calculate taxes automatically by category, and store sales history. Admins can manage categories and tax rates. Invoices can also be exported as PDFs.

---

## **Tech Stack**

| Layer              | Technology / Library          | Purpose                                                    |
| ------------------ | ----------------------------- | ---------------------------------------------------------- |
| Frontend           | **React.js**                  | Building the user interface and handling user interactions |
| Styling            | **Pico.css**                  | Lightweight, responsive CSS framework for styling          |
| Backend / Database | **Supabase** (PostgreSQL)     | Stores categories, sales logs, and handles CRUD operations |
| PDF Generation     | **jsPDF + jsPDF-AutoTable**   | Generate and download invoice PDFs in the browser          |
| State Management   | React `useState`, `useEffect` | Managing component state and side effects                  |
| Date Handling      | JavaScript `Date` object      | Displaying sale timestamps and generating current time     |

---

## **Project Architecture**

```
src/
│
├─ components/
│   ├─ Admin.jsx          # Admin panel to manage categories and taxes
│   ├─ NewInvoice.jsx     # Cashier page to create new invoices
│   ├─ SalesHistory.jsx   # Display past sales and generate PDF invoices
│   └─ ErrorPage.jsx      # 404 / Not Found page
│
├─ client.js              # Supabase client setup
├─ Main.jsx               # Main page with navigation buttons
└─ App.jsx                # Main React app component
```

---

### **Database Schema**

#### **item_categories**

| Column Name   | Type       | Description                   |
| ------------- | ---------- | ----------------------------- |
| id            | int        | Auto-increment primary key    |
| category_name | text       | Name of the category          |
| tax_rate      | numeric    | Tax rate (%) for the category |
| taxable       | boolean    | True if tax_rate > 0          |
| updated_at    | timestampz | Last updated timestamp        |

#### **sales_log**

| Column Name | Type       | Description                                 |
| ----------- | ---------- | ------------------------------------------- |
| id          | int        | Auto-increment primary key                  |
| dump        | json       | JSON containing all items for the sale      |
| created_at  | timestampz | Timestamp when the sale/invoice was created |

---

### **Features**

* **Admin Panel**

  * Add, edit, delete item categories
  * Set tax rates per category
  * Auto-update `taxable` based on tax rate

* **New Invoice (Cashier)**

  * Add items with name, category, quantity, price
  * Automatically calculate tax and totals
  * Generate PDF invoice and save to PC
  * Save sale as JSON in Supabase

* **Sales History**

  * View past sales with all items and totals
  * Export individual sales as PDF

* **Error Handling**

  * Input validation for all fields
  * Friendly messages for failed database requests

---

### **How it Works**

1. **Admin** manages categories and tax rates.
2. **Cashier** selects items and categories while creating an invoice.
3. Each item calculates `taxAmount` based on the category’s tax rate.
4. **Subtotal, total tax, and total** are automatically calculated.
5. On checkout:

   * Invoice is **saved to Supabase**
   * PDF invoice is **generated and downloaded**
6. **Sales History** displays all previous sales and allows PDF export.

---

### **Getting Started**

1. Clone the repository:

```bash
git clone <repo-url>
cd invoicer-app
```

2. Install dependencies:

```bash
npm install
```

3. Configure **Supabase**:

* Create a `.env` file and add your Supabase keys:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

4. Run the app:

```bash
npm run dev
```

5. Open in browser:

```
http://localhost:5173
```

---

### **Notes**

* Taxes are calculated per **category**, not per item individually.
* PDFs are generated **client-side**, no backend is required for PDF export
