import { buttonStyles } from "./constants";

interface Props {
  title: string;
  extraStyles?: string;
  onClick: () => void;
}

const Button = ({ title, onClick, extraStyles }: Props) => {
  return (
    <button
      className={`${buttonStyles} ${extraStyles ?? ""}`}
      onClick={onClick}
      onFocus={(e) => e.target.blur()}
    >
      {title}
    </button>
  );
};

export default Button;
