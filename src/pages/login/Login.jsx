import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import './login.css';
import LoginCollage from './loginCollage.png';
import {FaChevronDown, FaChevronUp, FaGraduationCap} from 'react-icons/fa';
import {useRef, useState} from 'react';
const Login = () => {

    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    const handleSignIn = () => {
        signInWithPopup(auth, provider)
    }

    const bottomRef = useRef();
    const topRef = useRef();
    const [opened, setOpened] = useState(false);

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

    const handleOpen = () => {
        setOpened(true);
        bottomRef.current.scrollIntoView({
            behavior: "smooth",
        })
    }

    const handleClose = () => {
        setOpened(false);
        topRef.current.scrollIntoView({
            behavior: "smooth",
        })
    }

    return ( 
        <>
            <div className="login-container " ref = {topRef}>
                <img src= {LoginCollage} alt="collage" />
                <div className="login-box">
                    {/* Logo Img */}
                        <h1>Grad Map <FaGraduationCap /></h1>
                        <p>Share High School Memories</p>
                    <button onClick={handleSignIn}><img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png" alt = 'google img'></img>Continue With Google</button>
                </div>
                <div className="features-page"
                >
                    <h3>Here's how it works 

                        {
                            opened ? <FaChevronUp onClick = {handleClose}/> : <FaChevronDown onClick = {handleOpen}/>
                        }
                        
                    </h3>
                </div>
            </div>
            <div className="features">
                <h1>
                    Grad Map
                </h1>
                <p>
                    Giving people a way to remembers their friends and supporters wherever in the world they go!
                </p>
                <p>Keep connected throught the world with Grad Map</p>

                <ColoredLine color="grey" />
                <p>Spread your thoughts</p>
                <p>Share Highschool Memories</p>
                <p>Browse the map so see where your friends are</p>
                <br />

                <div ref = {bottomRef} className = "ref"/>
            </div>
           
        </>
     );
}
 
export default Login;