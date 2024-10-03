//Function for getting random field positions
const allPos = [
  [0.0, 10.0, 1.0], //Keeper

  [-1.0, 12.0, 1.0], //First Slip

  [-1.5, 11.75, 1.0], //Second Slip

  [-2.0, 11.5, 1.0], //Third Slip

  [-2.5, 11.25, 1.0], //Fourth Slip

  [-3.0, 11.0, 1.0], //Fifth Slip

  [-3.5, 10.75, 1.0], //Sixth Slip

  [-6.5, 10.75, 1.0], //Fly Slip

  [-9, 10, 1.0], //Gully

  [-12.5, 6, 1.0], //Point

  [-12, 7.5, 1.0], //Backward Point

  [-4, 4, 1.0], //Silly Point

  [-13, 4.5, 1.0], //Forward Point

  [-13.5, 0, 1.0], //Cover Point

  [-13.5, -4, 1.0], //Cover

  [-6, -2, 1.0], //Short Cover

  [-13, -6, 1.0], //Extra Cover

  [-5, -8, 1.0], //Mid off

  [-5, -12, 1.0], //Deep Mid off

  [-5, -6, 1.0], //Short Mid off

  [-2.5, 1, 1.0], //Silly Mid off

  [5, -8, 1.0], //Mid on

  [5, -12, 1.0], //Deep Mid on

  [5, -6, 1.0], //Short Mid on

  [2.5, 1, 1.0], //Silly Mid on

  [6, -2, 1.0], //Short Cover

  [13.5, -4, 1.0], //Mid wicket

  [4, 4, 1.0], //Short leg

  [13.5, 4, 1.0], //Square leg

  [13.5, 0, 1.0], //Forward Square leg

  [13.5, -4, 1.0], //Backward Square leg

  [3.0, 11.0, 1.0], //Leg slip

  [9, 10, 1.0], //Leg Gully

  [8, 12, 1.0], //Backward Short Leg

  [12, 15, 1.0], //fine leg

  [10.0, 13, 1.0], //Short fine leg

  [14, 17, 1.0], //Deep fine leg

  [12, 19, 1.0], //Long leg

  [-12, 15, 1.0], //third man

  [-10, 13, 1.0], //Short third man

  [-14, 17, 1.0], //Deep third man

  [-12, 19, 1.0], //Fine third man
  [-16, 14, 1.0], //Square fine leg

  [-20, 8.5, 1.0], //Deep Backward Point

  [-22, 6, 1.0], //Deep Point

  [-23, 0, 1.0], //Deep Cover Point

  [-22, -6, 1.0], //Deep Cover

  [-21, -10, 1.0], //Sweeper Cover

  [-12, -20, 1.0], //Wide Long off

  [-8, -22, 1.0], //Long off

  [-4, -23, 1.0], //Straight Long offs

  [0, -23, 1.0], //Straight Hit

  [8, -22, 1.0], //Long on

  [4, -23, 1.0], //Straight Long on

  [21, -10, 1.0], //Deep Forward Mid wicket

  [22, -6, 1.0], //Deep Mid wicket

  [-23, 2, 1.0], //Deep Forward Square leg

  [22, 6, 1.0], //Deep Square leg

  [20, 8.5, 1.0], //Deep Backward Square leg
];
function getRandomSubarray(arr: number[][], subarrayLength: number) {
  const indexesArr = [0];
  while (indexesArr.length < subarrayLength) {
    const rand = Math.floor(Math.random() * arr.length);
    if (!indexesArr.includes(rand)) {
      indexesArr.push(rand);
    }
  }
  return indexesArr.map((i) => arr[i]).flat();
}

const randArray = getRandomSubarray(allPos, 10);
const groupSize = 3;

const fieldPositions: number[][] = [];
for (let i = 0; i < randArray.length; i += groupSize) {
  fieldPositions.push(randArray.slice(i, i + groupSize));
}

export { fieldPositions };
