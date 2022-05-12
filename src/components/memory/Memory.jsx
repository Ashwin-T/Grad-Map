import './memory.css';
import {getFirestore, updateDoc, arrayRemove, arrayUnion, doc} from 'firebase/firestore';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import {getAuth} from 'firebase/auth';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
const Memory = ({memory}) => {

    const auth = getAuth();

    const [likedby, setLikedby] = useState(memory.data().likes);
    const [liked, setLiked] = useState(memory.data().likes.includes(auth.currentUser.uid));
    const navigate = useNavigate();
    const handleLike = async() => {
        setLiked(!liked);

        const db = getFirestore();
        const postRef = doc(db, 'memories', memory.id);
        if(!liked){
            setLikedby((prev)=>{
                return [...prev, auth.currentUser.uid]
            })
            await updateDoc(postRef, {
                likes: arrayUnion(auth.currentUser.uid)
            })
        }
        else{
            
            setLikedby((prev)=>{
                return prev.filter(user => user !== auth.currentUser.uid)
            })
            await updateDoc(postRef, {
                likes: arrayRemove(auth.currentUser.uid)
            })
        }

    }


    const Icon = liked ? <FaHeart style = {{color: "red"}} onClick={handleLike} /> : <FaRegHeart style = {{color: "red"}} onClick={handleLike} />
    
    return (
        <>
            <div className="memory">
                <div className="memory-header">
                    <div>
                        <img src={memory.data().profilePic} alt="profile pic" />
                        <p onClick = {()=>navigate("/profile/" + memory.data().author)}>{memory.data().name}</p>
                    </div>
                </div>
                <img src={memory.data().image} alt="memory"/>
                <div className="memory-bottom">
                    <p>From {memory.data().date}</p>
                    <button style = {{color: "red"}} >{Icon}{likedby.length}</button>
                </div>
                
            </div>
            <br />
        </>
      );
}
 
export default Memory;