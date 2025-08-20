export default function Footer() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start bottom-0 w-full bg-gradient-to-r from-blue-800 to-blue-950 text-white p-6 flex-wrap space-y-4 md:space-y-0 md:space-x-4">
      <div className="border-r border-b rounded-lg px-5 pb-5 w-full md:w-auto border-cyan-800">
        <p className="text-sm">Built by INSA Development Group - 2017/2025</p>
      </div>

      <div className="border-r border-b rounded-lg px-5 pb-5 w-full md:w-auto border-cyan-800">
        <h2 className="underline text-lg font-semibold">Links</h2>
        <p>
          <a
            href="#"
            className="hover:underline hover:text-cyan-300 transition-colors"
          >
            Home
          </a>
        </p>
        <p>
          <a
            href="#"
            className="hover:underline hover:text-cyan-300 transition-colors"
          >
            Exams
          </a>
        </p>
        <p>
          <a
            href="#"
            className="hover:underline hover:text-cyan-300 transition-colors"
          >
            About
          </a>
        </p>
      </div>

      <div className="border-r border-b rounded-lg px-5 pb-5 w-full md:w-auto border-cyan-800">
        <h2 className="underline text-lg font-semibold">Contact Us</h2>
        <p>Phone: 00000000</p>
        <p>Email: example@gmail.com</p>
      </div>

      <div className="border-b rounded-lg px-5 pb-5 w-full md:w-auto border-cyan-800">
        <h2 className="underline text-lg font-semibold">Legal</h2>
        <p>
          &copy; {new Date().getFullYear()} INSA Group. All rights reserved.
        </p>
      </div>
    </section>
  );
}
