import { useEffect, useState } from 'react'
import { data } from '../mockData'
import Timer from '../components/Timer'

export default function Home() {
  const [user, setUser] = useState(null)

  // init mockData
  useEffect(() => {
    const dataFromLS = localStorage.getItem('data')
    if (dataFromLS == null) {
      localStorage.setItem('data', JSON.stringify(data))
      setUser(data)
    } else {
      setUser(JSON.parse(dataFromLS))
    }
  }, [])

  const refetch = () => {
    const dataFromLS = localStorage.getItem('data')
    setUser(JSON.parse(dataFromLS))
  }

  if (!user) return null

  return (
    <>
      <Timer user={user} refetch={refetch} />
    </>
  )
}
