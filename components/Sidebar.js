import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className="sidebar-content">
        <h2>Shoti API</h2>
        <p>Shoti Website</p>
        <div className="projects">
          <p onClick={() => setIsProjectsOpen(!isProjectsOpen)}>
            📂 Projects {isProjectsOpen ? "▼" : "▶"}
          </p>
          {isProjectsOpen && (
            <ul>
              <li><Link href="#">GPT-4o</Link></li>
              <li><Link href="#">Llama</Link></li>
              <li><Link href="#">Gemini 1.5</Link></li>
              <li><Link href="#">Mistral</Link></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}