import ReactPlayer from 'react-player/youtube';

export default function Video() {
  return (
    <ReactPlayer
      url="https://www.youtube.com/watch?v=atQOxz9a1zo"
      playing
      controls={false}
      width="560px"
      height="315px"
    />
  );
}
