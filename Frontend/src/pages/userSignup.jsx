import { useState } from 'react';
import {useNavigate, Link } from 'react-router-dom';

export default function userSignup(){
    const [formData,setformData] = useState({
        firstName : '',
        lastName: '',
        email: '',
        password: ''

    });
    const navigate = useNavigate();
    const handleChange = (e)=> {
        setformData({
            ...formData,
            [e.target.name] : e.target.value
        });
    }

    const submitChange = async (e)=> {
        e.preventDefault();

        try{
            const response = await fetch('http://localhost:3000/api/v1/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if(response.ok){
                alert("Successfully login in , Please log in");
                navigate('/signin');
            }else{
                alert("signin failed "+ data.message);
            }

        }catch(e){
            console.error("Error in sighin ",e);
            alert("An error is occured please try again");
        }
    };

    return (
        <div>
            <h1>Create a Student Account</h1>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name: </label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Last Name: </label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email: </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                
                <button type="submit">Sign Up</button>
            </form>
            
            <p>Already have an account? <Link to="/signin">Log in here</Link></p>
        </div>
    );
   
} 