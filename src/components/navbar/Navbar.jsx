import {FaMapMarkerAlt, FaBrain, FaRegLaughBeam, FaUserCircle, FaSearch, FaPlusSquare, FaHome} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import './navbar.css';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
const Navbar = () => {

    const {pathname} = useLocation();
    const [showAdd, setShowAdd] = useState(false);

    const AddPopup = () => {
        
        return( 
            <div className="add-popup">
                <Link onClick = {handleToggleAdd} to="/add/post">
                    <FaBrain size = {25}/>
                    <p>Share a thought</p>
                </Link>
                <p><span>Or</span></p>
                <Link onClick = {handleToggleAdd} to="/add/memory">
                    <p>Share a memory</p>
                    <FaRegLaughBeam size = {25} />
                </Link>
            </div>
        )
    }
    
    const links = [ 
        {
            icon: <FaMapMarkerAlt size = {25}/>,
            route: '/map',
        },
        {
            icon: <FaHome size = {25}/>,
            route: '/',
        },
        {
            icon: <FaSearch size = {25}/>,
            route: '/search',
        },
        {
            icon: <FaUserCircle size = {25}/>,
            route: '/user',
        }
        
    ]

    const handleToggleAdd = () => {
        setShowAdd(!showAdd);
    }
    return ( 
        <>
            {
                showAdd && <AddPopup />
            }
            <nav>
               
                <FaPlusSquare size = {25} onClick = {handleToggleAdd} />
                {
                    links.map(link => (
                        <Link 
                        key = {link.route} to = {link.route}>
                            <span className = {pathname === link.route ? 'active' : ''}>
                                {link.icon}
                            </span>
                        </Link>
                    ))
                }
            </nav>
        </>
     );
}
 
export default Navbar;