import { useParams } from "react-router-dom";
import './add.css';
import Memory from "./Memory";
import Post from './Post';
const Add = () => {

    const {id} = useParams();

    return ( 
        <>
            <div className="add-container">
                {
                    id === 'post' && <Post />
                }
                {
                    id === 'memory' && <Memory />
                }
            </div>
        </>
     );
}
 
export default Add;