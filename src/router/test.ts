const _test = () => import("../components/Test.vue")

export default [
	{
		path: '/test',
		component: _test,
		name: '_test'
	},
	{
		path: '/framework/nntvue/test',
		component: _test,
		name: 'devops_test'
	}
]
