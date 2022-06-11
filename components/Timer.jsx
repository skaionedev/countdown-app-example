import { useRouter } from 'next/router'
import React, { useRef, useState, useEffect } from 'react'
import Countdown from 'react-countdown'

const Timer = ({ user, refetch }) => {
  const [isPlaying, setIsPlaying] = useState(user.is_playing)
  const [timerMS, setTimerMS] = useState(user.milliseconds_left)
  const [isTimeOver, setIsTimeOver] = useState(false)
  const controllerRef = useRef(null)
  const millisecondsLeftRef = useRef(0)

  const router = useRouter()

  const start = () => {
    writeToLS({
      ...user,
      end_time: Date.now() + millisecondsLeftRef.current,
      is_playing: true
    })
    setIsPlaying(true)
    refetch()
    controllerRef.current.start()
  }
  const pause = () => {
    setTimerMS(millisecondsLeftRef.current)
    writeToLS({
      ...user,
      milliseconds_left: millisecondsLeftRef.current || user.milliseconds_left,
      is_playing: false
    })
    setIsPlaying(false)
    refetch()
    controllerRef.current.pause()
  }

  useEffect(() => {
    if (!user.is_playing || !isPlaying) return
    router.events.on('routeChangeStart', async route => {
      if (route === '/') {
        console.log('returned to Counter')
        const lsData = await JSON.parse(localStorage.getItem('data'))
        const afkFrom = Date.now() - (Date.now() - lsData.afk_time)
        const newEndTime = afkFrom + lsData.milliseconds_left
        const newMSLeft = newEndTime - Date.now()

        setTimerMS(newMSLeft)
        writeToLS({
          ...user,
          end_time: newEndTime,
          milliseconds_left: newMSLeft
        })
        refetch()
      } else {
        console.log(millisecondsLeftRef.current)
        writeToLS({
          ...user,
          milliseconds_left:
            millisecondsLeftRef.current || user.milliseconds_left,
          afk_time: Date.now()
        })
        refetch()
        console.log('gone away from Counter')
      }
    })

    return () => {
      router.events.off('routeChangeStart')
    }
  }, [router.events, user.is_playing])

  return (
    <div style={{ display: 'flex', alignItems: 'center', columnGap: 12 }}>
      <Countdown
        ref={controllerRef}
        date={Date.now() + timerMS}
        onTick={v => {
          millisecondsLeftRef.current = v.total
        }}
        autoStart={isPlaying}
        onComplete={() => setIsTimeOver(true)}
        renderer={props => {
          return (
            <span
              style={{
                padding: 8,
                border: '1px solid #e7e7e7',
                borderRadius: 4
              }}
            >
              {`${props.hours}:${props.minutes}:${props.seconds}`}
            </span>
          )
        }}
      />
      {isTimeOver ? (
        <button>⨂</button>
      ) : (
        <button onClick={isPlaying ? pause : start}>
          {isPlaying ? <span> ⏸ </span> : <span>▶</span>}
        </button>
      )}
    </div>
  )
}

export default Timer

async function writeToLS(payload) {
  await localStorage.setItem('data', JSON.stringify(payload))
}
