import {FaUserGraduate} from 'react-icons/fa';
const Loading = () => {
    return (  
        <>
            <div className="loading">
                <div className="loading-icon">
                    <FaUserGraduate size = {50}/>
                </div>
                <div className="loading-text">
                    <h1>Loading...</h1>
                </div>
            </div>
                    
        </>
    );
}
 
export default Loading;