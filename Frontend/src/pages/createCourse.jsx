import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
export default function createCourse() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageLink: '',
        price: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const adminToken = localStorage.getItem('adminToken');
        
        if (!adminToken) {
            alert("You must be logged in as an admin to do this.");
            navigate('/admin/signin');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/v1/admin/course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}` 
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    imageUrl: formData.imageLink,
                    price: Number(formData.price)
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Course successfully created!");
                navigate('/admin/dashboard'); 
            } else {
                alert("Failed to create course: " + data.message);
            }
        } catch (error) {
            console.error("Creation error:", error);
            alert("An error occurred while creating the course.");
        }
    };
    return (
        <div>
            <Link to="/admin/dashboard">← Back to Dashboard</Link>
            
            <h1>Create a New Course</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Course Title: </label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description: </label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div>
                    <label>Image URL: </label>
                    {/* Note: name must match the state key (imageLink) exactly */}
                    <input type="text" name="imageLink" value={formData.imageLink} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price ($): </label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
                </div>
                
                <button type="submit">Publish Course</button>
            </form>
        </div>
    );
}