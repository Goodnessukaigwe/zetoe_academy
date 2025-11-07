export default function ExamKeyInput() {
  return (
    <div className="flex flex-col sm:flex-row rounded-full border-2 border-[#3a0ca3] overflow-hidden mb-3 focus-within:ring-2 focus-within:ring-[#3a0ca3]/40 transition">
      <input
        type="text"
        placeholder="Enter exam key"
        className="flex-grow px-4 py-2 text-sm sm:text-base outline-none font-['Roboto_Condensed']"
      />
      <button className="bg-[#3a0ca3] text-white px-6 py-2 text-sm sm:text-base font-['Times_New_Roman'] hover:bg-[#4525a3] transition">
        Next
      </button>
    </div>
  );
}
