import React from "react";

const Input = ({
  name,
  label,
  type,
  errorMessage,
  register,
  placeholder,
  errors,
  isRequired,
}) => {
  return (
    <div>
      <label htmlFor={name} className={`block text-primary  mb-1`}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        {...register(name, {
          required: isRequired ? { value: true, message: errorMessage } : false,
        })}
        className="w-full p-2   rounded-md text-primary
                  border-primary
             focus:border-border-secondary 
             outline-none 
                      placeholder-gray-400"
        placeholder={placeholder}
      />
      {errors[name] && (
        <span className="text-sm text-red-500">{errors[name].message}</span>
      )}
    </div>
  );
};

export default Input;
