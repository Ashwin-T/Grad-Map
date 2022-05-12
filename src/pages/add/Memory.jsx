import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {getFirestore, collection, addDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import { useState } from "react";
import {FaCamera, FaCloudUploadAlt} from 'react-icons/fa';
import {AiOutlineLoading} from 'react-icons/ai';
const Memory = () => {
    
    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
        setImageAsFile(image);
    }

    
    const handleUpload = async () => {
        if(imageAsFile !== null && date !== ''){
            setLoading(true);
            const storage = getStorage();
            const picStorageRef = ref(storage, imageAsFile.name); 
        
            await uploadBytesResumable(picStorageRef, imageAsFile);
            getDownloadURL(ref(storage, imageAsFile.name)).then((url)=>{

               const handleSendFirestore = async () => {
                    const db = getFirestore();
                    const auth = getAuth();
                    const memories = collection(db, 'memories');
                    const followers = JSON.parse(localStorage.getItem('user')).following;

                    await addDoc(memories, {
                        image: url,
                        author: auth.currentUser.uid,
                        createdAt: new Date().toISOString(),
                        date: date.slice(0,10),
                        likes: [],
                        followers: followers,
                        name: auth.currentUser.displayName,
                        profilePic: auth.currentUser.photoURL,
                        type: 'memory'
                    })

                    setImageAsFile(null);
                    setLoading(false);

               }

                handleSendFirestore();

            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    const [imageAsFile, setImageAsFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState('');

    return ( 
        <>
            <div className="memory-container">
                <div className="top-area">
                    <label>
                        <input type="file" accept="image/png, image/gif, image/jpeg" onChange={handleImageAsFile}/>
                        <div>
                            <FaCamera size = {50}/>
                        </div>
                    </label>
                    {
                        loading === true ? <button className = 'blue-button'><AiOutlineLoading size = {25} className = "loading-wheel" /></button>
                        :
                        <button className = 'blue-button' onClick={handleUpload}>Share <FaCloudUploadAlt /></button>
                    }
                </div>
                <div className="bottom-area">
                    <br />
                    {(imageAsFile !== null) ? <img src={URL.createObjectURL(imageAsFile)} alt="image"/> : 
                        <p>Please select a photo memory to share</p>
                    }
                    {
                        loading === true && <center>Uploading...</center>
                    }
                    {
                        (imageAsFile !== null) && 
                        <>
                            <br />
                            <label>When was this?</label>
                            <input required onChange = {(e)=> setDate(e.target.value)} type="date" placeholder="When was this?"/>
                        </>
                    }

                </div>
            </div>
        </>
     );
}
 
export default Memory;