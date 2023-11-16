import { currentTrackIdState, isPlayingState } from '@/atoms/songAtom';
import useSongInfo from '@/hooks/useSongInfo';
import useSpotify from '@/hooks/useSpotify'
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { BsFillPlayCircleFill, BsFillSkipEndFill, BsFillSkipStartFill, BsPauseCircleFill, BsVolumeDown, BsVolumeUpFill } from 'react-icons/bs'
import { PiShuffleBold } from 'react-icons/pi'
import { LuRepeat } from 'react-icons/lu'
import { useRecoilState } from 'recoil';
import Head from 'next/head';
import { debounce } from 'lodash';


function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log('Now playing: ', data.body?.item);
        setCurrentIdTrack(data.body?.item?.id);
        console.log(data.body)
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  }

  const handlePlaypause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false)
      } else {
        spotifyApi.play();
        setIsPlaying(true)
      }
    })
  }
  
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session])

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) =>{});
    }, 500),
    []
  );
  return (
  
    <div className='h-[5.5rem] bg-black border-neutral-700 text-white grid grid-cols-3 xsm:text-[10px] md:text-xs  sm:px-2 md:px-8 xsm:gap-3 '>
      <div className='flex items-center space-x-4 '>
        <img className='rounded-[3px] md:h-14 md:w-14 xsm:w-12 xsm: h-12' src={songInfo?.album.images?.[0]?.url} alt="" />
          <div>
            <h3 className='md:text-sm xsm:text-[12px]  hover:underline  cursor-pointer truncate'>{songInfo?.name.slice(0,30)}...</h3>
            <p className='hover:underline opacity-80 cursor-pointer'>
              {songInfo?.artists?.[0]?.name}
            </p>
          </div>
      </div>
      <div className='flex items-center xsm:translate-x-[35%] md:translate-x-0 md:justify-center xsm:gap-2 sm:gap-3 md:gap-8  '>
      <PiShuffleBold className='button  text-gray-400 hover:text-white h-5 w-5'/>
      <BsFillSkipStartFill 
      onClick={() => spotifyApi.skipToPrevious()}
      className='button  text-gray-400 hover:text-white h-6 w-6' />
      {isPlaying ? (
      <BsPauseCircleFill onClick={handlePlaypause} className='button h-9 w-9 text-white'/>) :( 
      <BsFillPlayCircleFill onClick={handlePlaypause} className='button h-9 w-9 text-white'/>
      )}
      <BsFillSkipEndFill 
      onClick={() => spotifyApi.skipToNext()}
      className='button  text-gray-400 hover:text-white h-6 w-6' />
      <LuRepeat className='button  text-gray-400 hover:text-white h-5 w-5' />
      </div>
      <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
        <BsVolumeDown 
        onClick={() => volume > 0 && setVolume(volume - 10) }
        className='button text-gray-400 hover:text-white h-6 w-6'/>
          <input
            onChange={e => setVolume(Number(e.target.value))} 
            className='h-[4px]   w-14 md:w-28 rounded-full' type="range" 
            value={volume}
            min={0} 
            max={100}
            />
        <BsVolumeUpFill 
        onClick={() => volume < 100 && setVolume(volume + 10)}
        className='button text-gray-400 hover:text-white h-5 w-5 ' />
      </div>
    </div>

    // <div className='h-24 bg-gradient-to-b from-black to-neutral-800 text-white grid grid-cols-3 text-xs md:text-base sm:px-2 md:px-8'>
    //   {/* left */}
    //   <div className='flex items-center space-x-4 text-white'>
    //     <img className=' h-10 w-10' src={songInfo?.album.images?.[0]?.url} alt="" />
    //     <div>
    //       <h3>{songInfo?.name}</h3>
    //       <p>{songInfo?.artists?.[0]?.name}</p>
    //     </div>
    //     center
    //   </div>
    // </div>
   
  );
}

export default Player


//BsFillSkipStartFill
//BsFillSkipEndFill
//PiShuffleBold
//LuRepeat
//LuRepeat1
//LiaMicrophoneAltSolid