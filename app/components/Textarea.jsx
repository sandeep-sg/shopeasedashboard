import React from "react";

const Textarea = ({ name, errorMessage, register, placeholder, errors }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-primary mb-1">
        {name}
      </label>
      <textarea
        id={name}
        {...register(name, {
          required: errorMessage,
          minLength: {
            value: 10,
            message: "Description must be at least 10 characters",
          },
        })}
        className="w-full p-2  border-primary rounded-md text-primary  border-primary
                  
             focus:border-border-secondary 
             outline-none 
                      placeholder-gray-400 min-h-[120px]"
        placeholder={placeholder}
        rows={4}
      />
      {errors[name] && (
        <span className="text-sm text-red-500">{errors[name].message}</span>
      )}
    </div>
  );
};

export default Textarea;
