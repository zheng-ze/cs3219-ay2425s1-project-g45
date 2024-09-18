export default function Textfield({ name, secure=false, placeholder_text="Enter your text" }:
  { name?: string, secure?: boolean, placeholder_text?: string }) {
  return (
    <input
      name = { name }
      type = { secure ? "password" : "text" }
      className = "bg-slate-200 dark:bg-slate-700 rounded-lg w-full p-4 my-3 focus:outline-none"
      placeholder = { placeholder_text }
    />
  );
}