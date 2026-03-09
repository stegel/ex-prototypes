"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SimpleForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    zip: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const isUS = formData.country === "US";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "country" && value !== "US" ? { zip: "" } : {}),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-secondary p-8">
      <div className="card bg-bg shadow-card max-w-md w-full border border-border rounded-xl">
        <div className="card-body p-8">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">✓</div>
              <h2 className="text-xl font-semibold text-text-primary">Submitted!</h2>
              <div className="text-left space-y-2 text-text-secondary text-sm">
                <p><span className="font-medium text-text-primary">Name:</span> {formData.name}</p>
                <p><span className="font-medium text-text-primary">Email:</span> {formData.email}</p>
                <p><span className="font-medium text-text-primary">Country:</span> {formData.country}</p>
                {formData.zip && (
                  <p><span className="font-medium text-text-primary">ZIP Code:</span> {formData.zip}</p>
                )}
              </div>
              <button
                className="btn btn-ghost btn-sm mt-2"
                onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", country: "", zip: "" }); }}
              >
                Reset
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-text-primary mb-6">Contact Info</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary" htmlFor="country">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="" disabled>Select a country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {isUS && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-secondary" htmlFor="zip">
                      ZIP Code
                    </label>
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      required
                      placeholder="10001"
                      pattern="^\d{5}(-\d{4})?$"
                      value={formData.zip}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                    />
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full mt-2">
                  Submit
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
