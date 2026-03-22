import { useState, useEffect } from 'react';
import { link } from 'react-router-dom';

export default function Home(){
    const [Courses,setCourses] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [Error,setError] = useState(null);

    useEffect(()=>{
        fetch('http://localhost:3000/api/v1/course/preview')
        .then((response)=>{
            if(!response.ok) throw new Error("Failed to fetch courses");
            return response.json;
        })
        .then((data)=>{
            setCourses(data.Courses);
            setLoading(false);
        })
        .catch((err)=>{
            setError(err.message);
            setLoading(false);
        });
    },[]);

    if (Loading) return <div>Loading Courses .....</div>
    if(Error) return <div> Error :{Error}</div>

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
                            
                            {/* Navigates to the details page for this specific course */}
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