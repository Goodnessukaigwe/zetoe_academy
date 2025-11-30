"use client";
import { useState } from "react";
import { Course, Question } from "@/types/database";
import { X, Plus, Trash2 } from "lucide-react";

export default function CreateExamModal({
  courses,
  onClose,
  onSuccess,
}: {
  courses: Course[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_id: "",
    code: "",
    duration_minutes: "",
    passing_score: "",
  });
  const [questions, setQuestions] = useState<Partial<Question>[]>([
    { question: "", options: ["", "", "", ""], correct_answer: 0, points: 1 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correct_answer: 0, points: 1 },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...(updated[qIndex].options || [])];
    options[oIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options };
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate questions
    if (questions.length === 0) {
      setError("Please add at least one question");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question?.trim()) {
        setError(`Question ${i + 1} is empty`);
        return;
      }
      if (q.options?.some((opt) => !opt.trim())) {
        setError(`All options in Question ${i + 1} must be filled`);
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration_minutes: parseInt(formData.duration_minutes),
          passing_score: parseInt(formData.passing_score),
          questions: questions.map((q, idx) => ({
            id: `q_${idx + 1}`,
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            points: q.points || 1,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create exam");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl border border-gray-700 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">Create New Exam</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Exam Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#3a0ca3]"
                placeholder="Midterm Exam"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Course *
              </label>
              <select
                required
                value={formData.course_id}
                onChange={(e) =>
                  setFormData({ ...formData, course_id: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#3a0ca3]"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Access Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#3a0ca3] font-mono"
                placeholder="EXAM2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, duration_minutes: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#3a0ca3]"
                placeholder="60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Passing Score (%) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.passing_score}
                onChange={(e) =>
                  setFormData({ ...formData, passing_score: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#3a0ca3]"
                placeholder="70"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#3a0ca3]"
              placeholder="Exam description..."
            />
          </div>

          {/* Questions */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-1 px-3 py-1 bg-[#3a0ca3] hover:bg-[#4c1d95] text-white rounded text-sm"
              >
                <Plus size={16} />
                Add Question
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-white">
                      Question {qIndex + 1}
                    </h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(qIndex, "question", e.target.value)
                    }
                    className="w-full px-3 py-2 mb-3 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:border-[#3a0ca3]"
                    placeholder="Enter question text"
                  />

                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-2">Select the correct answer:</p>
                  </div>

                  <div className="space-y-2">
                    {q.options?.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
                        <input
                          type="radio"
                          name={`correct_${qIndex}`}
                          checked={q.correct_answer === oIndex}
                          onChange={() =>
                            updateQuestion(qIndex, "correct_answer", oIndex)
                          }
                          className="w-5 h-5 accent-green-500 cursor-pointer"
                        />
                        <label className="text-sm font-medium text-gray-400 min-w-[70px]">
                          Option {oIndex + 1}:
                        </label>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, e.target.value)
                          }
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-[#3a0ca3]"
                          placeholder={`Enter option ${oIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-700 bg-gray-900 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#3a0ca3] hover:bg-[#4c1d95] text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
