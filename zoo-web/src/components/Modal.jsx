import React from 'react';

function Modal({ onClose, title, children }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '90%', maxWidth: '500px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          &times;
        </button>
        <h3 style={{ marginBottom: '20px', color: 'var(--jungle-dark)' }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default Modal;