import AuthPage from '~/components/Auth/AuthPage';
import type {NextPageWithLayout} from '~/types/NextPage';

const RegisterPage: NextPageWithLayout = () => <AuthPage variant="register" />;
RegisterPage.getLayout = AuthPage.getLayout;

export default RegisterPage;
