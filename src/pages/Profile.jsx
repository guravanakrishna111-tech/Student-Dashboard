import React from 'react'
import {useState} from 'react'
import prof from '../assets/profile.jpeg'
import './Profile.css'
const Profile = () => {
    const[profile,setProfile]=useState(()=>{
        const saved=localStorage.getItem("profile");
        return saved ? JSON.parse(saved) : {
            name:"",
            mail:"",
            number:"",
            location:""
        }
    })

    const handleChange=(e)=>{
        const{name,value}=e.target;
        setProfile(prev=>({...prev,[name]:value}))
    }
    const handleSave=()=>{
        localStorage.setItem("profile",JSON.stringify(profile))
        alert("Saved")
    }

  return (
    <div>
      <div className='profile'>

        <div className='navbar'>
            <img src={prof} alt="profile"/>
            <h4>{profile.name||"Your Name"}</h4>
            <h5>{profile.mail ||"yourname@gmail.com"}</h5>
        </div>

        <div>
            <input type="text" placeholder='Name' name="name" value={profile.name} onChange={handleChange}/>
            <input type="email" placeholder='e-mail' name='mail' value={profile.mail} onChange={handleChange}/>
            <input type="tel" placeholder='mobile number' name='number' value={profile.number} onChange={handleChange}/>
            <input type="text" placeholder='Location' name='location' value={profile.location} onChange={handleChange}/>

            <button
              type="button"
              onClick={handleSave}
              disabled={!profile.name || !profile.mail}
            >
              Save
            </button>
        </div>

      </div>
    </div>
  )
}

export default Profile