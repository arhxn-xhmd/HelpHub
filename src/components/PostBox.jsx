import React, { useState, useContext } from "react";
import { tokenContext } from "../context/tokenContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostBox = () => {
  const [step, setStep] = useState(1);
  const token = useContext(tokenContext)

  const [form, setForm] = useState({
    title: "",
    description: "",
    file: null,
    mode: "online",
  });

  const next = () => setStep((prev) => Math.min(prev + 1, 5));
  const prev = () => setStep((prev) => Math.max(prev - 1, 1));

  const submitProblem = async () => {
    let formData = new FormData()

    formData.append("title", form.title)
    formData.append("description", form.description)
    formData.append("mode", form.mode)
    formData.append("file", form.file)

    const response = await fetch("http://localhost:3000/post", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.token}`
      },
      body: formData
    })

    const result = await response.json()

    if (!response.ok) {
      toast("Sign In to continue!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    }
    setStep(1)
    setForm({
      title: "",
      description: "",
      file: null,
      mode: "online",
    });

    toast(result.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }


  return (

    <div className="w-full bg-zinc-900 rounded-2xl p-6 my-10 shadow-2xl border border-purple-500/30">

      <div className="flex items-center mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex-1">
            <div
              className={`h-2 rounded-full ${step >= s ? "bg-purple-500" : "bg-gray-700"
                }`}
            />
          </div>
        ))}
      </div>

      {/* STEP CONTENT */}

      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-purple-400">
            Step 1: Title
          </h2>
          <input
            type="text"
            placeholder="Enter problem title..."
            className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:border-purple-500 outline-none placeholder:text-gray-400 text-white"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-purple-400">
            Step 2: Description
          </h2>
          <textarea
            placeholder="Explain your problem..."
            className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:border-purple-500 outline-none h-32 resize-none placeholder:text-gray-400 text-white"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-purple-400">
            Step 3: Upload (Optional)
          </h2>

          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500 p-6 rounded-lg cursor-pointer hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition"
          >
            <p className="text-gray-400">Click to upload file</p>
          </label>

          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={(e) =>
              setForm({ ...form, file: e.target.files[0] })
            }
          />

          {form.file && (
            <p className="mt-3 text-green-400 text-sm">
              Selected: {form.file.name}
            </p>
          )}
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-purple-400">
            Step 4: Mode
          </h2>

          <div className="flex gap-4">
            {["online", "offline"].map((mode) => (
              <button
                key={mode}
                onClick={() => setForm({ ...form, mode })}
                className={`px-4 py-2 rounded-lg border transition ${form.mode === mode
                  ? "bg-purple-600 border-purple-400"
                  : "border-gray-700 text-gray-400 hover:border-purple-500"
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-purple-400">
            Review & Post
          </h2>

          <div className="space-y-2 text-gray-300">
            <p><strong>Title:</strong> {form.title}</p>
            <p><strong>Description:</strong> {form.description}</p>
            <p><strong>Mode:</strong> {form.mode}</p>
            <p><strong>File:</strong> {form.file?.name || "None"}</p>
          </div>
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prev}
          disabled={step === 1}
          className="px-4 py-2 bg-gray-500 rounded-lg disabled:opacity-50"
        >
          Back
        </button>

        {step < 5 ? (
          <button
            onClick={next}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            Next
          </button>
        ) : (
          <button onClick={submitProblem} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
            Post 🚀
          </button>
        )}
      </div>
    </div>

  );
};

export default PostBox;