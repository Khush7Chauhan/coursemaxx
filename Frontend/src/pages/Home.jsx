import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

export default function Home() {
    
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/v1/course/preview')
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch courses");
            return response.json(); 
        })
        .then((data) => {
            setCourses(data.courses || []);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading Courses .....</div>;
    if (error) return <div> Error: {error}</div>;

    return (
        <div>
            <h1>Courses Catalog</h1>
            <div className="classList">
                {courses.length === 0 ? (
                    <p>No courses available right now.</p>
                ) : (
                    courses.map((course) => (
                        <div key={course._id} className="course-card">
                            <img src={course.imageUrl} alt={course.title} width="250" />
                            <h2>{course.title}</h2>
                            <p>{course.description}</p>
                            <p><strong>Price:</strong> ${course.price}</p>
                            
                            <Link to={`/course/${course._id}`}>
                                <button>View Details</button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}