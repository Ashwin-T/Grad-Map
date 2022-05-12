import {MdError} from 'react-icons/md'
import './error.css';
const Error = ({message}) => {
    return ( 
        <>
            <div className="error-container">
                <MdError size = {25} />
                <p>{message}</p>
            </div>
            <br />
        </>
     );
}
 
export default Error;