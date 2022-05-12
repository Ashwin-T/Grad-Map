import { useEffect, useState } from "react";
import { getFirestore, deleteDoc, doc , collection, query, where, getDocs, limit} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import './user.css';
import {FaCogs, FaTrashAlt,FaBell} from 'react-icons/fa';
import {AiOutlineLoading} from 'react-icons/ai';
import { useNavigate } from "react-router-dom";

const User = () => {

    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();
    const userObject = JSON.parse(localStorage.getItem('user'));
    
    const [thoughts, setThoughts] = useState([]);
    const [memories, setMemories] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [currentID, setCurrentID] = useState(null);
    const [type, setType] = useState(null);
    const [loading, setLoading] = useState(true);

    const getMemories = async() => {
        const q = query(collection(db, "memories"), where("author", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const tempArray = [];

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            tempArray.push(doc);
        });

        setMemories(tempArray);
        setLoading(false);

    }
    useEffect(() => {
        const getPosts = async () => {
            const q = query(collection(db, "posts"), where("author", "==", auth.currentUser.uid), limit(5));
            const querySnapshot = await getDocs(q);
            const tempArray = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                tempArray.push(doc);
            });

            setThoughts(tempArray);
            setLoading(false);
        }

        getPosts();

    }, [])

    const hanldleDelete = async(id) => {
        if(type === "memory"){
            await deleteDoc(doc(db, "memories", id));
        }
        else{
            await deleteDoc(doc(db, "posts", id));
        }

        setThoughts(thoughts.filter(thought => thought.id !== id));
        setMemories(memories.filter(memory => memory.id !== id));
        handleCloseModal(); 
    }

    const DeleteModal = ({id, type}) => {
        return (
            <div className="delete-modal">
                <p>Are you sure you want to delete this {type}?</p>
                <div>
                    <button className = 'yes-btn' onClick={() => hanldleDelete(id)}>Yes</button>
                    <button className = 'no-btn' onClick={handleCloseModal}>No</button>
                </div>
            </div>
        )
    }
    
    const handleOpenModal = (id, type) => {
        setShowModal(true);
        setCurrentID(id);
        setType(type);
        document.body.style.backgroundColor = "rgba(0,0,0,0.5)";
    }   

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentID(null);
        setType(null);
        document.body.style.backgroundColor = "white";
    }

    const [showMemories, setShowMemories] = useState(false);

    const handleGetMoreMemories = async () => {
        setShowMemories(!showMemories)
        if(memories.length <  1){
            getMemories();
        }
    }
    return (
        <>
            {showModal && <DeleteModal type = {type} id = {currentID}/>}
            <div className="topbar">
                <h2>{userObject.name}</h2>
                <div>
                    <FaBell className="bell" size = {25} style = {{color: '#f6b800'}} onClick = {()=> navigate('/notifications')}/>
                    <FaCogs onClick = {()=> navigate('/settings')} size = {25} style = {{color: 'grey'}}/>
                </div>
            </div>
            <br />
            <br />

            <div className="profile-container">
                <div className="profile-top">
                    <img src={userObject.photoURL} alt="prof-pic"/>
                    <h2>{userObject.name}</h2>
                </div>
                <p className="major-city-college">Studying <span>{userObject.major}</span> <br />at {userObject.college} <br />in {userObject.city}</p>
                <br />
                <div className="current-thoughts">
                    <h3>Your Current {
                            !showMemories ? 'Thoughts' : 'Memories'
                        }
                    </h3>
                    <label>
                        <input type="checkbox" defaultChecked={showMemories} onChange={handleGetMoreMemories}/>
                        <span>Show {
                            showMemories ? 'thoughts' : 'memories'
                        }</span>
                    </label>
                </div>
                {
                    loading ? <AiOutlineLoading size = {25} className = "loading-wheel" />
                    :
                    <>
                        {
                            <>
                                {
                                    !showMemories ?
                                    <>
                                        {
                                        thoughts.map((thought) => {
                                            return (
                                                <div key = {thought.id} className="thought">
                                                    <div className='thought-page'>
                                                        <br />
                                                        <h3>{thought.data().message}</h3>
                                                        <br />
                                                    </div>
                                                    <FaTrashAlt size = {25} style = {{color: "red", marginRight: "1rem"}}onClick={()=>handleOpenModal(thought.id, "thought")} className="delete-icon" />
                                                </div>
                                            )
                                        })
                                        
                                    }
                                    {
                                        thoughts.length === 0 &&
                                        <p>You have not shared any thoughts yet...</p>
                                    }
                                    </> 
                                    :
                                    <>
                                        {
                                            loading ? <AiOutlineLoading size = {25} className = "loading-wheel" />
                                            :
                                            <>
                                                {
                                                    memories.map((memory) => {
                                                        return (
                                                            <span key = {memory.id}>
                                                                <img src={memory.data().image} alt="memory"/>
                                                                <div className="memory-bottom">
                                                                    <p>From {memory.data().date}</p>
                                                                    <FaTrashAlt size = {25} style = {{color: "red", marginRight: "1rem"}} onClick={()=>handleOpenModal(memory.id, "memory")} className="delete-icon" />
                                                                </div>
                                                            </span>
                                                        )
                                                    })
                                                }
                                                <br />
                                                <br />
                                            </>
                                        }
                                    </>
                                }
                            </>
                        }
                    </>
                }
                <br />
                
            </div>
        </>
      );
}
 
export default User;