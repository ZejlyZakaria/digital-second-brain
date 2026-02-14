import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type ErrorType = 'required' | 'invalid' | 'email' | 'custom';

interface InsideInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  type?: 'email' | 'password' | 'text';
  required?: boolean;
  errorType?: ErrorType;
  customErrorMessage?: string;
}

const errorMessages: Record<ErrorType, string> = {
  required: 'Ce champ est requis.',
  invalid: 'La valeur entrée est invalide.',
  email: 'Adresse email incorrecte.',
  custom: '',
};

const InsideInput: React.FC<InsideInputProps> = ({
  label,
  id,
  type = 'text',
  required = false,
  errorType,
  className,
  customErrorMessage,
  ...props
}) => {
  const hasError = !!errorType;
  const errorMessage =
    errorType === 'custom' ? customErrorMessage : errorType ? errorMessages[errorType] : '';

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          id={id}
          required={required}
          className={`block px-2.5 pb-2.5 pt-4 pr-10 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 peer
            ${
              hasError
                ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500'
                : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            } ${className || ''}`}
          placeholder=" "
          {...props}
        />

        <label
          htmlFor={id}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left
          bg-white px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
          peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {label}
        </label>

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            tabIndex={-1} 
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {hasError && errorMessage && (
        <p className="mt-1 text-sm text-red-600 w-fit">{errorMessage}</p>
      )}
    </div>
  );
};

export default InsideInput;
