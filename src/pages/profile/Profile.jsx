import { useEffect, useState } from 'react';
import { getFirestore, getDoc, doc, addDoc, collection, query, where, getDocs, limit, writeBatch, arrayRemove, arrayUnion } from "firebase/firestore";

import { getAuth } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import IndivisualPost from '../../components/post/Post';
import { AiOutlineLoading } from 'react-icons/ai';
import './profile.css';

const Profile = () => {

    const [user, setUser] = useState("");
    const [forceFollow, setForceFollow] = useState(false);
    const [thoughts, setThoughts] = useState([]);
    const db = getFirestore();
    const auth = getAuth();
    const {uid} = useParams();
    
    const [loading, setLoading] = useState(true);

    const [photoURL, setPhotoURL] = useState("");
    const [name, setName] = useState("");

    useEffect(()=> {
        const getUserData = async () => {

            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if(userDoc.exists()){
                setUser(userDoc);
                setPhotoURL(userDoc.data().photoURL);

                setName(userDoc.data().name);
                
                const q = query(collection(db, "posts"), where("author", "==", uid), limit(5));
                const querySnapshot = await getDocs(q);
                const tempArray = [];
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    tempArray.push(doc);
                });

                setThoughts(tempArray);
                setLoading(false);

            }
            

        }
        getUserData();
    } , []);

    const handleFollow = async() => {
        setForceFollow(true);

        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        
        batch.update(userDocRef, {
            following: arrayUnion(uid)
        })

        const followingDocRef = doc(db, 'users', uid);

        batch.update(followingDocRef, {
            followers: arrayUnion(auth.currentUser.uid)
        })

        const followingLocation = doc(db, 'locations', uid);

        batch.update(followingLocation, {
            followers: arrayUnion(auth.currentUser.uid)
        })

        const notificationRef = collection(db, 'notifications');

        await addDoc(notificationRef, {
            type: "follow",
            author: auth.currentUser.uid,
            to: uid,
            name: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
            createdAt: new Date().toISOString(),
            message: "started following you"
        })

        
        const user = JSON.parse(localStorage.getItem('user'));
        user.followers = [...user.followers, auth.currentUser.uid];
        localStorage.setItem('user', JSON.stringify(user));

        await batch.commit();

    }

    const handleUnfollow = async() => {
        setForceFollow(false);
        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        
        batch.update(userDocRef, {
            following: arrayRemove(uid)
        })

        const followingDocRef = doc(db, 'users', uid);

        batch.update(followingDocRef, {
            followers: arrayRemove(auth.currentUser.uid)
        })

        const user = JSON.parse(localStorage.getItem('user'));
        user.followers = user.followers.filter(follower => follower !== auth.currentUser.uid);
        localStorage.setItem('user', JSON.stringify(user));

        const followingLocation = doc(db, 'locations', uid);
        batch.update(followingLocation, {
            followers: arrayRemove(auth.currentUser.uid)
        })

        await batch.commit();
    }
    return ( 
        <>
            <div className="profile-container">
                {
                    user !== "" &&
                    <>
                        <div className="profile-top">
                            <img src={user.data().photoURL} alt="prof-pic"/>
                            <h2>{user.data().name}</h2>
                        </div>
                        
                        <p className= 'major-city-college'>Studying <span>{user.data().major}</span> <br />at {user.data().college} <br />in {user.data().city}</p>
                        <br />
                        
                        {
                            user.data().followers.includes(auth.currentUser.uid) || forceFollow ?
                            <>
                                <button onClick = {handleUnfollow} className="unfollow-btn" >
                                    Unfollow
                                </button>
                                <br />
                                
                                <div className="current-thoughts">
                                    <h3>{user.data().name.split(" ")[0]}'s Previous Thoughts</h3>
                                </div>
                                {
                                    loading ?
                                    <AiOutlineLoading size = {25} className = "loading-wheel" />
                                    :
                                    <>
                                        {
                                            thoughts.map((thought) => {
                                                return <IndivisualPost post = {thought} key = {thought.id}/>
                                            })
                                            
                                        }
                                        <br />
                                        {
                                            thoughts.length === 0 &&
                                            <p>{user.data().name.split(" ")[0]} has not shared any thoughts yet...</p>
                                        }
                                    </>
                                }
                                
                            </>

                            :
                            <button onClick = {handleFollow} className="follow-btn" >
                                Follow
                            </button>
                    }
                               
                    </>
                }
            </div>
        </>
     );
}
 
export default Profile;