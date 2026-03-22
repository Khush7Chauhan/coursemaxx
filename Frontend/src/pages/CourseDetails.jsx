import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function CourseDetails() {
    const { courseId } = useParams(); 
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/v1/course/preview')
            .then((res) => res.json())
            .then((data) => {
                const foundCourse = data.courses.find(c => c._id === courseId);
                setCourse(foundCourse);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [courseId]);

    const handlePurchase = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert("You must be signed in to purchase a course.");
            navigate('/signin');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/v1/course/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token 
                },
                body: JSON.stringify({ courseId: courseId })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); 
                navigate('/purchases'); 
            } else {
                alert("Purchase failed: " + data.message);
            }
        } catch (err) {
            console.error("Error during purchase:", err);
            alert("An error occurred during checkout.");
        }
    };

    if (loading) return <div>Loading course details...</div>;
    if (!course) return <div>Course not found.</div>;

    return (
        <div>
            <Link to="/">← Back to Catalog</Link>
            
            <div className="course-details-container">
                <h1>{course.title}</h1>
                <img src={course.imageUrl} alt={course.title} width="500" />
                
                <div className="course-info">
                    <p>{course.description}</p>
                    <h2>Price: ${course.price}</h2>
                    <button onClick={handlePurchase}>Buy Now</button>
                </div>
            </div>
        </div>
    );
}