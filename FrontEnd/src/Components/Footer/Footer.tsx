export default function Footer() {
  return (
    <section className="flex flex-col md:flex-row justify-between bottom-0 w-full bg-blue-950 text-white p-4 flex-wrap space-y-4 md:space-y-0 md:space-x-4">
      <div className="border-r border-b rounded-lg px-5 pb-5 w-full md:w-auto  border-cyan-800">
        <p>Built by INSA 2017/2025 Development group-35</p>
      </div>

      <div className="border-r border-b rounded-lg px-5 pb-5 w-full md:w-auto  border-cyan-800">
        <h2 className="underline">Links</h2>
        <p>
          <a href="">Home</a>
        </p>
        <p>
          <a href="">Exams</a>
        </p>
        <p>
          <a href="">About</a>
        </p>
      </div>

      <div className="border-r border-b rounded-lg px-5 pb-5 w-full md:w-auto  border-cyan-800">
        <h2 className="underline">Contact us</h2>
        <p>Phone: 00000000</p>
        <p>Email: example@gmail.com</p>
        <h2>PO.BOX: ****</h2>
      </div>

      <div className="border-b rounded-lg px-5 pb-5 w-full md:w-auto  border-cyan-800">
        <h2 className="underline">Legal</h2>
        <p>
          &copy; {new Date().getFullYear()} INSA Group 35. All rights reserved.
        </p>
      </div>
    </section>
  );
}
