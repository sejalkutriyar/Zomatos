import zomatoLogo from '../../assets/zomato-logo.svg';

export default function Header() {
  return (
    <div className="header">
      <div className="header-logo-title">
        <img src={zomatoLogo} alt="Zomato Logo" className="zomato-logo" />
        <span className="header-title">Zomato Ops Pro – Smart Kitchen + Delivery Hub</span>
      </div>
    </div>
  );
} 