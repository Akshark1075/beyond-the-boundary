function getRandomCoordinates() {
  const minWidth = 350;
  const minHeight = 350;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const maxX = screenWidth - minWidth;
  const maxY = screenHeight - minHeight;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  return { x: randomX, y: randomY };
}
export default getRandomCoordinates;
