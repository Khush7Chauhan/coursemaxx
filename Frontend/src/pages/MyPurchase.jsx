import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function myPurchase(){
    const [Purchases, setPurchases ] = useState('');
    const [Loading, setLoading ] = useState('true');
    const [Error, setError] = useState('null');
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(!token){
            navigate('/signin');
            return;
        }
        fetch('http://localhost:3000/api/v1/user/purchases', {
            method: 'GET',
            headers: {
                'token': token 
            }
        })
        .then((response)=>{
            if(!response.ok) {
                if(response.status === 403){
                    localStorage.removeItem('token');
                    navigate('/signin');
                    throw new Error ("Session expired, Please Log in again")
                }
                throw new Error("Failed to fetch purchases");
            }
            return response.json()
        })
        .then((data)=>{
            setPurchasedCourses(data.coursesData);
            setLoading(false);
        })
        .catch((err)=>{
            setError(err.message);
            setLoading("false");
        });    
    },[navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    if (Loading) return <div>Loading your dashboard...</div>;
    if (Error) return <div>Error: {error}</div>;

    return (
        <div>
            <header>
                <h1>My Learning Dashboard</h1>
                <button onClick={handleLogout}>Log Out</button>
            </header>

            <div>
                {purchasedCourses.length === 0 ? (
                    <div>
                        <p>You haven't bought any courses yet.</p>
                        <Link to="/"><button>Browse Courses</button></Link>
                    </div>
                ) : (
                    <div className="course-list">
                        {purchasedCourses.map((course) => (
                            <div key={course._id} className="course-card">
                                <img src={course.imageUrl} alt={course.title} width="200" />
                                <h2>{course.title}</h2>
                                <p>{course.description}</p>
                                <button>Start Learning</button> 
                                {/* ^ Placeholder button for when you add video content! */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
