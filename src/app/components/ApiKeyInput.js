"use client";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ApiKeyInput({ value, onChange }) {
  const [showKey, setShowKey] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const toggleVisibility = () => {
    setShowKey(!showKey);
  };

  // Ensure value is a string
  const displayValue = typeof value === 'string' ? value : '';

  return (
    <div className="relative">
      <input
        type={showKey ? "text" : "password"}
        value={showKey ? displayValue : (displayValue ? '••••••••••••••••' : '')}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md pr-10"
        placeholder="Enter your Gemini API key"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
} 