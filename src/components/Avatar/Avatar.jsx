import { getAvatarColor, getInitials } from '../../utils';

export default function Avatar({ name, size = 36, fontSize = '0.8rem' }) {
  const [bg, fg] = getAvatarColor(name);
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize,
      }}
    >
      {getInitials(name)}
    </div>
  );
}
