// app/page.tsx
'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Image from "next/image";

interface ArtistData {
  image: string;
  name: string;
  monthlySubscribers: number;
  topTracks: Array<{ id: string; name: string }>;
}

export default function Home() {
  const [artist, setArtist] = useState<string>('');
  const [artistData, setArtistData] = useState<ArtistData | null>(null);

  const handleSearch = async () => {
    try {
      // Fetch access token
      const tokenResponse = await fetch("/api/spotify", { method: "POST" });
      if (!tokenResponse.ok) {
        throw new Error('Failed to fetch access token');
      }
      const { access_token } = await tokenResponse.json();
  
      // Fetch artist data
      const artistResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=artist`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
  
      if (!artistResponse.ok) {
        throw new Error('Failed to fetch artist data');
      }
  
      const { artists } = await artistResponse.json();
      if (artists.items.length > 0) {
        const artistInfo = artists.items[0];
        
        // Fetch monthly subscribers and top tracks
        const monthlySubscribers = await fetch(
          `https://api.spotify.com/v1/artists/${artistInfo.id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        ).then(res => {
          if (!res.ok) throw new Error('Failed to fetch monthly subscribers');
          return res.json();
        });
  
        const topTracksResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artistInfo.id}/top-tracks?market=US`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
  
        if (!topTracksResponse.ok) {
          throw new Error('Failed to fetch top tracks');
        }
  
        const topTracks = await topTracksResponse.json();
        setArtistData({
          image: artistInfo.images[0]?.url,
          name: artistInfo.name,
          monthlySubscribers: monthlySubscribers.followers.total,
          topTracks: topTracks.tracks.slice(0, 5),
        });
      } else {
        setArtistData(null); // No artist found
      }
    } catch (error) {
      console.error(error);
      setArtistData(null); // Clear any existing data
    }
  };
  
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="container py-20 flex justify-center items-center ">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          {artistData && (
            <div>
              <Image src={artistData.image} alt={artistData.name} width={150} height={150} className='mb-7 rounded-full object-contain' />
              <p className='font-bold text-base'>Artist: <span className='font-normal text-xl text-white'>{artistData.name}</span></p>
              <p className="mb-10 font-bold text-base">Monthly Subscribers: <span className='font-normal text-xl text-white'>{artistData.monthlySubscribers} <span className='text-sm'>monthly subs</span></span></p>
              <ul className='font-bold text-xl'>
                Top Tracks:
                {artistData.topTracks.map(track => (
                  <li key={track.id} className='list-disc font-normal text-base ml-10 text-white'>{track.name}</li>
                ))}
              </ul>
            </div>
          )}
          <Label htmlFor="artist" className='mt-10'>Artist</Label>
          <Input
            type="text"
            id="artist"
            placeholder="Search Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className='text-white'
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
    </>
  );
}
