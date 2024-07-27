"use client";

import type { IScene } from "./types";

export function Scene(props: { scene: IScene }) {
  return (
    <div className="flex flex-col gap-6">
      {props.scene.elements.map((element, _index) => {
        switch (element.type) {
          // case ElementType.ACTION:
          // return <Action key={index} element={element} />;

          // case ElementType.DIALOGUE:
          // return <Dialog key={index} element={element} />;

          default: {
            return null;
          }
        }
      })}

      {/* <Text {...textProps}>
        A VAST SPHERE OF FIRE, the fire of a thousand suns, slowly eats the
        night-time desert. A line of black type appears:
      </Text>
      <Text {...textProps} className="font-semibold">
        PROMETHEUS STOLE FIRE FROM THE GODS AND GAVE IT TO MAN.
      </Text>
      <Text {...textProps}>
        And the sound of DOZENS OF FEET STAMPING RHYTHMICALLY...
      </Text>
      <Text {...textProps} className="font-semibold">
        FOR THIS HE WAS CHAINED TO A ROCK AND TORTURED FOR ETERNITY.
      </Text>
      <Text {...textProps}>
        ROILING PLASMA expands, the sound of STAMPING GROWS OPPRESSIVE, the
        STAMPING FASTER and FASTER OVER-
      </Text>
      <Text {...textProps}>
        A FACE. Gaunt, tense, EYES TIGHTLY SHUT. The face SHUDDERS the sound
        CEASES AS MY EYES OPEN, STARING INTO THE CAMERA:
      </Text>
      <Text {...textProps}>
        Peer into my soul- J. ROBERT OPPENHEIMER, aged fifty, close cropped
        greying hair. The gentle sounds of bureaucracy...
      </Text>
      <Text {...textProps}>
        SUPER TITLE:{" "}
        <Text {...textProps} className="font-semibold">
          "1. FISSION"
        </Text>
      </Text> */}
      {/* <div className="flex flex-col items-center">
        <div className={cn("flex flex-col", dialogWidth)}>
          <Text {...textProps} className="text-center">
            Voice (O.S.)
          </Text>
          <Text {...textProps}>
            Dr Oppenheimer, as we begin, I believe you have a statement to read
            into the record?
          </Text>
        </div>
      </div>
      <Text {...textProps}>I glance down at my notes.</Text>
      <div className="flex flex-col items-center">
        <div className={cn("flex flex-col", dialogWidth)}>
          <Text {...textProps} className="text-center">
            OPPENHEIMER
          </Text>
          <Text {...textProps}>Yes, your honour-</Text>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className={cn("flex flex-col", dialogWidth)}>
          <Text {...textProps} className="text-center">
            SECOND VOICE (O.S.)
          </Text>
          <Text {...textProps}>We’re not judges, doctor.</Text>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className={cn("flex flex-col", dialogWidth)}>
          <Text {...textProps} className="text-center">
            OPPENHEIMER
          </Text>
          <Text {...textProps}>No. Of course.</Text>
          <Text {...textProps} className="ml-8">
            (I start reading)
          </Text>
          <Text {...textProps}>
            Members of the Security Board, the so-called derogatory information
            in your indictment of me cannot be fairly understood except in the
            context of my life and work. This answer is a summary of relevant
            aspects of my life in more or less chronological order...
          </Text>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className={cn("flex flex-col", dialogWidth)}>
          <Text {...textProps} className="items-center text-center">
            SENATE AIDE (V.O.)
          </Text>
          <Text {...textProps}>How long did he testify?</Text>
        </div>
      </div> */}
    </div>
  );
}
