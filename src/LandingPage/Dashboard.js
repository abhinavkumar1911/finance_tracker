import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const Dashboard = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [creditCards, setCreditCards] = useState([]);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    bank: ''
  });

  const [viewMode, setViewMode] = useState('Monthly'); // 'Daily' or 'Monthly'

  useEffect(() => {
    const fetchData = async () => {
      const incomeSnap = await getDocs(collection(db, 'Income'));
      const incomeData = incomeSnap.docs.map(doc => doc.data());
      setIncomeList(incomeData);

      const expenseSnap = await getDocs(collection(db, 'Expenses'));
      const expenseData = expenseSnap.docs.map(doc => doc.data());
      setExpenseList(expenseData);

      const accountsSnap = await getDocs(collection(db, 'Accounts'));
      const accountsData = accountsSnap.docs.map(doc => doc.data());
      setAccounts(accountsData);

      const creditSnap = await getDocs(collection(db, 'CreditCard'));
      const creditData = creditSnap.docs.map(doc => doc.data());
      setCreditCards(creditData);
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const { startDate, endDate, category, bank } = filters;
    const matchFilters = entry => {
      const entryDate = new Date(entry.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (!start || entryDate >= start) &&
        (!end || entryDate <= end) &&
        (!category || entry.reason === category) &&
        (!bank || entry.bankName === bank)
      );
    };

    const income = incomeList.filter(matchFilters);
    const expense = expenseList.filter(matchFilters);
    return { income, expense };
  }, [filters, incomeList, expenseList]);

  const pieData = useMemo(() => {
    const incomeTotal = filteredData.income.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
    const expenseTotal = filteredData.expense.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
    return [
      { name: 'Income', value: incomeTotal },
      { name: 'Expense', value: expenseTotal }
    ];
  }, [filteredData]);

  const chartData = useMemo(() => {
    const dataMap = {};
    const formatDate = (dateStr, mode) => {
      const d = new Date(dateStr);
      return mode === 'Monthly'
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        : new Date(d).toLocaleDateString();
    };

    filteredData.income.forEach(item => {
      const key = formatDate(item.date, viewMode);
      if (!dataMap[key]) dataMap[key] = { label: key, income: 0, expense: 0 };
      dataMap[key].income += parseFloat(item.amount || 0);
    });

    filteredData.expense.forEach(item => {
      const key = formatDate(item.date, viewMode);
      if (!dataMap[key]) dataMap[key] = { label: key, income: 0, expense: 0 };
      dataMap[key].expense += parseFloat(item.amount || 0);
    });

    return Object.values(dataMap).sort((a, b) => new Date(a.label) - new Date(b.label));
  }, [filteredData, viewMode]);

  const accountCardChartData = useMemo(() => {
    const bankData = accounts.map(acc => ({
      name: acc.bankName,
      balance: parseFloat(acc.balance || 0),
      type: 'Bank'
    }));

    const creditData = creditCards.map(card => ({
      name: card.cardNumber,
      balance: parseFloat(card.balance || 0),
      used: parseFloat(card.usedAmount || 0),
      type: 'Credit'
    }));

    return [...bankData, ...creditData];
  }, [accounts, creditCards]);

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-4">Finance Dashboard</h3>

      <div className="mb-3 d-flex gap-3 flex-wrap">
        <input type="date" value={filters.startDate} onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))} />
        <input type="date" value={filters.endDate} onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))} />

        <select value={filters.category} onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}>
          <option value="">All Categories</option>
          <option value="Rent">Rent</option>
          <option value="Gas">Gas</option>
          <option value="Tuition Fee">Tuition Fee</option>
          <option value="Bus Fare">Bus Fare</option>
          <option value="Electric Bill">Electric Bill</option>
          <option value="Salary">Salary</option>
          <option value="Loan">Loan</option>
          <option value="Credit Card Payment">Credit Card Payment</option>
          <option value="Subscription">Subscription</option>
          <option value="Others">Others</option>
        </select>

        <select value={filters.bank} onChange={e => setFilters(prev => ({ ...prev, bank: e.target.value }))}>
          <option value="">All Banks</option>
          {accounts.map((acc, idx) => (
            <option key={idx} value={acc.bankName}>{acc.bankName}</option>
          ))}
        </select>

        <select value={viewMode} onChange={e => setViewMode(e.target.value)}>
          <option value="Daily">Daily</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h5 className="text-center">Income vs Expense</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#28a745' : '#dc3545'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6 mb-4">
          <h5 className="text-center">{viewMode} Income & Expense</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#28a745" name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#dc3545" name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="col-12 mb-4">
          <h5 className="text-center">Bank & Credit Card Balances</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accountCardChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="balance" fill="#007bff" name="Balance" />
              <Bar dataKey="used" fill="#ffc107" name="Used (Credit Only)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
