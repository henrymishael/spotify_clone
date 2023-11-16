import Image from 'next/image'
import Sidebar from '@/components/sidebar'
import { Cabin } from 'next/font/google'
import Center from '@/components/center'
import { getSession, useSession } from 'next-auth/react'
import { authOptions } from './api/auth/[...nextauth]'
import Player from '@/components/player'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { playlistIdState } from '@/atoms/playlistAtom'
import useSpotify from '@/hooks/useSpotify'
import { artistIdState } from '@/atoms/artistAtom'
import Search from '@/components/search'
import Library from '@/components/library'
import Artist from '@/components/artist'
import Head from 'next/head'
import { isPlayingState, currentTrackIdState } from '@/atoms/songAtom'
// const spotifyApi = useSpotify();
// const { data: session } = useSession();

const cabin = Cabin({ subsets: ['latin'] })

function Home() {

  const [view, setView] = useState("library") //  ["search", "library", "playlist", "artist"]

  // const artistId = useRecoilValue(artistIdState)
  // const isPlaying =useRecoilValue(isPlayingState)


  return (
    <>
    <Head>
      <title>Spotify</title>
    </Head>
    <div className={`bg-black h-screen overflow-hidden  ${cabin.className}`}>
      <main className="flex"> 
          <Sidebar 
            view={view}
            setView={setView}
            playlistIdState={playlistIdState}
          />
          {/* <Center /> */}
          {view === "playlist" && <Center
            setView={setView} 
            playlistIdState={playlistIdState}
            artistIdState={artistIdState}
          /> }
          {view === "search" && <Search 
             setView = {setView}
             playlistIdState={playlistIdState}
             isPlayingState={isPlayingState}
             currentTrackIdState={currentTrackIdState}
          /> }
          {view === "library" && <Library 
            setView = {setView}
            playlistIdState={playlistIdState}
          /> }
          {view === "artist" && <Artist 
            artistIdState={artistIdState}
            isPlayingState={isPlayingState}
            currentTrackIdState={currentTrackIdState}
          /> }
      </main>
      <div className='sticky bottom-0  w-full z-20'>
        <Player />
      </div>
    </div>
    </>
  )
}
export default Home;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
