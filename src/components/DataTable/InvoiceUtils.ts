
export const initialInvoices = [
  {
    id: 11,
    amount: 1500,
    dueDate: '2025-07-15',
    status: 'pending',
    comments: '',
    customer: {
        name: 'Nandhini',
    }
  },
  {
    id: 2,
    amount: 2200,
    dueDate: '2025-07-10',
    status: 'paid',
    comments: 'helo',
    customer: {
        name: 'Manasvini',
    }
  },
  {
    id: 31,
    amount: 500,
    dueDate: '2025-07-18',
    status: 'overdue',
    comments: '',
    customer: {
        name: 'Kavya',
    }
  },
   {
    id: 4,
    amount: 504,
    dueDate: '2025-07-19',
    status: 'draft',
    comments: '',
    customer: {
        name: 'Poobesh',
    }
  }, {
    id: 5,
    amount: 30000,
    dueDate: '2025-06-18',
    status: 'paid',
    comments: '',
    customer: {
        name: 'Megala',
    }
  }, {
    id: 16,
    amount: 300,
    dueDate: '2025-04-20',
    status: 'overdue',
    comments: '',
    customer: {
        name: 'Nandy',
    }
  }, {
    id: 7,
    amount: 50,
    dueDate: '2025-07-14',
    status: 'overdue',
    comments: '',
    customer: {
        name: 'Priya',
    }
  }, {
    id: 83,
    amount: 5000,
    dueDate: '2025-07-1',
    status: 'overdue',
    comments: '',
    customer: {
        name: 'Subramani',
    }
  },{
    id: 9,
    amount: 50000,
    dueDate: '2025-07-13',
    status: 'draft',
    comments: '',
    customer: {
        name: 'HArshu',
    }
  },{
    id: 10,
    amount: 5000,
    dueDate: '2025-07-11',
    status: 'paid',
    comments: '',
    customer: {
        name: 'Sandhya',
    }
  },{
    id: 110,
    amount: 8000,
    dueDate: '2025-07-16',
    status: 'pending',
    comments: '',
    customer: {
        name: 'domy',
    }
  },
];

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

export const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
};
