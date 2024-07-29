import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props)=> {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    let history=useNavigate();

    const handleSubmit= async (e)=>{
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:credentials.email , password:credentials.password })
          });
          const json= await response.json()
          console.log(json)
          if(json.success){
            localStorage.setItem('token',json.authtoken)
            history("/")
            props.showAlert("User Login","success")
          }
          else{
            props.showAlert("invalid creds   !!","danger")
          }
    }
    
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}> 
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" name='email' value={credentials.email} onChange={onChange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" name='password' value={credentials.password} onChange={onChange} className="form-control" id="exampleInputPassword1" />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login