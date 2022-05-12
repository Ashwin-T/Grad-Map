import {FaInfoCircle} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getFirestore, where, limit, getDocs, collection, query } from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import IndivisualPost from '../../components/post/Post';
import { useNavigate } from 'react-router-dom';
import {AiOutlineLoading} from 'react-icons/ai';
import Memory from '../../components/memory/Memory';
const Feed = () => {
    const auth = getAuth();
    const [feed, setFeed] = useState([]);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPosts = async () => {
            const db = getFirestore();
            const q = query(collection(db, "posts"), where("followers", "array-contains", auth.currentUser.uid), limit(4));
            const querySnapshot = await getDocs(q);
            const tempArray = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                tempArray.push(doc);
            })

            const l = query(collection(db, "memories"), where("followers", "array-contains", auth.currentUser.uid), limit(3));
            const querySnapshot2 = await getDocs(l);

            const tempArray2 = [];
            querySnapshot2.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                tempArray2.push(doc);
            })

            const tempArray3 = [...tempArray, ...tempArray2];

            const feedArray = tempArray3.sort((a, b) => {
                return new Date(b.data().createdAt) - new Date(a.data().createdAt);
            })

            setFeed(feedArray);
            setLoading(false);
        }

        getPosts();
    }, [])
    return ( 
        <>  
            <div className="feed-container">
                <div className="header" style = {{padding: "1rem"}}>
                    <h2>Grad Map</h2>
                    <FaInfoCircle onClick = {()=> navigate('/info')} size = {25}/>
                </div>
                <br />
                <br />       
                <br />       
                <br />       

                <div className="feed-content">
                    {
                        loading ? 
                        <>
                            <br />
                            <AiOutlineLoading size = {25} className = "loading-wheel" />
                        </>
                        :
                        <>
                            {
                                feed.map((post) => {
                                    if(post.data().type === 'thought') {
                                        return <IndivisualPost post = {post} key = {post.id} />
                                    }
                                    else {
                                        return <Memory memory = {post} key = {post.id}/>
                                    }
                                })

                            }{
                                feed.length === 0 &&
                                <h4>Try following some people to see posts!</h4>
                            }
                        </>
                    }
                </div>     
                <br />   
                <br />       
                <br />           
            </div>
        </>
     );
}
 
export default Feed;