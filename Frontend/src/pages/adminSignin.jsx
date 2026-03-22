import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function adminSignin(){
    const [ isLogin, setisLogin] = useState(true);
    const [userName, setuserName ] = useState('');
    const [password , setpassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/v1/admin/signin' : '/api/v1/admin/signup';
        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('adminToken', data.token);
                    alert("Admin logged in successfully!");
                    navigate('/admin/dashboard');
                } else {
                    alert("Admin account created! You can now log in.");
                    setisLogin(true); 
                    setpassword('');  
                }
            } else {
                alert("Error: " + (data.message || "Invalid request"));
            }
        } catch (error) {
            console.error("Admin Auth Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return ( 
        <div>
            <h1>{isLogin ? "Admin Portal: Log In" : "Admin Portal: Create Account"}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label> Username: </label>
                    <input type="text" value={userName} onChange={(e)=> setuserName(e.target.value)} required/>
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} required />
                </div>
                <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
            </form>

            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
            </button>
        </div>
    
    );
}
