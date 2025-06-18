import './HeaderWhiteButton.css';

export default function HeaderWhiteButton({ label, onClick, className = '', id }) {
    return (
        <button className={`header-white-button ${className}`} onClick={onClick} id={id}>
            {label}
        </button>
    );
}