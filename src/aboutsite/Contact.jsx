import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can integrate an email API or backend to handle form submissions
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className="max-w-4xl mx-auto p-6 prose prose-lg">
      <h1>Contact Us</h1>
      <p>
        We’d love to hear from you! Whether you have questions, feedback, or suggestions,
        please reach out using the form below or via our contact information.
      </p>

      {submitted && <p className="text-green-600">Thank you! Your message has been sent.</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          Message
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            rows={6}
          />
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Send Message
        </button>
      </form>

      <h2 className="mt-8">Other Ways to Contact Us</h2>
      <p>Email: <a href="mailto:solvixan.office@gmail.com">solvixan.office@gmail.com</a></p>
      <p>Website: <a href="https://www.ownyourpdf.online">https://www.ownyourpdf.online</a></p>
    </main>
  );
}
