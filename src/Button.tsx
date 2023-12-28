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
    >
      {title}
    </button>
  );
};

export default Button;
