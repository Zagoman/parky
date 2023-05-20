import { useRouter } from "next/router"

type AnchorProps = {
  href: string
  className: string
  children: JSX.Element
}

function Anchor({ href, className, children }: AnchorProps) {
  const router = useRouter()
  return (
    <a
      onClick={(event) => {
        event.preventDefault()
        void router.push(href)
      }}
      href={href}
      className={className}
    >
      {children}
    </a>
  )
}

export default Anchor
