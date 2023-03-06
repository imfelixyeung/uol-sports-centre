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
      className="md:absolute inset-0 w-full h-full object-cover"
      key={index}
    />
  ));

  return (
    <div className="text-black bg-white">
      <div className="py-8 container flex flex-col gap-6">
        <Typography as="h2" styledAs="h1" uppercase>
          {'/// Gallery'}
        </Typography>
        <div className="grid md:grid-cols-3 md:grid-rows-6 gap-3 aspect-square md:max-h-[80vh]">
          <div className="md:row-span-4 relative">{imageElements[0]}</div>
          <div className="md:row-span-2 relative">{imageElements[1]}</div>
          <div className="md:row-span-3 relative">{imageElements[2]}</div>
          <div className="md:row-span-4 relative">{imageElements[3]}</div>
          <div className="md:row-span-3 relative">{imageElements[4]}</div>
          <div className="md:row-span-2 relative">{imageElements[5]}</div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
