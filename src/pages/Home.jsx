
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import img1 from "../assets/img1.jpg"
import img2 from "../assets/img2.jpg"
import about from "../assets/about.avif"
import back from "../assets/backimg.avif"
// import back from "../assets/back.jpeg"
import amb from "../assets/amb.jpeg"
import amb1 from "../assets/amb1.jpeg"
import amb3 from "../assets/amb3.jpeg"
import amb2 from "../assets/amb2.jpeg"

export default function Home() {
  const features = [
    {
      title: "Fresh Ingredients",
      desc: "We use only the freshest ingredients to serve mouth-watering dishes.",
      img: back,
    },
    {
      title: "Cozy Ambiance",
      desc: "Enjoy a relaxed and friendly environment with every visit.",
      img: amb,
    },
    {
      title: "Excellent Service",
      desc: "Our staff is trained to provide top-notch service every time.",
      img: amb1,
    },
  ];

  return (
    <>
      <Navbar />


      <div
        className="relative h-screen bg-cover bg-center"
        style={{
          // backgroundImage: `url(${back})`,
          backgroundImage: `url("https://t4.ftcdn.net/jpg/06/30/88/01/360_F_630880161_0m4cwaGBLFBhoqy5rlI2VkIhRv8SlrPw.jpg")`,
        }}
      >
        {/* Dark overlay and text */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Welcome to <span className="text-yellow-400">Lithos Bar and Grill</span>
          </h1>
          <p className="text-lg md:text-2xl mb-6">
            Experience culinary perfection, one dish at a time.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link to="/menu">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg shadow-md transition-all">
                View Menu
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="bg-white hover:bg-gray-200 text-black font-semibold py-2 px-6 rounded-lg shadow-md transition-all">
                Admin Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>



      {/* Features Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 max-w-6xl mx-auto">
          {features.map((item, index) => (
            <div
              key={index}
              className="max-w-sm mx-auto bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <img
                className="rounded-lg mb-4 w-full h-48 object-cover"
                src={item.img}
                alt={item.title}
              />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img
            src={amb3}
            alt="About Lithos"
            className="rounded-xl shadow-md w-full h-80 object-cover"
          />
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">About Lithos Bar and Grill</h2>
            <p className="text-lg text-gray-700 mb-4">
              At Lithos, we blend tradition and innovation to deliver unforgettable meals in a
              cozy and vibrant atmosphere. Every dish is crafted with passion and precision.
            </p>
            <p className="text-gray-600">
              Whether you're enjoying a quiet dinner or celebrating with friends, we promise top-tier service,
              fresh ingredients, and a memorable experience. Come taste the difference!
            </p>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Lithos Bar and Grill</h4>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Our Location</h4>
            <p className="text-sm">Oroklini, Larnaca, Cyprus</p>
            <p className="text-sm">Phone: 97868418</p>
          </div>
        </div>
      </footer>

    </>
  );
}
