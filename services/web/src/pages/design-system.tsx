import Button from '~/components/Button';
import Typography from '~/components/Typography';

const TestPage = () => {
  return (
    <div className="flex gap-3 flex-col items-start m-3">
      <Typography as="h1">Design System</Typography>
      <Typography as="h2">Buttons</Typography>
      <section className="ml-6">
        <Button intent="primary">Primary Button</Button>
        <Button intent="secondary">Secondary Button</Button>
        <Button intent="primary" wide>
          Wider Button
        </Button>
      </section>
      <Typography as="h2">Headings</Typography>
      <section className="ml-6">
        <Typography as="h1" styledAs="display">
          Display
        </Typography>
        <Typography as="h1">Heading 1</Typography>
        <Typography as="h2">Heading 2</Typography>
        <Typography as="h3">Heading 3</Typography>
        <Typography as="h4">Heading 4</Typography>
        <Typography as="h5">Heading 5</Typography>
        <Typography as="h6">Heading 6</Typography>
        <Typography as="p">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi aliquam
          quod velit omnis illo perferendis, iure accusamus eligendi fugiat
          consequatur blanditiis et, repellendus a? Molestias atque eveniet id
          cumque placeat!
        </Typography>
      </section>
    </div>
  );
};

export default TestPage;
