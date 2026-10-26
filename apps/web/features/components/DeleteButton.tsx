"use client";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      className="text-red-600 hover:underline"
      onClick={(e) => {
        if (!confirm("Delete this game permanently?")) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}
