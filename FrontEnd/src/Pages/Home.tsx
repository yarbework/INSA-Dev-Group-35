
import { ChevronDown } from "lucide-react";
import image from "../../public/home.jpg";


function Home() {
  return (

    <>

      <div
      
        style={{ backgroundImage: `url(${image})`, backgroundSize: "cover" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col justify-center h-screen px-10 py-20 ">
          <h1 className="text-5xl mb-10">
            Learn <br /> new concepts <br /> for each question
          </h1>
          <p className="teext-sm ml-5">
            {" "}
            <span className="text-yellow-300 font-bold">|</span> we help you
            prepare for exams and quizes
          </p>
          <div className="flex items-center ">
            <button className="bg-yellow-300 text-white text-xl px-4 py-2  mt-4 mx-10">
              Start Learning
            </button>

            <a href="" className="flex text-yellow-300 px-4 py-2 rounded mt-4">
              {" "}
              <ChevronDown />
              know more
            </a>
          </div>
        </div>
      </div>


</>)
}
export default Home;
