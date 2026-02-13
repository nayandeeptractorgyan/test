import React from 'react';

const WhatsAppButton = () => {
  const handleClick = () => {
    const phoneNumber = '919876543210'; // Replace with your actual WhatsApp number
    const message = encodeURIComponent('Hello! I am interested in your premium wood products.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="whatsapp-float" onClick={handleClick}>
      <span>💬</span>
    </div>
  );
};

export default WhatsAppButton;
