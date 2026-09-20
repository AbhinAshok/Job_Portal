export default function Loader({ full = false }) {
  return <div className={full ? "loader full" : "loader"}><span /></div>;
}
