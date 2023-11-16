import { artistIdState } from '@/atoms/artistAtom';
import { currentTrackIdState, isPlayingState } from '@/atoms/songAtom';
import useSongInfo from '@/hooks/useSongInfo';
import useSpotify from '@/hooks/useSpotify'
import { millisToMinutesAndSeconds } from '@/lib/time';
import { PlayIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useState } from 'react'
import { BsFillPlayFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';


function Song({order, track, setView}) {
    const spotifyApi = useSpotify();
    const [hover, setHover] = useState(false)
    const [currentTrackid, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [artistid, setArtistId] = useRecoilState(artistIdState)
    const {data: session} = useSession()
    const songInfo = useSongInfo()
  
    const playSong = () => {
      setCurrentTrackId(track.track.id);
      setIsPlaying(true);
      
     
      spotifyApi.play({
        uris: [track.track.uri]
      });
    };

    // async function PlaySong() {
    //   setCurrentTrackId(track.track.id);
    //   setIsPlaying(true);
    //  if (session && session.accessToken) {
    //   const response = await fetch('https://api.spotify.com/v1/me/player/play',{
    //     method: 'PUT',
    //     headers: {
    //           Authorization: `Bearer ${session.accessToken}`
    //     },
    //     body: JSON.stringify({
    //       urls:[track.url]
    //     })

    //   })
    //   console.log("on play", response.status)
    //  }}

  return (
    <>
    <Head>
      <title> {songInfo?.name}  ~ {songInfo?.artists[0]?.name} | Spotify Playlist</title>
    </Head>
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className='text-neutral-400 grid grid-cols-2 py-4 px-5 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-pointer'>
      <div className='flex items-center space-x-4'>
        {hover ? <BsFillPlayFill onClick={playSong} className='h-5 w-5 text-white'/> : <p className='w-5'>{order + 1}</p>}
        <img className='h-10 w-10' src={track.track.album.images[0].url} alt="" />
        <div>
            <p className='text-white sm:w-36 lg:w-64 truncate'>{track.track.name}</p>
            <p onClick={()=>{
                setView("artist")
                setArtistId(track.track.artists[0].id)
                console.log(artistid)
              }} 
              className='w-40 hover:underline'>{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className='flex items-center justify-between ml-auto md:ml-0'>
        <p className='w-40 sm:hidden md:block '>{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
    </>
  )
}

export default Song
