import Link from 'next/link'
import { Button } from 'antd'

export default function Home() {
  return (
    <>
      <div>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
      <div>
        <Link href="/detail">
          <Button>Go to app</Button>
        </Link>
      </div>
    </>
  )
}
