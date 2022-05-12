import {FaArrowLeft} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './info.css';
const Info = () => {

    const navigate = useNavigate();
    
    const ColoredLine = ({ color }) => (
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: 1,
                width: "90%"
            }}
        />
    );
    return (  
        <>
            <div className="info-container">
                <div className="back-button">
                    <FaArrowLeft onClick = {()=> navigate('/')} size = {25}/>
                </div>
                <h1>
                    Grad Map
                </h1>
                <h2>
                    Giving people a way to remembers their friends and supporters wherever in the world they go!
                </h2>

                <ColoredLine color="grey" />    

                <p>Created by <a href = "https://ashwintalwalkar.com/" target="_blank" rel="noopener noreferrer">Ashwin Talwalkar</a></p>
            </div>
        </>
    );
}
 
export default Info;