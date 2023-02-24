export default function Header({ title }) {
  return (
    <div>
      <title>{title ? title + " | HopOut" : "HopOut"}</title>
      <link rel="icon" href="/favicon.ico" />
    </div>
  )
}