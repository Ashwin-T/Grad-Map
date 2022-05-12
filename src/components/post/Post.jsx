import {getAuth} from 'firebase/auth';
import { useState } from 'react';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import {getFirestore, updateDoc, arrayRemove, arrayUnion, doc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './post.css';
const IndivisualPost = ({post}) => {

    const auth = getAuth();

    const [likedby, setLikedby] = useState(post.data().likes);
    const [liked, setLiked] = useState(post.data().likes.includes(auth.currentUser.uid));
    const navigate = useNavigate();
    const handleLike = async() => {
        setLiked(!liked);

        const db = getFirestore();
        const postRef = doc(db, 'posts', post.id);
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


    // const Icon = post.data().liked.includes(auth.currentUser.uid) ?
    // <FaHeart size={25} onClick={handleLike} /> :
    // <FaRegHeart size={25} onClick={handleLike} />

    const Icon = liked ? <FaHeart style = {{color: "red"}} onClick={handleLike} /> : <FaRegHeart style = {{color: "red"}} onClick={handleLike} />
    
    return (
        <>
            <div className="thought">
                <img src = {post.data().profilePic} alt = "profile" className="profile-pic"/>
                <div className='thought-page'>
                    <h3>{post.data().message}</h3>
                    <p onClick = {()=>navigate("/profile/" + post.data().author)}>{post.data().name}</p>
                </div>
                <button style = {{color: "red"}} >{Icon}{likedby.length}</button>
            </div>
            <br />
        </>
      );
}
 
export default IndivisualPost;