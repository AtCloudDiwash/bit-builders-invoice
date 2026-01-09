# 🧾 Invoicer App

A simple, beginner-friendly **Invoice Management System** built with **React** and **Supabase**. This application enables cashiers to create invoices with automatic tax calculations, while admins can manage product categories and tax rates efficiently.

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### 👨‍💼 Admin Panel
- ➕ Add, edit, and delete item categories
- 💰 Set custom tax rates per category
- 🔄 Automatic `taxable` status based on tax rate
- ⚡ Real-time updates to database

### 🛒 Cashier Interface (New Invoice)
- 📝 Add items with name, category, quantity, and price
- 🧮 Automatic tax calculation per category
- 📊 Real-time subtotal, tax, and total calculation
- 💾 Save invoices to database
- 📄 Generate and download PDF invoices

### 📚 Sales History
- 📜 View complete sales history
- 🔍 Detailed breakdown of each transaction
- 📥 Export any past sale as PDF
- ⏰ Timestamp tracking for all sales

### 🛡️ Error Handling
- ✅ Input validation for all fields
- ⚠️ User-friendly error messages
- 🔒 Database connection error handling

---

## 🛠️ Tech Stack

| Component          | Technology                | Purpose                                    |
|--------------------|---------------------------|--------------------------------------------|
| **Frontend**       | React.js                  | UI and user interactions                   |
| **Styling**        | Pico.css                  | Lightweight, responsive CSS framework      |
| **Backend**        | Supabase (PostgreSQL)     | Database and CRUD operations               |
| **PDF Generation** | jsPDF + jsPDF-AutoTable   | Client-side PDF generation                 |
| **State**          | React Hooks               | State management (`useState`, `useEffect`) |
| **Date Handling**  | JavaScript Date           | Timestamps and date formatting             |

---

## 📁 Project Structure

```
invoicer-app/
│
├── src/
│   ├── components/
│   │   ├── Admin.jsx           # Category and tax management
│   │   ├── NewInvoice.jsx      # Invoice creation interface
│   │   ├── SalesHistory.jsx    # View and export past sales
│   │   └── ErrorPage.jsx       # 404 error page
│   │
│   ├── client.js               # Supabase client configuration
│   ├── Main.jsx                # Navigation and landing page
│   └── App.jsx                 # Main application component
│
├── .env                        # Environment variables (not in repo)
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

### **item_categories**

| Column        | Type        | Description                        |
|---------------|-------------|------------------------------------|
| `id`          | `int`       | Primary key (auto-increment)       |
| `category_name` | `text`    | Category name                      |
| `tax_rate`    | `numeric`   | Tax rate percentage                |
| `taxable`     | `boolean`   | `true` if `tax_rate > 0`           |
| `updated_at`  | `timestampz`| Last modified timestamp            |

### **sales_log**

| Column        | Type        | Description                        |
|---------------|-------------|------------------------------------|
| `id`          | `int`       | Primary key (auto-increment)       |
| `dump`        | `json`      | Complete invoice data (items, totals) |
| `created_at`  | `timestampz`| Sale creation timestamp            |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/invoicer-app.git
cd invoicer-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Supabase**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

4. **Set up database tables**

Run the following SQL in your Supabase SQL editor:

```sql
-- Create item_categories table
CREATE TABLE item_categories (
  id SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  taxable BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sales_log table
CREATE TABLE sales_log (
  id SERIAL PRIMARY KEY,
  dump JSON NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

5. **Run the application**

```bash
npm run dev
```

6. **Open in browser**

```
http://localhost:5173
```

---

## 📖 Usage

### Creating an Invoice

1. Navigate to **New Invoice**
2. Add items by filling in:
   - Item name
   - Category (with associated tax rate)
   - Quantity
   - Price per unit
3. Review calculated subtotal, tax, and total
4. Click **Checkout** to:
   - Save invoice to database
   - Download PDF invoice

### Managing Categories (Admin)

1. Navigate to **Admin Panel**
2. Add new categories with custom tax rates
3. Edit existing categories
4. Delete unused categories

### Viewing Sales History

1. Navigate to **Sales History**
2. Browse all past transactions
3. Click **Export PDF** on any sale to download invoice

---

## 💡 How It Works

1. **Admin** sets up product categories with appropriate tax rates
2. **Cashier** creates invoices by adding items with their categories
3. Tax is automatically calculated based on each item's category
4. Subtotal, total tax, and grand total are computed in real-time
5. On checkout:
   - Invoice data is saved to Supabase as JSON
   - PDF invoice is generated and downloaded locally
6. Past sales can be viewed and re-exported from Sales History

---

## 📝 Important Notes

- 💰 Taxes are calculated **per category**, not per individual item
- 📄 PDF generation happens **client-side** (no backend required)
- 🔒 All sensitive keys should be stored in `.env` and never committed
- ⚡ Categories can be updated anytime without affecting past sales

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

Your Name - [@yourhandle](https://twitter.com/yourhandle)

Project Link: [https://github.com/yourusername/invoicer-app](https://github.com/yourusername/invoicer-app)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Supabase](https://supabase.com/)
- [Pico.css](https://picocss.com/)
- [jsPDF](https://github.com/parallax/jsPDF)

---

**Made with ❤️ for small businesses**