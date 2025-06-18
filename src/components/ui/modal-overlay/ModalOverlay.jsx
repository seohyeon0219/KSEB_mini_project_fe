import './ModalOverlay.css';

export default function ModalOverlay({ children }) {
    return (
        <div className='modal-overlay'>{children}</div>
    )
}