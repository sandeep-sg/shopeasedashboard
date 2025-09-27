import React from "react";

const Select = ({ name, label, register, errorMessage, errors, options }) => {
  return (
    <div>
      <label htmlFor="category" className="block text-primary  mb-1">
        {label}
      </label>
      <select
        {...register(name, { required: errorMessage })}
        name={name}
        id={name}
        className="w-full p-2 bg-main rounded-md text-primary
            border-primary
             focus:border-border-secondary 
             outline-none 
                      placeholder-gray-400"
      >
        <option value="">Select {name}</option>
        {options?.map((cat) => {
          return (
            <option key={cat._id} value={cat._id}>
              {cat.category}
            </option>
          );
        })}
      </select>
      {errors[name] && (
        <span className="text-sm text-red-500">{errors[name].message}</span>
      )}
    </div>
  );
};

export default Select;
