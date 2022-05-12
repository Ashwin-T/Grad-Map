import {useState} from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, collection, updateDoc } from 'firebase/firestore';
import {Link} from 'react-router-dom';

const Post = () => {

    const [message, setMessage] = useState('');
    const auth = getAuth();
    const db = getFirestore();

    const handleAddPost = async(e) => {
        
        e.preventDefault();
        if(message.length > 0){
            const followers = JSON.parse(localStorage.getItem('user')).following;

            await addDoc(collection(db, 'posts'), {
                message: message,
                author: auth.currentUser.uid,
                createdAt: new Date().toISOString(),
                viewers: [],
                likes: [],
                followers: followers,
                name: auth.currentUser.displayName,
                profilePic: auth.currentUser.photoURL,
                type: 'thought'
            })


    
            setMessage('');
        }

    }
    return (
        <>  
            <div className="top-area">
                <Link to = '/'><h4>Cancel</h4></Link>
                <button className="blue-button" onClick={handleAddPost}>
                    Add
                </button>
            </div>
            <div className="add-field">
                <br />
                <textarea maxLength="150" value = {message} onChange = {(e) => {setMessage(e.target.value)}} required placeholder="What's going on?"/>
            </div>
        </>
      );
}
 
export default Post;