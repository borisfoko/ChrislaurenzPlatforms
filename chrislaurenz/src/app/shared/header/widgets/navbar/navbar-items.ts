// Menu
export interface Menu {
  path?: string;
  title?: string;
  type?: string;
  image?: string;
  children?: Menu[];
}

export const MENUITEMS: Menu[] = [
	{
		path: '/', title: 'home', type: 'link'
	},
	{
		title: 'women-fashion', type: 'sub', children: [
			{ path: '/collection/women', title: 'dresses',  type: 'link' },
			{ path: '/collection/women', title: 'skirts',  type: 'link' },
			{ path: '/collection/women', title: 'westarn-wear',  type: 'link' },
			{ path: '/collection/women', title: 'ethic-wear',  type: 'link' },
			{ path: '/collection/women', title: 'sports-wear',  type: 'link' },
			{ path: '/collection/women', title: 'bottom-wear',  type: 'link' },
			{
				title: 'accessories', type: 'sub', children: [
					{ path: '/collection/women', title: 'fashion-jewellery',  type: 'link' },
					{ path: '/collection/women', title: 'caps-and-hats',  type: 'link' },
					{ path: '/collection/women', title: 'precious-jewellery',  type: 'link' },
					{ path: '/collection/women', title: 'necklaces',  type: 'link' },
					{ path: '/collection/women', title: 'earrings',  type: 'link' },
					{ path: '/collection/women', title: 'rings-wrist-wear',  type: 'link' }
				]	
			}
		]
	},
	{
		title: 'mens-fashion', type: 'sub', children: [
			{ path: '/collection/men', title: 'sports-wear',  type: 'link' },
			{ path: '/collection/men', title: 'bottom',  type: 'link' },
			{ path: '/collection/men', title: 'sports-wear',  type: 'link' },
			{ path: '/collection/men', title: 'shirts',  type: 'link' },
			{
				title: 'men-accessories',  type: 'sub', children: [
					{ path: '/collection/men', title: 'ties',  type: 'link' },
					{ path: '/collection/men', title: 'cufflinks',  type: 'link' },
					{ path: '/collection/men', title: 'pockets-squares',  type: 'link' },
					{ path: '/collection/men', title: 'helmets',  type: 'link' },
					{ path: '/collection/men', title: 'scarves',  type: 'link' },
					{ path: '/collection/men', title: 'phone-cases',  type: 'link' }
				]
			}
		]
	},
	{
		title: 'boys-girls', type: 'sub', children: [
			{
				title: 'girls-fashion',  type: 'sub', children: [
					{ path: '/collection/girl', title: 'sports-wear',  type: 'link' },
					{ path: '/collection/girl', title: 'ethic-wear',  type: 'link' },
					{ path: '/collection/girl', title: 'sports-wear',  type: 'link' },
					{ path: '/collection/girl', title: 'top',  type: 'link' },
					{ path: '/collection/girl', title: 'bottom-wear',  type: 'link' },
					{ path: '/collection/girl', title: 'ethic-wear',  type: 'link' }
				]
			},
			{
				title: 'boys-fashion',  type: 'sub', children: [
					{ path: '/collection/boy', title: 'sports-wear',  type: 'link' },
					{ path: '/collection/boy', title: 'ethic-wear',  type: 'link' },
					{ path: '/collection/boy', title: 'sports-wear',  type: 'link' },
					{ path: '/collection/boy', title: 'bottom-wear',  type: 'link' },
					{ path: '/collection/boy', title: 'ethic-wear',  type: 'link' }
				]
			},
			{
				title: 'kids-fashion', type: 'sub', children: [
					{ path: '/collection/kids', title: 'sports-wear',  type: 'link' },
					{ path: '/collection/kids', title: 'ethic-wear',  type: 'link' },
					{ path: '/collection/kids', title: 'sports-wear',  type: 'link' },
					{ path: '/collection/kids', title: 'bottom-wear',  type: 'link' },
					{ path: '/collection/kids', title: 'ethic-wear',  type: 'link' }
				]
			}
		]
	},
	{
		title: 'our-company', type: 'sub', children: [
		  { path: '/about-us', title: 'about-us', type: 'link' },
		  { path: '/contact', title: 'contact', type: 'link' },                               
	      { path: '/faq', title: 'FAQ', type: 'link' }      
	    ]
	},
	{
		path: '/blog/right-sidebar', title: 'blog', type: 'link'
	}
]