import Button from '~/components/Button';

const TestPage = () => {
  return (
    <div className="flex gap-3 flex-col items-start m-3">
      <h1>Buttons</h1>
      <Button intent="primary">Primary Button</Button>
      <Button intent="secondary">Secondary Button</Button>
      <Button intent="primary" wide>
        Wider Button
      </Button>
    </div>
  );
};

export default TestPage;
