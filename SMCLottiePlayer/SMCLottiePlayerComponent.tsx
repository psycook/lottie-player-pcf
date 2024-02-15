//import "./styles.css";
import React, { useEffect, useRef } from 'react';
import { Player, PlayerDirection, PlayerEvent, Controls } from "@lottiefiles/react-lottie-player";

export interface ISMCLottiePlayerComponentProps {
  onEventChange: (event: string) => void;
  src?: string;
  speed?: number;
  width?: number;
  height?: number;
  controls?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  background?: string;
  direction?: number;
  state?: string;
  keepLastFrame?: boolean;
}

export default function SMCLottiePlayerComponent(props: ISMCLottiePlayerComponentProps) {

  // create attributes
  const playerRef = useRef<Player|null>(null);

  const source = props.src ? props.src : "https://assets3.lottiefiles.com/packages/lf20_1x2xqz.json";
  const speed = props.speed ? props.speed : 1.0;
  const width = props.width ? props.width : 500;
  const height = props.height ? props.height : 500;
  const controls = props.controls ? props.controls : false;
  const loop = props.loop ? props.loop : false;
  const autoPlay = props.autoPlay ? props.autoPlay : false;
  const background = props.background ? props.background : "transparent";
  const direction = props.direction ? props.direction : 1;
  const state = props.state ? props.state : "stopped";
  const keepLastFrame = props.keepLastFrame ? props.keepLastFrame : true;

  // set the player attributes if we have a reference
  useEffect(() => {
    if (playerRef?.current !== null) {

      // update the attributes
      playerRef.current.setLoop(loop as boolean);
      playerRef.current.setPlayerDirection(direction as PlayerDirection);
      playerRef.current.setPlayerSpeed(speed as number);

      // set the playing state
      switch(state.toLocaleLowerCase()) {
        case "stopped":
          if(playerRef.current.state.playerState !== "stopped") playerRef.current.stop();
          break;
        case "playing":
          if(playerRef.current.state.playerState !== "playing") playerRef.current.play();
          break;        
      }
    }
  });

  // notify the parent of the event status
  function notifyEvent(state: PlayerEvent) {
    if(state === "frame") return;
    props.onEventChange(state.toString());
  }

  // return the component
  return (
    <div>
      <Player
        ref={playerRef}
        autoplay={autoPlay as boolean}
        loop={loop as boolean}
        speed={speed as number}
        src={source as string}
        background={background as string}
        direction={direction as PlayerDirection}
        style={{ height: `${height}px`, width: `${width}px` }}
        onEvent={(event) => notifyEvent(event)}
        keepLastFrame={keepLastFrame as boolean}
       >
        <Controls
          visible={controls}
          buttons={[
            "play",
            "repeat",
            "frame",
            "debug",
            "snapshot",
            "background"
          ]}
        />
      </Player>
    </div>
  );
  
}
