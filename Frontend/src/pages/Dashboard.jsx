import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "../components/Chart";

const Dashboard = () => {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [dropDownCategory, setDropDownCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [chartDataFromBackend, setChartDataFromBackend] = useState([]);
  const [newArray, setNewArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    try {
      // Fetch user info
      axios
        .get("http://localhost:3000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const { id, username } = res.data.user;
          setId(id);
          setUsername(username);
        })
        .catch((err) => {
          console.log("Dashboard fetch error:", err);
          navigate("/");
        });

      // Fetch categories
      axios
        .get("http://localhost:3000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCategories(res.data.categories))
        .catch((err) => console.log("Category fetch error:", err));

      // Fetch expenses data for chart and list
      axios
        .get("http://localhost:3000/api/getchartdata", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data.chartData;
          setChartDataFromBackend(data);

          // Sort by amount in descending order
          const sorted = [...data].sort((a, b) => Number(b.amount) - Number(a.amount));
          setNewArray(sorted);
        })
        .catch((err) => console.log("Chart data fetch error:", err));
    } catch (err) {
      console.log("useEffect error:", err);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const expenseCategory =
      category.trim() !== "" ? category.trim() : dropDownCategory;
    if (!expenseCategory) {
      alert("Please select or enter a category");
      return;
    }

    const expenseData = {
      userId: id,
      date,
      description,
      amount: Number(amount),
      category: expenseCategory,
    };

    axios
      .post("http://localhost:3000/api/expenses", expenseData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Expense added successfully");
        setShowPopup(false);
        setDescription("");
        setAmount("");
        setCategory("");
        setDropDownCategory("");
        // Optionally: Refresh chart data
      })
      .catch((err) => {
        console.log("Failed to add expense:", err);
        alert("Failed to add expense.");
      });
  }

  return (
    <>
      {id ? (
        <div>
          <h1 className="text-2xl ml-3 mt-5">
            Welcome to your dashboard, {username}
          </h1>

          <button
            onClick={handleLogout}
            className="fixed top-5 right-2 bg-black text-white p-2 rounded-md hover:bg-orange-600"
          >
            Logout
          </button>

          <button
            onClick={() => setShowPopup(true)}
            className="fixed bottom-2 right-2 bg-black text-white text-3xl rounded-full h-20 w-20 flex justify-center items-center hover:bg-orange-600"
          >
            +
          </button>

          {showPopup && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white border border-gray-300 w-full max-w-md p-5 shadow-2xl rounded-md">
              <h2 className="text-xl text-orange-600 mb-3">Add Expense</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 bg-black text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-orange-600"
              >
                X
              </button>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label>Date of expenditure</label>
                <input
                  className="border border-gray-300 p-2 rounded w-full"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <label>Description/Name of expense</label>
                <input
                  className="border border-gray-300 p-2 rounded w-full"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <label>Select a category</label>
                <select
                  className="border border-gray-300 p-2 rounded w-full"
                  value={dropDownCategory}
                  onChange={(e) => setDropDownCategory(e.target.value)}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <label>or Add a New Category</label>
                <input
                  className="border border-gray-300 p-2 rounded w-full"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />

                <label>Amount</label>
                <input
                  className="border border-gray-300 p-2 rounded w-full"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <button
                  type="submit"
                  className="bg-black text-white hover:bg-orange-600 p-2 mt-3 rounded w-full"
                >
                  Add
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 ml-4 mr-4 mt-10">
            <div className="w-full p-4 bg-white rounded-xl shadow-md">
              <Chart />
            </div>
            <div className="w-full p-4 bg-white rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-2">Top Expenses</h2>
              <ul className="space-y-2 max-h-[400px] overflow-auto">
                {newArray.map((expense) => (
                  <li
                    key={expense.id}
                    className=" p-2 rounded flex justify-between"
                  >
                    <span>
                      {expense.description} ({expense.category})
                    </span>
                    <span>₹{expense.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <h1>You are not signed in</h1>
      )}
    </>
  );
};

export default Dashboard;
