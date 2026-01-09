import { useEffect, useState } from "react";
import { supabase } from "../client";

export default function Admin() {
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editCategory, setEditCategory] = useState("");
    const [editTax, setEditTax] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [adding, setAdding] = useState(false); // toggle add form
    const [newCategory, setNewCategory] = useState("");
    const [newTax, setNewTax] = useState("");

    async function getTaxDetails() {
        setErrorMsg(null);
        const { data, error } = await supabase
            .from("item_categories")
            .select("id, category_name, tax_rate");

        if (error) {
            setErrorMsg("There was an error fetching category details.");
        } else {
            setCategories(data);
        }
    }

    // Fetch categories from Supabase
    useEffect(() => {
        getTaxDetails();
    }, []);

    // Edit existing category
    const handleEdit = (item) => {
        setEditId(item.id);
        setEditCategory(item.category_name);
        setEditTax(item.tax_rate);
    };

    const handleSave = async (id) => {
        const { error } = await supabase
            .from("item_categories")
            .update({ category_name: editCategory, tax_rate: Number(editTax), taxable: Number(editTax) > 0 })
            .eq("id", id);

        if (error) {
            setErrorMsg("Error while updating the details. Try again");
        } else {
            const updated = categories.map((cat) =>
                cat.id === id
                    ? { ...cat, category_name: editCategory, tax_rate: Number(editTax), taxable: Number(editTax) > 0 }
                    : cat
            );
            setCategories(updated);
            setEditId(null);
        }
    };

    // Delete category
    const handleDelete = async (id) => {
        const { error } = await supabase
            .from("item_categories")
            .delete()
            .eq("id", id);

        if (error) {
            setErrorMsg("Experienced an error while deleting the details. Please refresh.");
            return;
        }

        setCategories(categories.filter((cat) => cat.id !== id));
    };

    // Add new category
    const handleAddCategory = async () => {
        if (!newCategory || newTax === "") {
            setErrorMsg("Category name and tax rate are required.");
            return;
        }

        const taxNumber = Number(newTax);
        const taxable = taxNumber > 0;
        const now = new Date();

        const { data, error } = await supabase.from("item_categories").insert({
            category_name: newCategory,
            tax_rate: taxNumber,
            taxable: taxable,
            updated_at: now.toISOString()
        });

        if (error) {
            setErrorMsg("Error adding new category. Try again.");
            return;
        }
        setNewCategory("");
        setNewTax("");
        getTaxDetails();
        setAdding(false);
    };

    return (
        <main className="container">
            <h1>Admin - Manage Categories</h1>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

            {/* Add Category Button */}
            {!adding && (
                <button onClick={() => setAdding(true)}>Add Category</button>
            )}

            {/* Add Category Form */}
            {adding && (
                <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Tax Rate (%)"
                        value={newTax}
                        onChange={(e) => setNewTax(e.target.value)}
                    />
                    <div style={{display: "flex", gap: "10px"}}>
                        <button onClick={handleAddCategory}>Save</button>
                        <button onClick={() => setAdding(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Categories Table */}
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Tax (%)</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((item) => (
                        <tr key={item.id}>
                            <td>
                                {editId === item.id ? (
                                    <input
                                        type="text"
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                    />
                                ) : (
                                    item.category_name
                                )}
                            </td>
                            <td>
                                {editId === item.id ? (
                                    <input
                                        type="number"
                                        value={editTax}
                                        onChange={(e) => setEditTax(e.target.value)}
                                    />
                                ) : (
                                    item.tax_rate
                                )}
                            </td>
                            <td>
                                {editId === item.id ? (
                                    <button onClick={() => handleSave(item.id)}>Save</button>
                                ) : (
                                    <button onClick={() => handleEdit(item)}>Edit</button>
                                )}
                            </td>
                            <td>
                                <button
                                    className="secondary"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
