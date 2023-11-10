"use client";

interface ICustomInput {
  px?: number;
  py?: number;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
}

const CustomInput = ({
  px,
  py,
  placeholder,
  value,
  onChange,
}: ICustomInput) => {
  const changeHandler = (e: any) => {
    onChange(e.target.value);
  };
  return (
    <input
      className={`px-${px} py-${py} rounded-lg bg-gray-200`}
      placeholder={placeholder}
      value={value}
      onChange={changeHandler}
    />
  );
};

export default CustomInput;
