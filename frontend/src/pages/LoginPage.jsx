import React, { useState } from 'react'
import assets from '../assets/assets'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setcurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDatasubmited, setIsDataSunmitted] = useState(false);
  const {login} = useContext(AuthContext)


  const handleSubmit = (e) => {
    e.preventDefault();
    if (currState === "Sign up" &&!isDatasubmited) {
      setIsDataSunmitted(true);
      return;
    } 
    else {
      console.log("Logging in with", email, password);
    }
    login(currState==="Sign up"? 'signup':'login',{fullName,email,password,bio})
  }

  return (
    <div className='min-h-screen flex bg-cover bg-center items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} alt="logo" className='w-[min(30vw,250px)]' />

      <form onSubmit={handleSubmit} className='border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDatasubmited && <img onClick={()=>setIsDataSunmitted(false)} src={assets.arrow_icon} alt="arrow" className='w-5 cursor-pointer' />
          } 
        </h2>

        {currState === "Sign up" && !isDatasubmited && (
          <input onChange={(e) => setFullName(e.target.value)} value={fullName}
            type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required />
        )}

        {!isDatasubmited && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email" placeholder='Enter your email' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
            <input onChange={(e) => setPassword(e.target.value)} value={password}
              type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
          </>
        )}

        {currState === "Sign up" && isDatasubmited && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio}
            rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Write something about yourself...'></textarea>
        )}

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex flex-col gap-2 text-sm text-gray-500'>
          <label className='flex items-center gap-2'>
            <input type="checkbox" />
            <span>Agree to the terms of use & privacy policy.</span>
          </label>

          {currState === "Sign up" ? (
            <p className='text-sm text-gray-600'>
              Already have an account?
              <span onClick={() => { setcurrState("Login"); setIsDataSunmitted(false); }}
                className='font-medium text-violet-500 cursor-pointer ml-1'>Login here</span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an account
              <span onClick={() => { setcurrState("Sign up"); setIsDataSunmitted(false); }}
                className='font-medium text-violet-500 cursor-pointer ml-1'>Click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage

