// Bad: Mixing UI and business logic, direct DOM manipulation, and inline styles

// Global variable - bad practice
let selectedCustomerId = null;

const CustomerList = () => {
  // Inline styles mixed with CSS
  const styles = {
    container: { padding: '10px', border: '1px solid #ccc' },
    button: { marginLeft: '10px' }
  };

  // Direct DOM manipulation in React - bad practice
  const handleSelect = (id) => {
    selectedCustomerId = id;
    document.getElementById('selected-customer').innerText = `Selected: ${id}`;
  };

  // Mock data - should be in a separate file or API call
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];

  // Inline function in render - bad for performance
  const formatEmail = (email) => {
    return email.toLowerCase();
  };

  return (
    <div style={styles.container}>
      <h2>Customer List</h2>
      <div id="selected-customer">No customer selected</div>
      <ul>
        {customers.map(customer => (
          <li key={customer.id}>
            {customer.name} - {formatEmail(customer.email)}
            <button 
              style={styles.button}
              onClick={() => handleSelect(customer.id)}
            >
              Select
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
