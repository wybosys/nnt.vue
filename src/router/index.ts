const _ = () => import("../nnt/Site.vue")
const sample = () => import("./sample")
const test = () => import("./test")

export default {
	routes: [
		{
			path: '/',
			component: _,
			name: '_site_'
		},
		{
			path: '/:site',
			component: _,
			name: '_site__'
		},
		{
			path: '*',
			component: _,
			name: '_any_'
		}
	],
	sites: {
		sample: sample,
		test: test,
		default: sample
	}
}