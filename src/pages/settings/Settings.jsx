
import { useState } from "react";
import { getFirestore, updateDoc, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import './settings.css';
import { useNavigate } from "react-router-dom";
import {AiOutlineLoading} from 'react-icons/ai';
import {FaArrowLeft} from 'react-icons/fa';
import Error from "../../components/error/Error";
const Settings = () => {

    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [collegeName, setCollegeName] = useState(JSON.parse(localStorage.getItem('user')).college);
    const [city, setCity] = useState(JSON.parse(localStorage.getItem('user')).city);
    const [major, setMajor] = useState(JSON.parse(localStorage.getItem('user')).major);
    const [error, setError] = useState("");
    const handleUpdate = async () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        user.college = collegeName;
        user.city = city;
        user.major = major;
        localStorage.setItem('user', JSON.stringify(user));
        const db = getFirestore();
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
            college: collegeName,
            city: city,
            major: major,
        })

        const locationDocRef = doc(db, 'locations', auth.currentUser.uid);

        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=pk.eyJ1IjoiYXNod2ludGFsd2Fsa2FyIiwiYSI6ImNrdWQ5MTNsdTAwdTgyb3BmZ2N1MGhjOGIifQ.qPKo5Apru46tSyGaY7UE3w`)
        .then(res => res.json())
        .then(data => {
            const lat = data.features[0].center[1];
            const lng = data.features[0].center[0];
            setDoc(locationDocRef, {
                lat: lat,
                lng: lng,   
                author: auth.currentUser.uid,
                photoUrl: auth.currentUser.photoURL,
                name: auth.currentUser.displayName,
                city: city,
                followers: JSON.parse(localStorage.getItem('user')).followers,
                
            }).then(() => {
                setError("");
                setLoading(false);
            })
        })
        .catch(
            (err) => {
                setError("Error finding city");
                setLoading(false);
            }
        )
    }

    return ( 
        <>
            <div className="settings-container">

                <div className="header">
                    <h1>Settings</h1>
                </div>
                <div className="back-button">
                    <FaArrowLeft onClick = {()=> navigate('/user')} size = {25}/>
                </div>
                <div className="settings-content">
                    <div className="indivisual-feild">
                        <h3>Where are you going to college?</h3>
                        <input value = {collegeName} onChange = {(e) => {setCollegeName(e.target.value)}} required type="text" placeholder="Enter Your College Name"/>
                    </div>
                    <div className="indivisual-feild">
                        <h3>What city will you be located in?</h3>
                        <input value = {city} onChange = {(e) => {setCity(e.target.value)}}  required type="text" placeholder="Madison"/>
                    </div>
                    <div className="indivisual-feild">
                        <h3>What is your major?</h3>
                        <input value = {major} onChange = {(e) => {setMajor(e.target.value)}} required type="text" placeholder="Computer Science"/>
                    </div>
                </div>
                {error && <Error message = {error}/>}
                {
                    loading ? 
                    <button className="blue-button">
                        <AiOutlineLoading size = {25} className = "loading-wheel"/>
                    </button>
                    :
                    <button onClick = {handleUpdate} className="blue-button">
                        Update
                    </button>
                }

                <button onClick = {
                    () => {
                        navigate('/');
                        auth.signOut()
                    }
                } className="red-button">Sign Out</button>

            </div>
        </>
     );
}
 
export default Settings;