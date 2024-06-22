import { parseMovieScript } from ".";

// Example usage with the provided scene
const script = `
INT. ROOM 2022, ATOMIC ENERGY COMMISSION -- DAY (COLOUR)

Robb gets right in my face, incredulous-

ROBB
You mean having worked night and day for three years to build the bomb, you then argued it shouldn’t be used?

OPPENHEIMER
No. I was asked by the Secretary of War what the views of scientists were- I gave the views against and the views for.

ROBB
You supported the dropping of the atom bomb on Japan, didn’t you?

OPPENHEIMER (CONT’D)
What do you mean 'support'?

ROBB (CONT’D)
You helped pick the target, didn’t you?

OPPENHEIMER
I did my job- I was not in a policy-making position at Los Alamos- I would have done anything that I was asked to do-

ROBB
You would have made the H-bomb too wouldn’t you?

OPPENHEIMER
I couldn’t.

The STAMPING breaks rhythm to become CACOPHONOUS...

ROBB
I didn’t ask you that, doctor!

OPPENHEIMER (CONT’D)
I would have worked on it, yes. But to run a laboratory is one thing, to advise a government is another.

THE LIGHT OF A THOUSAND SUNS POURS IN THE WINDOW...

CUT TO:
`;

const parsedScript = parseMovieScript(script);
console.log(JSON.stringify(parsedScript, null, 2));
