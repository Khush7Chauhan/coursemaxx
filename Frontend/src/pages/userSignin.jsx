import { useState } from "react";
import { useNavigate,link } from "react-router-dom";

export default function signin(){
    const [Email,setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{
            const response = await fetch('http://localhost:3000/api/v1/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if(response.ok && data.token){
                localStorage.setItem('token',data.token);
                alert('Successfully logged in');
                navigate('/purchases');
            }else{
                alert("login failed:"+(data.message || "Incorrect creadential"));
            }
        }catch(e){
            console.error("Error logging in:",e);
            alert(" An error occured")
        }
    };

    return (
        <div>
            <h1>Student log in </h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required/>
                </div>
                <div>
                    <label> Password: </label>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                </div>
                <button type="submit">Log in</button>
            </form>
            <p> Don't have an account? <Link to="/signin">Signup here</Link></p>
        </div>

    );
}