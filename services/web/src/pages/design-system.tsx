import Button from '~/components/Button';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';

const TestPage = () => {
  return (
    <>
      <Seo title="Design System" />
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
          <Typography as="h1" styledAs="display1">
            Display 1
          </Typography>
          <Typography as="h1" styledAs="display2">
            Display 2
          </Typography>
          <Typography as="span" styledAs="subtext">
            Subtext
          </Typography>
          <Typography as="h1">Heading 1</Typography>
          <Typography as="h2">Heading 2</Typography>
          <Typography as="p">
            Paragraph Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Animi aliquam quod velit omnis illo perferendis, iure accusamus
            eligendi fugiat consequatur blanditiis et, repellendus a? Molestias
            atque eveniet id cumque placeat!
          </Typography>
        </section>
      </div>
    </>
  );
};

export default TestPage;
