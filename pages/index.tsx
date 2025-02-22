export default function Home() {
  const buttons = [
    { label: "Hello", link: "/api/hello" },
    { label: "Gemini Vision", link: "/api/gemini?ask=what is ai" },
    { label: "Go to Home", link: "/" },
    { label: "Go to About", link: "/about" },
    { label: "Go to Contact", link: "/contact" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black space-y-4">
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={() => (window.location.href = btn.link)}
          className="w-48 h-12 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}