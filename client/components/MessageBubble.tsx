export default function MessageBubble({ role, content }: any) {
  return (
    <div className={`p-3 rounded-lg max-w-xl ${
      role === "user" ? "bg-blue-200 ml-auto" : "bg-gray-300"
    }`}>
      {content}
    </div>
  );
}