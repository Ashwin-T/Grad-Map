import {app} from './tools/Firebase';
import {getAuth} from 'firebase/auth'
import {useAuthState} from 'react-firebase-hooks/auth';
import Login from './pages/login/Login';
import Loading from './components/loading/Loading';
import AppRoutes from './pages/AppRoutes';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import {MdOutlineIosShare} from 'react-icons/md';
import {BsThreeDotsVertical} from 'react-icons/bs';
import {FaGraduationCap} from 'react-icons/fa';
const App = ()=>{

  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);

  function isRunningStandalone() {
    return (window.matchMedia('(display-mode: standalone)').matches);
  }
  const [hasAdded, setHasAdded] = useState(!isRunningStandalone());
  const userAgent = window.navigator.userAgent
  const isAndroid = userAgent.indexOf('Android') > -1;
  const isIOS = userAgent.indexOf('iPhone') > -1;
  
  return (
    <div className="App">
      {
        window.innerWidth <= 768 && 
        <>
          {
            loading ? <Loading /> : hasAdded ? 
            <>
            <div className='download'>
              <h1>Download Grad Map <FaGraduationCap /></h1>
              <p>
                To add Grad Map to the home screen tap
              </p>

              {
                  isIOS && 
                  <MdOutlineIosShare style = {{color: 'dodgerblue', margin: '0'}} size = {25}/>

              }
              {
                  isAndroid &&
                  <BsThreeDotsVertical size = {25}/>
              }
              <p>
                  and then press <span style = {{fontWeight: 'bold'}}>Add to Home Screen</span>
              </p>
              <p className = 'skip' onClick = {()=>setHasAdded(false)}>
                or skip
              </p>
              

          </div>
            </>: user ? <AppRoutes /> : <Login />
          }
        </>
      }
      {
        window.innerWidth > 768 &&
        <>
          <center style = {{marginTop: "25%"}}>
            <h1>This app is not designed for laptops or larger screens</h1>
          </center>
        </>
      }
    </div>
  )
}

export default App
