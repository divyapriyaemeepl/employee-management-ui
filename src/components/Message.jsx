function Message({ text }) {
  if (!text) return null;
  return (
    <div className="success-message" role="status">
      {text}
    </div>
  );
}

export default Message;