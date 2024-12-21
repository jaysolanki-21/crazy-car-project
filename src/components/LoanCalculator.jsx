import React, { useState } from 'react';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [emi, setEmi] = useState(0);

  const calculateEmi = () => {
    const r = interestRate / 12 / 100; // Monthly interest rate
    const n = loanTenure * 12; // Total months
    const emiValue = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(emiValue.toFixed(2));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h3>Car Loan EMI Calculator</h3>
      <input
        type="number"
        placeholder="Loan Amount"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
        style={{ margin: '10px', padding: '10px', width: '100%' }}
      />
      <input
        type="number"
        placeholder="Interest Rate (%)"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        style={{ margin: '10px', padding: '10px', width: '100%' }}
      />
      <input
        type="number"
        placeholder="Loan Tenure (years)"
        value={loanTenure}
        onChange={(e) => setLoanTenure(e.target.value)}
        style={{ margin: '10px', padding: '10px', width: '100%' }}
      />
      <button onClick={calculateEmi} style={{ padding: '10px 20px', margin: '10px' }}>Calculate EMI</button>
      {emi > 0 && <h4>Your Monthly EMI: ₹{emi}</h4>}
    </div>
  );
};

export default LoanCalculator;

// app.post('/calculate-emi', (req, res) => {
//   const { loanAmount, interestRate, loanTenure } = req.body;
//   const r = interestRate / 12 / 100; // Monthly interest rate
//   const n = loanTenure * 12; // Total months
//   const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
//   res.json({ emi: emi.toFixed(2) });
// });
