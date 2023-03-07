import AuthPage from '~/components/Auth/AuthPage';
import type {NextPageWithLayout} from '~/types/NextPage';

const LoginPage: NextPageWithLayout = () => <AuthPage variant="login" />;
LoginPage.getLayout = AuthPage.getLayout;

export default LoginPage;
