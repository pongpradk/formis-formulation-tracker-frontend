import React from "react";

function FormInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default FormInput;
