import './HeaderButton.css';

export default function HeaderButton({ label, onClick, className = '', id}) {
    return (
        <button className={`header-button ${className}`} onClick={onClick} id={id}>
            {label}
        </button>
    );
}