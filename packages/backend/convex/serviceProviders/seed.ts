import { internalMutation } from '../_generated/server';
import { buildServiceProviderSearchText } from '../lib/buildSearchText';

interface ServiceProviderInput {
	company: string;
	contacts: Array<{ name: string; email: string; phone: string }>;
	email: string;
	name: string;
	phone: string;
	// Trade names from the trades seed — mapped to IDs at runtime
	trades: string[];
}

const SERVICE_PROVIDERS_DATA: ServiceProviderInput[] = [
	{
		company: 'Bodentechnik Pty Ltd',
		name: 'Tim Boden',
		email: 'info@expresssoiltesting.com',
		phone: '0431 314 767',
		trades: ['Earthworks & Excavation'], // soil testing
		contacts: [],
	},
	{
		company: 'VIPER Soil Testing',
		name: 'Mitch McGilvery',
		email: 'mitch@vipersoiltesting.com.au',
		phone: '0472 707 813',
		trades: ['Earthworks & Excavation'], // soil testing
		contacts: [{ name: '', email: 'admin@vipersoiltesting.com.au', phone: '' }],
	},
	{
		company: 'Contour Surveys',
		name: 'John Muldowney',
		email: 'john.muldowney@contoursurveys.com.au',
		phone: '0447 835 764',
		trades: ['Surveying'],
		contacts: [],
	},
	{
		company: 'TP Design',
		name: 'Tamim Rastagar',
		email: 'tamim_ras@hotmail.com',
		phone: '+61 490 480 050',
		trades: [], // architect/building designer — no matching trade yet
		contacts: [],
	},
	{
		company: 'Akwika Excavations Pty Ltd',
		name: '',
		email: 'accounts@akwika.com.au',
		phone: '07 3206 3555',
		trades: ['Earthworks & Excavation'],
		contacts: [
			{
				name: 'Lincoln',
				email: 'Lincoln@akwika.com.au',
				phone: '0419 155 169',
			},
		],
	},
	{
		company: 'REDDY EARTHMOVERS Pty Ltd',
		name: 'Ram Reddy',
		email: 'reddyearthmovers99@gmail.com',
		phone: '',
		trades: ['Earthworks & Excavation'],
		contacts: [],
	},
	{
		company: 'Bhai Electrical',
		name: 'Hitesh Bhai',
		email: 'hdave212@yahoo.com',
		phone: '+61 425 054 057',
		trades: ['Electrical'],
		contacts: [],
	},
	{
		company: 'Vidgil Pty Ltd',
		name: 'Cathy Dickson',
		email: 'admin@vidgil.com.au',
		phone: '07 3289 6480',
		trades: ['Fencing'], // silt fence installer
		contacts: [],
	},
	{
		company: 'Sigma Building Certification Pty Ltd',
		name: 'Charles Fung',
		email: 'info@sigmabcert.com',
		phone: '0405 236 584',
		trades: ['Building Certification'],
		contacts: [],
	},
	{
		company: 'REII Building Certification',
		name: 'Philip Umme',
		email: 'ummephilip@gmail.com',
		phone: '0449 593 036',
		trades: ['Building Certification'],
		contacts: [
			{
				name: 'Philip Umme',
				email: 'Philip@reiibuildingcertification.com.au',
				phone: '',
			},
		],
	},
	{
		company: 'Structure Engineering Pty Ltd',
		name: 'Basem Armanious',
		email: 'Basem@structureengineering.net.au',
		phone: '0466 035 815',
		trades: ['Structural Engineering'],
		contacts: [],
	},
	{
		company: 'CL Engineering Australia',
		name: 'Richard',
		email: 'clengineeringaustralia@gmail.com',
		phone: '0451 886 188',
		trades: ['Structural Engineering'],
		contacts: [],
	},
	{
		company: 'Tarun Jangra Building Designers',
		name: 'Tarun Jangra',
		email: 'tarun@tjbuildingdesigners.com.au',
		phone: '0431 287 724',
		trades: [], // architect/building designer — no matching trade yet
		contacts: [],
	},
];

export const populate = internalMutation({
	args: {},
	handler: async (ctx) => {
		const allExisting = await ctx.db.query('serviceProviders').collect();
		const existingCompanies = new Set(allExisting.map((sp) => sp.company));

		const allTrades = await ctx.db.query('trades').collect();
		const tradeMap = new Map(allTrades.map((t) => [t.name, t._id]));

		let inserted = 0;
		let skipped = 0;
		for (const sp of SERVICE_PROVIDERS_DATA) {
			if (existingCompanies.has(sp.company)) {
				skipped++;
				continue;
			}

			const tradeIds = sp.trades.flatMap((name) => {
				const id = tradeMap.get(name);
				return id !== undefined ? [id] : [];
			});

			await ctx.db.insert('serviceProviders', {
				company: sp.company,
				name: sp.name,
				email: sp.email,
				phone: sp.phone,
				tradeIds,
				contacts: sp.contacts,
				searchText: buildServiceProviderSearchText(
					sp.company,
					sp.name,
					sp.email,
					sp.phone
				),
			});
			inserted++;
		}

		return { inserted, skipped };
	},
});
