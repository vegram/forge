/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

function BouncingImage() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 2, y: 2 });

  useEffect(() => {
    const moveImage = () => {
      if (imageRef.current) {
        const imageWidth = imageRef.current.width;
        const imageHeight = imageRef.current.height;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const newX = position.x + velocity.x;
        const newY = position.y + velocity.y;

        if (newX + imageWidth > viewportWidth || newX < 0) {
          setVelocity((v) => ({ ...v, x: -v.x }));
        }
        if (newY + imageHeight > viewportHeight || newY < 0) {
          setVelocity((v) => ({ ...v, y: -v.y }));
        }

        setPosition({ x: newX, y: newY });
      }
    };

    const intervalId = setInterval(moveImage, 10);
    return () => clearInterval(intervalId);
  }, [position, velocity]);

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: 300,
        height: 300,
      }}
    >
      <img
        ref={imageRef}
        src="https://media.tenor.com/ypaZorGIZyMAAAAM/bonk.gif"
        alt="cat being gently bonked by a hammer"
      />
      <div className="font-bold">Knight Hacks When They Forge</div>
    </div>
  );
}

export default function HomePage() {
  return <BouncingImage />;
}
