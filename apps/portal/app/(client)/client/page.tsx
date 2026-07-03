import { redirect } from 'next/navigation';

const ClientRootPage = () => {
	redirect('/client/projects');
};

export default ClientRootPage;
