import React, { useState, useEffect } from "react";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [bmiHistory, setBmiHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("calculator");
  const [loading, setLoading] = useState(false);

  // Fetch BMI history when component mounts or when switching to history tab
  useEffect(() => {
    if (activeTab === "history") {
      fetchBMIHistory();
    }
  }, [activeTab]);

  const fetchBMIHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/bmi/history");
      const data = await response.json();
      setBmiHistory(data);
    } catch (error) {
      setMessage("Failed to fetch BMI history");
    }
    setLoading(false);
  };

  const calculateBMI = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);

    // Validation
    if (!h || !w || !a || h <= 0 || w <= 0 || a <= 0) {
      setMessage("Please enter valid positive numbers for all fields");
      setLoading(false);
      return;
    }

    // Calculate BMI
    const bmiValue = +(w / (h * h)).toFixed(2);
    setBmi(bmiValue);

    // Save to database (mock API call)
    try {
      const userData = {
        height: h,
        weight: w,
        age: a,
        bmi: bmiValue,
        date: new Date().toISOString(),
      };

      // Mock API call - replace with your actual API endpoint
      await fetch("/api/user/bmi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      // Save locally as backup
      localStorage.setItem("latestBMI", JSON.stringify(userData));

      setMessage("BMI calculated and saved successfully!");
    } catch (error) {
      // Fallback to local storage if API fails
      const userData = {
        height: h,
        weight: w,
        age: a,
        bmi: bmiValue,
        date: new Date().toISOString(),
      };
      localStorage.setItem("latestBMI", JSON.stringify(userData));
      setMessage("BMI calculated and saved locally!");
    }

    setLoading(false);
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { category: "Underweight", color: "#3b82f6" };
    if (bmiValue < 25) return { category: "Normal", color: "#10b981" };
    if (bmiValue < 30) return { category: "Overweight", color: "#f59e0b" };
    return { category: "Obese", color: "#ef4444" };
  };

  const clearForm = () => {
    setHeight("");
    setWeight("");
    setAge("");
    setBmi(null);
    setMessage("");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">BMI Calculator</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("calculator")}
          className={`px-4 py-2 rounded-lg font-bold ${
            activeTab === "calculator"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Calculator
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-lg font-bold ${
            activeTab === "history"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          History
        </button>
      </div>

      {/* Calculator Tab */}
      {activeTab === "calculator" && (
        <form onSubmit={calculateBMI} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              Height (meters):
            </label>
            <input
              type="number"
              step="0.01"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 1.75"
              className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Weight (kg):</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 70.5"
              className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Age (years):</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 25"
              className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Calculating..." : "Calculate & Save BMI"}
            </button>

            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </form>
      )}

      {/* BMI Result */}
      {bmi && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <h3 className="font-bold mb-2">Your BMI Result</h3>
          <div
            className="text-3xl font-bold mb-2"
            style={{ color: getBMICategory(bmi).color }}
          >
            {bmi}
          </div>
          <div
            className="font-bold"
            style={{ color: getBMICategory(bmi).color }}
          >
            {getBMICategory(bmi).category}
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-center font-bold ${
            message.includes("success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <h3 style={{ margin: 0, color: "#333" }}>📈 Your BMI History</h3>
            <button
              onClick={fetchBMIHistory}
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </div>
          <ul>
            {bmiHistory.map((record, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>Date:</strong> {record.date} | <strong>BMI:</strong>{" "}
                {record.bmi} | <strong>Category:</strong>{" "}
                {getBMICategory(record.bmi).category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
