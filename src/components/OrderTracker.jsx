import React from 'react';


const STATUS_FLOW = ['PREP', 'PICKED', 'ON_ROUTE', 'DELIVERED'];

function OrderTracker({ status }) {
  return (
    <div className="order-tracker" style={{ display: 'flex', gap: 8 }}>
      {STATUS_FLOW.map(s => (
        <span key={s} className={s === status ? 'active' : ''} style={{
          padding: '2px 10px',
          borderRadius: 8,
          background: s === status ? '#1976d2' : '#e0e0e0',
          color: s === status ? '#fff' : '#333',
          fontWeight: s === status ? 600 : 400,
          fontSize: 13
        }}>{s}</span>
      ))}
    </div>
  );
}

export default OrderTracker;
