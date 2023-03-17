import Typography from '../Typography';

const images = [
  '/assets/images/pexels-li-sun-2475875.jpg',
  '/assets/images/pexels-andrea-piacquadio-3757954.jpg',
  '/assets/images/pexels-ivan-samkov-4164761.jpg',
  '/assets/images/pexels-cottonbro-studio-4056529.jpg',
  '/assets/images/pexels-paulo-guilherme-mouta-9544955.jpg',
  '/assets/images/pexels-mister-mister-3490348.jpg',
];

const Gallery = () => {
  const imageElements = images.map((image, index) => (
    <img
      src={image}
      alt="Gallery Item"
      className="inset-0 h-full w-full object-cover md:absolute"
      key={index}
    />
  ));

  return (
    <div className="bg-white text-black">
      <div className="container flex flex-col gap-6 py-8">
        <Typography.h2 styledAs="h1" uppercase>
          {'/// Gallery'}
        </Typography.h2>
        <div className="grid aspect-square gap-3 md:max-h-[80vh] md:grid-cols-3 md:grid-rows-6">
          <div className="relative md:row-span-4">{imageElements[0]}</div>
          <div className="relative md:row-span-2">{imageElements[1]}</div>
          <div className="relative md:row-span-3">{imageElements[2]}</div>
          <div className="relative md:row-span-4">{imageElements[3]}</div>
          <div className="relative md:row-span-3">{imageElements[4]}</div>
          <div className="relative md:row-span-2">{imageElements[5]}</div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
