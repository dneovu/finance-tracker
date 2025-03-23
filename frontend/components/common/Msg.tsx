interface MsgProps {
  data: {
    message: string;
  };
}

const Msg = ({ data }: MsgProps) => {
  return (
    <div className="msg-container">
      <p className="msg-title">{data.message}</p>
    </div>
  );
};

export default Msg;
