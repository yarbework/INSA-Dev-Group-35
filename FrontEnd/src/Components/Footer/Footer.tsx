

export default function Footer() {
  return (

    
    < section className="flex flex-row justify-between fixed bottom-0 w-full bg-blue-950 text-white p-4">
      <div>
        <p>Built by INSA 2017/2025 Development group-35</p>
      </div>

      <div>
        <h2 className="underline">Links</h2>

        <p><a href="">Home</a></p>
        <p><a href="">Exams</a></p>
        <p><a href="">About</a></p>
      </div>

    <div>
      <h2 className="underline">Contact us</h2>

      <p>Phone: 00000000</p>
      <p>Email: example@gmail.com</p>
      <h2>PO.BOX: ****</h2>
    </div>

    <div className="underline">
      <h2>Legal</h2>

      <p>&copy; {new Date().getFullYear()} INSA Group 35. All rights reserved.</p>

    </div>
  </section>
  )
}

