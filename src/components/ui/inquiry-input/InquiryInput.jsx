import './InquiryInput.css';

export default function InquiryInput( {type, className = '', placeholder} ) {

    return (    
        <input
            type={type}
            className={`inquiry-input ${className}`}
            placeholder={placeholder}
            autoComplete="off"
        />
    )
}