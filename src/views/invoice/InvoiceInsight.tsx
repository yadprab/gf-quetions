
import dollar from '../../assets/card/dollar.png'
import group from '../../assets/card/group.png'
import time from '../../assets/card/time.png'
import trading from '../../assets/card/trading.png'

const cardData = [
  { icon: <img src={dollar} width={"50px"} />, value: "+12.5%", label1: 'Total Outstanding', label2: '$486,250',color:'red' },
  { icon: <img src={trading} width={"50px"}/>, value: "++5.2%", label1: 'Collections Rate', label2: '87.3%',color:'green' },
  { icon: <img src={group} width={"50px"}/>, value: "++8.1%", label1: 'Active Customers', label2: '1,247',color:'green' },
  { icon: <img src={time} width={"50px"}/>, value: "+-3 days", label1: 'Avg. Days to Pay', label2: '32 days',color:'green' },
];

const InvoiceInsight = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop:'20px'
      }}
    >
      {cardData.map((item, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '16px',
            width: '20%',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            fontFamily: 'sans-serif',
          }}
        >
         
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <div style={{ color: 'green' }}>{item.icon}</div>
            <div style={{  fontSize: '16px',  color:item.color}}>{item.value}</div>
          </div>

          
          <div style={{ marginBottom: '4px', fontSize: '14px', color: 'rgb(101 97 97)', fontWeight:'bold' }}>
            {item.label1}
          </div>

          
          <div style={{ fontSize: '14px', color: '#000',fontWeight:'bold' }}>{item.label2}</div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceInsight;
