import './SignInput.css';

export default function SignInput( {type, id, placeholder, value = '', onChange} ) {

    return (    
        <input
            type={type}
            id={id}
            className='sign-input'
            placeholder={placeholder}
            value={value}
            onChange={onChange || (() => {})}
            autoComplete="off"
        />
    )
}