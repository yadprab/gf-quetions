// src/pages/InvoicesPage.jsx
import React, { useEffect, useState } from 'react';
import DataTableContainer from '../components/DataTable/DataTableContainer'; // ✅ reuse table

const InvoicesPage = () => {
	const [invoices, setInvoices] = useState([]);

	// ✅ fetch dummy invoices
	useEffect(() => {
		const dummyInvoices = [
			{
				id: 1,
				invoiceNumber: 'INV-1001',
				customerName: 'Sai Pravalika',
				amount: 16000,
				dueDate: '2025-08-10',
				status: 'PENDING',
			},
			{
				id: 2,
				invoiceNumber: 'INV-1002',
				customerName: 'John Doe',
				amount: 20000,
				dueDate: '2025-08-05',
				status: 'OVERDUE',
			},
			{
				id: 3,
				invoiceNumber: 'INV-1003',
				customerName: 'Ayeesha',
				amount: 10000,
				dueDate: '2025-08-15',
				status: 'PAID',
			},
		];
		setInvoices(dummyInvoices);
	}, []);

	return (
		<div style={{ padding: '24px' }}>
			<h1 style={{ marginBottom: '20px' }}>Invoice Management</h1>
			{/* ✅ Pass data into reusable table */}
			<DataTableContainer invoices={invoices} />
		</div>
	);
};

export default InvoicesPage;
