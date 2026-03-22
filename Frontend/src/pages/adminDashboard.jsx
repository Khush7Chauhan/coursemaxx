import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [courses, setcourses] = useState([]);
    const [loading, setloading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        
        if (!adminToken) {
            navigate('/admin/signin');
            return;
        }

        fetch('http://localhost:3000/api/v1/admin/course/bulk', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${adminToken}` 
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch courses");
            return res.json();
        })
        .then(data => {
            setcourses(data.courses || []);
            setloading(false);
        })
        .catch(err => {
            console.error(err);
            localStorage.removeItem('adminToken'); 
            navigate('/admin/signin');
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken'); 
        navigate('/admin/signin');
    };

    if (loading) return <div> Loading Dashboard... </div>

    return (
        <div>
            <header>
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout}>Log Out</button>
            </header>

            <div style={{ margin: "20px 0" }}>
                <Link to="/admin/create-course">
                    <button>+ Create New Course</button>
                </Link>
            </div>

            <h2>Your Courses</h2>
            {courses.length === 0 ? (
                <p>You haven't created any courses yet.</p>
            ) : (
                <div className="admin-course-list">
                    {courses.map(course => (
                        <div key={course._id} className="course-card">
                            <img src={course.imageLink} alt={course.title} width="200" />
                            <h3>{course.title}</h3>
                            <p>Price: ${course.price}</p>
                            <button>Edit Course (To Be Implemented)</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}