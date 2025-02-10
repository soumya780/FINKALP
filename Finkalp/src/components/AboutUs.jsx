import React from "react";

function AboutUs() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <img
            src="/images/about-us.jpg"
            alt="About Us"
            className="rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2 pl-8 md:pl-16">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg">
            We are a leading land acquisition company with years of experience
            in helping clients find the perfect property.
          </p>
          <p className="text-lg">
            Our team of experts is dedicated to providing exceptional service
            and ensuring your complete satisfaction.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
