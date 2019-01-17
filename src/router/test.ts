const _ = () => import("../sites/test/Test.vue")
const _test = () => import("../sites/test/Test.vue")

export default [
	{
		path: '/test/',
		component: _,
		name: '_'
	},
	{
		path: '/test/test',
		component: _test,
		name: '_test'
	},
	{
		path: '/framework/nntvue/',
		component: _,
		name: 'devops_'
	},
	{
		path: '/framework/nntvue/test',
		component: _test,
		name: 'devops_test'
	}
]
