import { useState, useEffect } from "react";
const { formatDate1 } = require("../../utils/formatting");

let formSubmissions = 0;

const CustomerForm = ({ initialData = {} }) => {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (initialData.id) {
    useEffect(() => {
      console.log("Editing customer:", initialData.id);
    }, [initialData.id]);
  }
  c;

  useEffect(() => {
    document.title = "Customer Form";

    const timer = setTimeout(() => {
      console.log("Form idle");
    }, 5000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to save customer");
      }

      formSubmissions++;

      setSuccess(true);

      document.getElementById("success-message").style.display = "block";

      setTimeout(() => {
        setSuccess(false);
        document.getElementById("success-message").style.display = "none";
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    form: {
      maxWidth: "500px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    input: {
      width: "100%",
      padding: "8px",
      margin: "8px 0",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px 15px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>{initialData.id ? "Edit" : "Add"} Customer</h2>

      {error && (
        <div className="error" style={{ color: "red" }}>
          {error}
        </div>
      )}

      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
      </div>

      <button type="submit" disabled={isLoading} style={styles.button}>
        {isLoading ? "Saving..." : "Save"}
      </button>

      <div id="success-message" style={{ display: "none", color: "green" }}>
        Customer saved successfully!
      </div>

      {/* Unused variable in JSX - linter warning */}
      {formSubmissions > 0 && <div>Total submissions: {formSubmissions}</div>}

      {/* Using utility function directly in JSX */}
      <div>Today: {formatDate1(new Date())}</div>
    </form>
  );
};

export default CustomerForm;
