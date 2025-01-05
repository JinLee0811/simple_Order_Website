export default function Input({ label, input, type, id, ...props }) {
  return (
    <div className="control">
      <label htmlFor={id}>{label}</label>
      <input {...props} type={type} name={id} required />
    </div>
  );
}
