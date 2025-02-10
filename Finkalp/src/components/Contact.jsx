import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to server)
    console.log(formData); 
  };

  return (
    <section className="py-20 bg-gray-800 text-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" 
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
          </div>
          <div className="md:w-1/2 pl-8 md:pl-16">
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <p>Phone: [Phone Number]</p>
            <p>Email: [Email Address]</p>
            <p>Address: [Address]</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;