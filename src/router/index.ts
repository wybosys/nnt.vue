const _ = () => import("../nnt/Site.vue")

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
		}
	]
}