import './Layout.css';
import navIcon from '../../assets/navicon.svg';
import logo from '../../assets/growfin.png';
import {    
    FaGripLines,

    } from 'react-icons/fa';
    import { TbLayoutSidebar } from "react-icons/tb";
const Header = ({ onToggle }: { onToggle: () => void }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onToggle}><img src={navIcon}/></button>
        <img src={logo} style={{width:'100px'}}/>
      </div>
      <div className="header-right">
      <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'green',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '18px',
      }}
    >
      U
    </div>
      </div>
    </header>
  );
};

export default Header;
